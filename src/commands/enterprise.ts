/**
 * 🏢 FAF Enterprise Edition - License Management
 *
 * Commands:
 * - faf enterprise activate <key>  - Activate enterprise license
 * - faf enterprise status          - Check license status
 * - faf enterprise info            - Show license information
 */

import { chalk } from '../fix-once/colors';
import { LicenseValidator } from '../enterprise/license-validator';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Show enterprise status
 */
export async function enterpriseStatusCommand(): Promise<void> {
  console.log(chalk.cyan('\n🏢 FAF Enterprise Edition - License Status\n'));

  const validator = new LicenseValidator();
  const result = await validator.validate();

  if (!result.valid) {
    console.log(chalk.red('❌ No valid license found\n'));
    console.log(chalk.yellow('Reasons:'));
    console.log(chalk.dim(`   ${result.reason}\n`));
    console.log(chalk.cyan('How to activate:'));
    console.log(chalk.dim('   1. faf enterprise activate <license-key>'));
    console.log(chalk.dim('   2. Set FAF_LICENSE_KEY environment variable'));
    console.log(chalk.dim('   3. Create faf-enterprise.license file\n'));
    console.log(chalk.dim('Get a license: https://faf.one/enterprise\n'));
    return;
  }

  // Valid license - show details
  const { data } = result;
  console.log(chalk.green('✅ Enterprise Edition Activated\n'));
  console.log(chalk.white('License Details:'));
  console.log(chalk.dim(`   Customer:  ${data!.customer}`));
  console.log(chalk.dim(`   Email:     ${data!.email}`));
  console.log(chalk.dim(`   Tier:      ${data!.tier}`));
  console.log(chalk.dim(`   Seats:     ${data!.seats}`));

  const expiresDate = new Date(data!.expiresAt * 1000);
  const daysLeft = validator.getDaysUntilExpiry();
  console.log(chalk.dim(`   Expires:   ${expiresDate.toLocaleDateString()} (${daysLeft} days)`));

  // Show features
  if (data!.features) {
    console.log(chalk.white('\nFeatures:'));
    console.log(chalk.dim(`   Monorepo Support:    ${data!.features.monorepo ? '✅' : '❌'}`));
    console.log(chalk.dim(`   Team Features:       ${data!.features.teamFeatures ? '✅' : '❌'}`));
    console.log(chalk.dim(`   SSO/SAML:            ${data!.features.sso ? '✅' : '❌'}`));
    console.log(chalk.dim(`   Priority Support:    ${data!.features.prioritySupport ? '✅' : '❌'}`));
  }

  // Warning if expiring soon
  if (daysLeft !== undefined && daysLeft < 30) {
    console.log(chalk.yellow(`\n⚠️  License expires in ${daysLeft} days`));
    console.log(chalk.dim('   Renew now: sales@faf.one\n'));
  } else {
    console.log('');
  }
}

/**
 * Activate enterprise license with key
 */
export async function enterpriseActivateCommand(licenseKey: string): Promise<void> {
  console.log(chalk.cyan('\n🏢 Activating FAF Enterprise Edition...\n'));

  if (!licenseKey || licenseKey.trim() === '') {
    console.log(chalk.red('❌ License key required\n'));
    console.log(chalk.yellow('Usage:'));
    console.log(chalk.dim('   faf enterprise activate <license-key>\n'));
    console.log(chalk.dim('Get a license: https://faf.one/enterprise\n'));
    return;
  }

  // Validate the license key first
  const validator = new LicenseValidator();
  const result = await validator.validateLicenseString(licenseKey.trim());

  if (!result.valid) {
    console.log(chalk.red('❌ Invalid license key\n'));
    console.log(chalk.yellow('Reason:'));
    console.log(chalk.dim(`   ${result.reason}\n`));
    console.log(chalk.dim('Contact sales@faf.one if you believe this is an error\n'));
    return;
  }

  // License is valid - save to file
  try {
    const licensePath = path.join(process.cwd(), 'faf-enterprise.license');
    await fs.writeFile(licensePath, licenseKey.trim(), 'utf-8');

    console.log(chalk.green('✅ License activated successfully!\n'));
    console.log(chalk.white('License Details:'));
    console.log(chalk.dim(`   Customer:  ${result.data!.customer}`));
    console.log(chalk.dim(`   Tier:      ${result.data!.tier}`));
    console.log(chalk.dim(`   Seats:     ${result.data!.seats}`));

    const expiresDate = new Date(result.data!.expiresAt * 1000);
    console.log(chalk.dim(`   Expires:   ${expiresDate.toLocaleDateString()}\n`));

    console.log(chalk.cyan('License saved to: ') + chalk.dim(licensePath));
    console.log(chalk.dim('Keep this file in your project root\n'));

    console.log(chalk.green('🎉 You now have access to:'));
    console.log(chalk.dim('   • 33-slot monorepo scoring (21 base + 12 monorepo)'));
    console.log(chalk.dim('   • Team collaboration features'));
    console.log(chalk.dim('   • Priority support'));
    console.log(chalk.dim('   • Advanced workspace analysis\n'));

    console.log(chalk.cyan('Next steps:'));
    console.log(chalk.dim('   faf score           # Test 33-slot scoring'));
    console.log(chalk.dim('   faf init            # Initialize .faf with monorepo support'));
    console.log(chalk.dim('   faf enterprise info # View full license details\n'));

  } catch (error) {
    console.log(chalk.red('❌ Failed to save license file\n'));
    console.log(chalk.yellow('Error:'));
    console.log(chalk.dim(`   ${error instanceof Error ? error.message : 'Unknown error'}\n`));
    console.log(chalk.cyan('Alternative activation:'));
    console.log(chalk.dim('   Set environment variable: FAF_LICENSE_KEY=<your-key>\n'));
  }
}

/**
 * Show detailed license information
 */
export async function enterpriseInfoCommand(): Promise<void> {
  console.log(chalk.cyan('\n🏢 FAF Enterprise Edition - Detailed Information\n'));

  const validator = new LicenseValidator();
  const result = await validator.validate();

  if (!result.valid) {
    console.log(chalk.red('❌ No valid license found\n'));
    console.log(chalk.yellow('Activate enterprise:'));
    console.log(chalk.dim('   faf enterprise activate <license-key>\n'));
    console.log(chalk.dim('Get a license: https://faf.one/enterprise\n'));
    return;
  }

  const { data } = result;

  console.log(chalk.white('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.green('✅ FAF Enterprise Edition - ACTIVE'));
  console.log(chalk.white('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  console.log(chalk.cyan('Customer Information:'));
  console.log(chalk.dim(`   Name:       ${data!.customer}`));
  console.log(chalk.dim(`   Email:      ${data!.email}`));
  console.log(chalk.dim(`   License ID: ${data!.licenseId}\n`));

  console.log(chalk.cyan('Subscription:'));
  console.log(chalk.dim(`   Tier:       ${data!.tier.toUpperCase()}`));
  console.log(chalk.dim(`   Seats:      ${data!.seats}`));

  const issuedDate = new Date(data!.issuedAt * 1000);
  const expiresDate = new Date(data!.expiresAt * 1000);
  const daysLeft = validator.getDaysUntilExpiry();

  console.log(chalk.dim(`   Issued:     ${issuedDate.toLocaleDateString()}`));
  console.log(chalk.dim(`   Expires:    ${expiresDate.toLocaleDateString()} (${daysLeft} days remaining)\n`));

  console.log(chalk.cyan('Features Enabled:'));
  if (data!.features) {
    console.log(chalk.dim(`   ${data!.features.monorepo ? '✅' : '❌'} Monorepo Support (33 slots)`));
    console.log(chalk.dim(`   ${data!.features.teamFeatures ? '✅' : '❌'} Team Collaboration`));
    console.log(chalk.dim(`   ${data!.features.sso ? '✅' : '❌'} SSO/SAML Integration`));
    console.log(chalk.dim(`   ${data!.features.prioritySupport ? '✅' : '❌'} Priority Support\n`));
  } else {
    // Default features for older licenses (v1.0)
    console.log(chalk.dim(`   ✅ Monorepo Support (33 slots)`));
    console.log(chalk.dim(`   ✅ Priority Support\n`));
  }

  console.log(chalk.cyan('Support:'));
  console.log(chalk.dim('   Email:      enterprise@faf.one'));
  console.log(chalk.dim('   Sales:      sales@faf.one'));
  console.log(chalk.dim('   Docs:       https://faf.one/enterprise/docs\n'));

  console.log(chalk.white('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  // Warning if expiring soon
  if (daysLeft !== undefined && daysLeft < 30) {
    console.log(chalk.yellow(`⚠️  Your license expires in ${daysLeft} days`));
    console.log(chalk.dim('   Contact sales@faf.one to renew\n'));
  }
}

/**
 * Main enterprise command router
 */
export async function enterpriseCommand(subcommand?: string, options?: any): Promise<void> {
  // If no subcommand, show status
  if (!subcommand) {
    await enterpriseStatusCommand();
    return;
  }

  switch (subcommand.toLowerCase()) {
    case 'status':
      await enterpriseStatusCommand();
      break;

    case 'activate':
      if (!options || !options.key) {
        console.log(chalk.red('\n❌ License key required\n'));
        console.log(chalk.yellow('Usage:'));
        console.log(chalk.dim('   faf enterprise activate <license-key>\n'));
        return;
      }
      await enterpriseActivateCommand(options.key);
      break;

    case 'info':
      await enterpriseInfoCommand();
      break;

    default:
      console.log(chalk.red(`\n❌ Unknown subcommand: ${subcommand}\n`));
      console.log(chalk.yellow('Available commands:'));
      console.log(chalk.dim('   faf enterprise status          # Check license status'));
      console.log(chalk.dim('   faf enterprise activate <key>  # Activate license'));
      console.log(chalk.dim('   faf enterprise info            # Detailed information\n'));
  }
}
