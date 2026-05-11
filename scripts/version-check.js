#!/usr/bin/env node
/**
 * 🎯 VERSION SANITY CHECKER
 * Never get surprised by version conflicts again!
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 VERSION CHECK - No more surprises!\n');

// 1. Get local version
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
const localVersion = packageJson.version;

// 2. Get npm registry version
let npmVersion;
try {
  npmVersion = execSync('npm view @faf/enterprise version', { encoding: 'utf8' }).trim();
} catch (e) {
  console.log('⚠️  Package not found on npm (first publish?)');
  npmVersion = '0.0.0';
}

// 3. Get all published versions
let allVersions;
try {
  allVersions = JSON.parse(execSync('npm view @faf/enterprise versions --json', { encoding: 'utf8' }));
} catch (e) {
  allVersions = [];
}

// 4. THE TRUTH
console.log('📊 VERSION REALITY CHECK:');
console.log('─────────────────────────');
console.log(`📁 LOCAL (package.json):  v${localVersion}`);
console.log(`☁️  NPM LATEST:           v${npmVersion}`);
console.log(`📚 LAST 5 PUBLISHED:     ${allVersions.slice(-5).join(', ')}`);
console.log('');

// 5. CONFLICT DETECTION
let hasConflict = false;
if (localVersion === npmVersion) {
  console.log('❌ CONFLICT: Local version matches npm!');
  console.log('   You need to bump version before publishing:');
  console.log('   → npm version patch');
  console.log('');
  hasConflict = true;
} else if (allVersions.includes(localVersion)) {
  console.log('❌ CONFLICT: Version already exists on npm!');
  console.log(`   v${localVersion} was already published`);
  console.log('   → npm version patch');
  console.log('');
  hasConflict = true;
} else {
  console.log('✅ CLEAR: Ready to publish!');
  console.log(`   Will publish as v${localVersion}`);
  console.log('');
}

// 6. SUGGESTED NEXT VERSION
const parts = npmVersion.split('.');
const suggestedPatch = `${parts[0]}.${parts[1]}.${parseInt(parts[2]) + 1}`;
const suggestedMinor = `${parts[0]}.${parseInt(parts[1]) + 1}.0`;
const suggestedMajor = `${parseInt(parts[0]) + 1}.0.0`;

console.log('📈 SUGGESTED VERSIONS:');
console.log(`   Patch:  v${suggestedPatch} (bug fixes)`)
console.log(`   Minor:  v${suggestedMinor} (new features)`);
console.log(`   Major:  v${suggestedMajor} (breaking changes)`);
console.log('');
console.log('💡 Run: npm version patch|minor|major');

// Exit with error if conflict
if (hasConflict) {
  process.exit(1);
}