/**
 * FAF v3 — Manifest Integration
 * Auto-detect and validate package manifests against .faf DNA.
 * Supports: package.json, Cargo.toml, pyproject.toml, go.mod
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import type { ManifestData, ManifestType, ManifestValidation } from './types';

// =============================================================================
// Detection (priority order)
// =============================================================================

const MANIFEST_PRIORITY: ManifestType[] = [
  'Cargo.toml',
  'pyproject.toml',
  'go.mod',
  'package.json',
];

export async function detectManifest(projectDir: string): Promise<ManifestData | null> {
  for (const manifest of MANIFEST_PRIORITY) {
    const fullPath = path.join(projectDir, manifest);
    try {
      await fs.access(fullPath);
      const content = await fs.readFile(fullPath, 'utf-8');
      return parseManifest(manifest, fullPath, content);
    } catch {
      // Not found, try next
    }
  }
  return null;
}

export async function detectAllManifests(projectDir: string): Promise<ManifestData[]> {
  const results: ManifestData[] = [];
  for (const manifest of MANIFEST_PRIORITY) {
    const fullPath = path.join(projectDir, manifest);
    try {
      await fs.access(fullPath);
      const content = await fs.readFile(fullPath, 'utf-8');
      const data = parseManifest(manifest, fullPath, content);
      if (data) results.push(data);
    } catch {
      // Not found
    }
  }
  return results;
}

// =============================================================================
// Parsing
// =============================================================================

function parseManifest(type: ManifestType, filePath: string, content: string): ManifestData | null {
  switch (type) {
    case 'package.json': return parsePackageJson(filePath, content);
    case 'Cargo.toml': return parseCargoToml(filePath, content);
    case 'pyproject.toml': return parsePyprojectToml(filePath, content);
    case 'go.mod': return parseGoMod(filePath, content);
    default: return null;
  }
}

function parsePackageJson(filePath: string, content: string): ManifestData | null {
  try {
    const pkg = JSON.parse(content);
    return {
      type: 'package.json',
      path: filePath,
      name: pkg.name,
      version: pkg.version,
      description: pkg.description,
      license: pkg.license,
      language: detectJsLanguage(pkg),
      repository: extractRepoUrl(pkg.repository),
    };
  } catch {
    return null;
  }
}

function detectJsLanguage(pkg: Record<string, unknown>): string {
  const deps = { ...pkg.dependencies as Record<string, unknown>, ...pkg.devDependencies as Record<string, unknown> };
  if (deps['typescript'] || deps['ts-node'] || deps['ts-jest']) return 'TypeScript';
  return 'JavaScript';
}

function extractRepoUrl(repo: unknown): string | undefined {
  if (!repo) return undefined;
  if (typeof repo === 'string') return repo;
  if (typeof repo === 'object' && repo !== null && 'url' in repo) {
    return String((repo as Record<string, unknown>).url);
  }
  return undefined;
}

function parseCargoToml(filePath: string, content: string): ManifestData | null {
  // Simple TOML parsing for [package] section — no external dependency
  const name = extractTomlValue(content, 'package', 'name');
  const version = extractTomlValue(content, 'package', 'version');
  const description = extractTomlValue(content, 'package', 'description');
  const license = extractTomlValue(content, 'package', 'license');
  const repository = extractTomlValue(content, 'package', 'repository');

  return {
    type: 'Cargo.toml',
    path: filePath,
    name: name || undefined,
    version: version || undefined,
    description: description || undefined,
    license: license || undefined,
    language: 'Rust',
    repository: repository || undefined,
  };
}

function parsePyprojectToml(filePath: string, content: string): ManifestData | null {
  const name = extractTomlValue(content, 'project', 'name');
  const version = extractTomlValue(content, 'project', 'version');
  const description = extractTomlValue(content, 'project', 'description');

  // License can be table or string
  let license = extractTomlValue(content, 'project', 'license');
  if (!license) {
    // Try license.text pattern
    const licenseTextMatch = content.match(/license\s*=\s*\{[^}]*text\s*=\s*"([^"]+)"/);
    if (licenseTextMatch) license = licenseTextMatch[1];
  }

  return {
    type: 'pyproject.toml',
    path: filePath,
    name: name || undefined,
    version: version || undefined,
    description: description || undefined,
    license: license || undefined,
    language: 'Python',
  };
}

function parseGoMod(filePath: string, content: string): ManifestData | null {
  const moduleMatch = content.match(/^module\s+(.+)$/m);
  const goVersionMatch = content.match(/^go\s+(.+)$/m);

  return {
    type: 'go.mod',
    path: filePath,
    name: moduleMatch ? moduleMatch[1].trim() : undefined,
    version: goVersionMatch ? goVersionMatch[1].trim() : undefined,
    language: 'Go',
  };
}

// =============================================================================
// TOML Extraction (minimal, no dependency)
// =============================================================================

function extractTomlValue(content: string, section: string, key: string): string | null {
  // Find [section] header
  const sectionRegex = new RegExp(`^\\[${section}\\]`, 'm');
  const sectionMatch = sectionRegex.exec(content);
  if (!sectionMatch) return null;

  // Find key = "value" after the section header, before next section
  const afterSection = content.slice(sectionMatch.index + sectionMatch[0].length);
  const nextSection = afterSection.search(/^\[/m);
  const sectionContent = nextSection >= 0 ? afterSection.slice(0, nextSection) : afterSection;

  const keyRegex = new RegExp(`^${key}\\s*=\\s*"([^"]*)"`, 'm');
  const match = keyRegex.exec(sectionContent);
  return match ? match[1] : null;
}

// =============================================================================
// Validation Against .faf
// =============================================================================

export function validateManifestAgainstDna(
  manifest: ManifestData,
  dna: Record<string, unknown>
): ManifestValidation[] {
  const results: ManifestValidation[] = [];
  const project = dna.project as Record<string, unknown> | undefined;

  if (manifest.name && project?.name) {
    results.push({
      field: 'name',
      manifest_value: manifest.name,
      faf_value: String(project.name),
      match: manifest.name === String(project.name),
    });
  }

  if (manifest.version && project?.version) {
    results.push({
      field: 'version',
      manifest_value: manifest.version,
      faf_value: String(project.version),
      match: manifest.version === String(project.version),
    });
  }

  if (manifest.description && project?.goal) {
    results.push({
      field: 'description/goal',
      manifest_value: manifest.description,
      faf_value: String(project.goal),
      match: manifest.description === String(project.goal),
    });
  }

  if (manifest.language && project?.main_language) {
    results.push({
      field: 'language',
      manifest_value: manifest.language,
      faf_value: String(project.main_language),
      match: manifest.language.toLowerCase() === String(project.main_language).toLowerCase(),
    });
  }

  return results;
}
