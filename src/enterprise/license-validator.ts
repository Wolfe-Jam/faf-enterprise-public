/**
 * 🔐 FAF Enterprise License Validator
 *
 * Validates enterprise licenses using signed JWT tokens.
 * Supports offline validation (Phase 1) and optional telemetry (Phase 2).
 *
 * License Sources (priority order):
 * 1. faf-enterprise.license file (recommended)
 * 2. FAF_LICENSE_KEY environment variable
 * 3. FAF_LICENSE_FILE path to license file
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

/**
 * License data structure
 */
export interface LicenseData {
  // Core fields
  customer: string;           // Customer name/ID
  email: string;              // Contact email
  tier: 'starter' | 'business' | 'enterprise';
  seats: number;              // Number of seats
  issuedAt: number;           // Unix timestamp
  expiresAt: number;          // Unix timestamp

  // Features (v1.1+)
  features?: {
    monorepo: boolean;        // 33-slot support
    teamFeatures: boolean;    // Team workspace (v1.1)
    sso: boolean;             // SSO/SAML (v1.2)
    prioritySupport: boolean; // Priority support
  };

  // Metadata
  version: string;            // License format version
  licenseId: string;          // Unique license ID
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  reason?: string;
  data?: LicenseData;
}

/**
 * License validator configuration
 */
export interface ValidatorConfig {
  publicKey?: string;         // Public key for signature verification
  telemetry?: boolean;        // Enable telemetry (Phase 2)
  gracePeriod?: number;       // Grace period after expiry (days)
  offlineMode?: boolean;      // Force offline validation
}

/**
 * FAF Enterprise License Validator
 */
export class LicenseValidator {
  private config: ValidatorConfig;
  private cachedLicense?: LicenseData;

  constructor(config: ValidatorConfig = {}) {
    this.config = {
      gracePeriod: 7, // 7-day grace period by default
      telemetry: false, // Disabled by default (Phase 1)
      offlineMode: false,
      ...config
    };
  }

  /**
   * Validate enterprise license
   *
   * Priority:
   * 1. faf-enterprise.license in cwd or parent dirs
   * 2. FAF_LICENSE_KEY env var
   * 3. FAF_LICENSE_FILE env var pointing to file
   */
  async validate(): Promise<ValidationResult> {
    try {
      // Try license file first (recommended)
      const licenseFile = await this.findLicenseFile();
      if (licenseFile) {
        const content = await fs.readFile(licenseFile, 'utf-8');
        return this.validateLicenseString(content.trim());
      }

      // Try environment variable (FAF_LICENSE_KEY)
      if (process.env.FAF_LICENSE_KEY) {
        return this.validateLicenseString(process.env.FAF_LICENSE_KEY);
      }

      // Try custom license file path (FAF_LICENSE_FILE)
      if (process.env.FAF_LICENSE_FILE) {
        const content = await fs.readFile(process.env.FAF_LICENSE_FILE, 'utf-8');
        return this.validateLicenseString(content.trim());
      }

      return {
        valid: false,
        reason: 'No license found. Set FAF_LICENSE_KEY or create faf-enterprise.license file.'
      };

    } catch (error) {
      return {
        valid: false,
        reason: `License validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Find faf-enterprise.license file in cwd or parent directories
   */
  private async findLicenseFile(): Promise<string | null> {
    let currentDir = process.cwd();

    // Check up to 10 parent directories
    for (let i = 0; i < 10; i++) {
      const licensePath = path.join(currentDir, 'faf-enterprise.license');

      try {
        await fs.access(licensePath);
        return licensePath;
      } catch {
        // Not found, try parent
      }

      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) {
        break; // Reached root
      }
      currentDir = parentDir;
    }

    return null;
  }

  /**
   * Validate license string (JWT format) - Public for enterprise activation
   */
  async validateLicenseString(licenseKey: string): Promise<ValidationResult> {
    try {
      // Phase 1: Simple JWT validation (offline)
      // Format: header.payload.signature (base64url encoded)

      const parts = licenseKey.split('.');
      if (parts.length !== 3) {
        return {
          valid: false,
          reason: 'Invalid license format. Expected JWT format (header.payload.signature)'
        };
      }

      const [headerB64, payloadB64, signatureB64] = parts;

      // Decode payload
      const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf-8');
      const data = JSON.parse(payloadJson) as LicenseData;

      // Verify signature (if public key provided)
      if (this.config.publicKey) {
        const verified = this.verifySignature(
          `${headerB64}.${payloadB64}`,
          signatureB64,
          this.config.publicKey
        );

        if (!verified) {
          return {
            valid: false,
            reason: 'Invalid license signature. License may be tampered or corrupted.'
          };
        }
      }

      // Check expiry
      const now = Date.now();
      const expiresAt = data.expiresAt * 1000; // Convert to ms
      const gracePeriodMs = (this.config.gracePeriod || 0) * 24 * 60 * 60 * 1000;

      if (now > expiresAt + gracePeriodMs) {
        const expiredDate = new Date(expiresAt).toISOString().split('T')[0];
        return {
          valid: false,
          reason: `License expired on ${expiredDate}. Contact sales@faf.one to renew.`
        };
      }

      // Check if in grace period
      if (now > expiresAt && now <= expiresAt + gracePeriodMs) {
        const daysLeft = Math.ceil((expiresAt + gracePeriodMs - now) / (24 * 60 * 60 * 1000));
        console.warn(`⚠️  License expired. ${daysLeft} days remaining in grace period.`);
        console.warn(`   Renew now: sales@faf.one`);
      }

      // Cache valid license
      this.cachedLicense = data;

      // Phase 2: Optional telemetry (non-blocking)
      if (this.config.telemetry && !this.config.offlineMode) {
        this.reportUsage(data).catch(() => {
          // Ignore telemetry errors (non-blocking)
        });
      }

      return {
        valid: true,
        data
      };

    } catch (error) {
      return {
        valid: false,
        reason: `License parse error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Verify JWT signature using public key
   */
  private verifySignature(message: string, signatureB64: string, publicKeyPem: string): boolean {
    try {
      const signature = Buffer.from(signatureB64, 'base64url');
      const verifier = crypto.createVerify('RSA-SHA256');
      verifier.update(message);
      return verifier.verify(publicKeyPem, signature);
    } catch {
      return false;
    }
  }

  /**
   * Report usage to telemetry server (Phase 2, non-blocking)
   */
  private async reportUsage(license: LicenseData): Promise<void> {
    // Phase 2: POST to https://telemetry.faf.one/usage
    // Payload: { licenseId, timestamp, version }
    // Non-blocking, ignore errors

    try {
      const response = await fetch('https://telemetry.faf.one/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          licenseId: license.licenseId,
          timestamp: Date.now(),
          version: process.env.npm_package_version || 'unknown'
        }),
        signal: AbortSignal.timeout(2000) // 2s timeout
      });

      if (!response.ok) {
        // Ignore telemetry errors
      }
    } catch {
      // Ignore telemetry errors (offline is fine)
    }
  }

  /**
   * Get cached license data (after successful validation)
   */
  getLicenseData(): LicenseData | undefined {
    return this.cachedLicense;
  }

  /**
   * Check if license has feature enabled
   */
  hasFeature(feature: keyof NonNullable<LicenseData['features']>): boolean {
    if (!this.cachedLicense?.features) {
      // Default features for Phase 1 (before features field added)
      return feature === 'monorepo' || feature === 'prioritySupport';
    }
    return this.cachedLicense.features[feature] ?? false;
  }

  /**
   * Get license tier
   */
  getTier(): string | undefined {
    return this.cachedLicense?.tier;
  }

  /**
   * Get seat count
   */
  getSeats(): number | undefined {
    return this.cachedLicense?.seats;
  }

  /**
   * Get days until expiry
   */
  getDaysUntilExpiry(): number | undefined {
    if (!this.cachedLicense) return undefined;

    const now = Date.now();
    const expiresAt = this.cachedLicense.expiresAt * 1000;
    const daysLeft = Math.ceil((expiresAt - now) / (24 * 60 * 60 * 1000));

    return daysLeft;
  }

  /**
   * Synchronous license validation (for compiler use)
   *
   * Only checks FAF_LICENSE_KEY environment variable for performance.
   * File-based validation requires async I/O.
   *
   * @returns ValidationResult synchronously
   */
  validateSync(): ValidationResult {
    try {
      // Only check environment variable (synchronous)
      if (process.env.FAF_LICENSE_KEY) {
        return this.validateLicenseStringSync(process.env.FAF_LICENSE_KEY);
      }

      return {
        valid: false,
        reason: 'No license found in FAF_LICENSE_KEY environment variable'
      };
    } catch (error) {
      return {
        valid: false,
        reason: `License validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Synchronous license string validation
   */
  private validateLicenseStringSync(licenseKey: string): ValidationResult {
    try {
      const parts = licenseKey.split('.');
      if (parts.length !== 3) {
        return {
          valid: false,
          reason: 'Invalid license format. Expected JWT format (header.payload.signature)'
        };
      }

      const [headerB64, payloadB64, signatureB64] = parts;

      // Decode payload
      const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf-8');
      const data = JSON.parse(payloadJson) as LicenseData;

      // Verify signature (if public key provided)
      if (this.config.publicKey) {
        const verified = this.verifySignature(
          `${headerB64}.${payloadB64}`,
          signatureB64,
          this.config.publicKey
        );

        if (!verified) {
          return {
            valid: false,
            reason: 'Invalid license signature. License may be tampered or corrupted.'
          };
        }
      }

      // Check expiry
      const now = Date.now();
      const expiresAt = data.expiresAt * 1000; // Convert to ms
      const gracePeriodMs = (this.config.gracePeriod || 0) * 24 * 60 * 60 * 1000;

      if (now > expiresAt + gracePeriodMs) {
        const expiredDate = new Date(expiresAt).toISOString().split('T')[0];
        return {
          valid: false,
          reason: `License expired on ${expiredDate}. Contact sales@faf.one to renew.`
        };
      }

      // Cache valid license
      this.cachedLicense = data;

      return {
        valid: true,
        data
      };

    } catch (error) {
      return {
        valid: false,
        reason: `License parse error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

/**
 * Generate a license key (for internal use / license server)
 *
 * This is used by the license generation server, not by customers.
 */
export async function generateLicense(
  data: LicenseData,
  privateKeyPem: string
): Promise<string> {
  // Create JWT header
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };

  const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
  const payloadB64 = Buffer.from(JSON.stringify(data)).toString('base64url');

  // Sign with private key
  const message = `${headerB64}.${payloadB64}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(message);
  const signature = signer.sign(privateKeyPem);
  const signatureB64 = signature.toString('base64url');

  return `${headerB64}.${payloadB64}.${signatureB64}`;
}

/**
 * Example usage:
 *
 * ```typescript
 * // In src/cli.ts or src/compiler/faf-compiler.ts
 *
 * import { LicenseValidator } from './enterprise/license-validator';
 *
 * const validator = new LicenseValidator({
 *   publicKey: process.env.FAF_PUBLIC_KEY, // Embedded in code
 *   telemetry: true,  // Phase 2
 *   gracePeriod: 7    // 7 days
 * });
 *
 * const result = await validator.validate();
 *
 * if (!result.valid) {
 *   console.error('⚠️  Enterprise license invalid:', result.reason);
 *   console.error('   Falling back to Community Edition (21 slots)');
 *   // Continue with 21-slot scoring
 * } else {
 *   console.log('✅ Enterprise Edition activated');
 *   console.log(`   Customer: ${result.data?.customer}`);
 *   console.log(`   Tier: ${result.data?.tier}`);
 *   console.log(`   Seats: ${result.data?.seats}`);
 *   console.log(`   Expires: ${new Date(result.data!.expiresAt * 1000).toLocaleDateString()}`);
 *
 *   // Use 33-slot scoring
 *   if (validator.hasFeature('monorepo')) {
 *     // Enable monorepo features
 *   }
 * }
 * ```
 */
