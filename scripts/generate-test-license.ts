/**
 * Generate a test license for development/testing
 *
 * Usage: npx ts-node scripts/generate-test-license.ts
 */

import * as crypto from 'crypto';
import { generateLicense, type LicenseData } from '../src/enterprise/license-validator';

async function main() {
  console.log('\n🔑 Generating Test Enterprise License...\n');

  // Generate RSA key pair (for testing only - in production, keep private key secure!)
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });

  console.log('✅ Generated RSA key pair\n');

  // Create test license data
  const licenseData: LicenseData = {
    customer: 'Test Company',
    email: 'test@example.com',
    tier: 'enterprise',
    seats: 10,
    issuedAt: Math.floor(Date.now() / 1000),
    expiresAt: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60), // 1 year from now
    features: {
      monorepo: true,
      teamFeatures: true,
      sso: false,
      prioritySupport: true
    },
    version: '1.0.0',
    licenseId: 'TEST-' + crypto.randomBytes(8).toString('hex').toUpperCase()
  };

  // Generate license key
  const licenseKey = await generateLicense(licenseData, privateKey);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Test License Generated');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('License Details:');
  console.log(`  Customer:  ${licenseData.customer}`);
  console.log(`  Email:     ${licenseData.email}`);
  console.log(`  Tier:      ${licenseData.tier}`);
  console.log(`  Seats:     ${licenseData.seats}`);
  console.log(`  Issued:    ${new Date(licenseData.issuedAt * 1000).toLocaleDateString()}`);
  console.log(`  Expires:   ${new Date(licenseData.expiresAt * 1000).toLocaleDateString()}`);
  console.log(`  License ID: ${licenseData.licenseId}\n`);

  console.log('License Key:');
  console.log(`  ${licenseKey}\n`);

  console.log('Public Key (for validation):');
  console.log(publicKey);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('How to use:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('1. Activate with CLI:');
  console.log(`   faf enterprise activate ${licenseKey}\n`);

  console.log('2. Or set environment variable:');
  console.log(`   export FAF_LICENSE_KEY="${licenseKey}"\n`);

  console.log('3. Or create file:');
  console.log(`   echo "${licenseKey}" > faf-enterprise.license\n`);

  console.log('Note: This is a TEST license. In production, keep the private key secure!');
  console.log('      The public key should be embedded in the compiler for signature verification.\n');
}

main().catch(console.error);
