/**
 * FAF v3 — Context Injector
 * Enriches parsed .faf YAML with git and manifest context chunks.
 * Pure function: detection engines in, enriched data out.
 */

import { detectGitContext } from './git';
import { detectManifest } from './manifest';
import type { GitContext, ManifestData } from './types';

export interface InjectOptions {
  skipGit?: boolean;
  skipManifest?: boolean;
}

export interface InjectionResult {
  data: Record<string, unknown>;
  gitContext: GitContext | null;
  manifestData: ManifestData | null;
}

/**
 * Inject git and manifest context chunks into parsed .faf data.
 *
 * Rules:
 * - Git chunk: provider, repo, default_branch, remote_url, version_strategy (no ephemeral state)
 * - Manifest chunk: type, name, version, license, language (no absolute path)
 * - DNA back-fill: manifest → project.name/version/main_language (only if missing)
 * - v3 promotion: sets faf: "3.0", removes faf_version
 * - Idempotent: calling twice produces same output
 * - Null-safe: missing git/manifest = no chunk, no crash
 */
export async function injectContextChunks(
  fafData: Record<string, unknown>,
  projectDir: string,
  options?: InjectOptions
): Promise<InjectionResult> {
  const data = { ...fafData };
  let gitContext: GitContext | null = null;
  let manifestData: ManifestData | null = null;

  // --- Git Context ---
  if (!options?.skipGit) {
    try {
      gitContext = detectGitContext(projectDir);
    } catch {
      // Non-git directory — no crash
    }
  }

  if (gitContext) {
    // DNA fields only (no ephemeral: current_branch, is_clean)
    data.git = {
      provider: gitContext.provider,
      repo: gitContext.repo,
      default_branch: gitContext.default_branch,
      remote_url: gitContext.remote_url,
      version_strategy: gitContext.version_strategy,
    };
  }

  // --- Manifest Context ---
  if (!options?.skipManifest) {
    try {
      manifestData = await detectManifest(projectDir);
    } catch {
      // No manifest — no crash
    }
  }

  if (manifestData) {
    // Portable fields only (no absolute path)
    data.manifest = {
      type: manifestData.type,
      name: manifestData.name,
      version: manifestData.version,
      license: manifestData.license,
      language: manifestData.language,
    };
  }

  // --- DNA Back-fill (only if missing, never override) ---
  if (manifestData) {
    const project = (data.project as Record<string, unknown>) || {};
    let projectChanged = false;

    if (!project.name && manifestData.name) {
      project.name = manifestData.name;
      projectChanged = true;
    }
    if (!project.version && manifestData.version) {
      project.version = manifestData.version;
      projectChanged = true;
    }
    if (!project.main_language && manifestData.language) {
      project.main_language = manifestData.language;
      projectChanged = true;
    }

    if (projectChanged || !data.project) {
      data.project = { ...(data.project as Record<string, unknown> || {}), ...project };
    }
  }

  // --- v3 Promotion ---
  data.faf = '3.0';
  delete data.faf_version;

  return { data, gitContext, manifestData };
}
