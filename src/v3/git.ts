/**
 * FAF v3 — Git Integration
 * Provider-agnostic git context detection.
 * Auto-detects from .git/config, validates against known providers.
 */

import { execSync } from 'child_process';
import type { GitContext, GitProvider } from './types';

// =============================================================================
// Provider Detection Patterns
// =============================================================================

const PROVIDER_PATTERNS: Array<{ pattern: RegExp; provider: GitProvider }> = [
  { pattern: /github\.com/i, provider: 'github' },
  { pattern: /gitlab\.com/i, provider: 'gitlab' },
  { pattern: /gitlab\.[a-z]+\./i, provider: 'gitlab' },  // Self-hosted GitLab
  { pattern: /bitbucket\.org/i, provider: 'bitbucket' },
  { pattern: /dev\.azure\.com/i, provider: 'azure' },
  { pattern: /visualstudio\.com/i, provider: 'azure' },
  { pattern: /gitea\./i, provider: 'gitea' },
];

// =============================================================================
// Core Detection
// =============================================================================

export function detectGitContext(projectDir: string): GitContext | null {
  if (!isGitRepo(projectDir)) return null;

  const remoteUrl = getRemoteUrl(projectDir);
  if (!remoteUrl) return null;

  const provider = detectProvider(remoteUrl);
  const repo = extractRepoPath(remoteUrl, provider);
  const defaultBranch = getDefaultBranch(projectDir);
  const currentBranch = getCurrentBranch(projectDir);
  const isClean = getIsClean(projectDir);

  return {
    provider,
    repo,
    default_branch: defaultBranch,
    remote_url: remoteUrl,
    version_strategy: detectVersionStrategy(projectDir),
    current_branch: currentBranch,
    is_clean: isClean,
  };
}

// =============================================================================
// Provider Detection
// =============================================================================

export function detectProvider(remoteUrl: string): GitProvider {
  for (const { pattern, provider } of PROVIDER_PATTERNS) {
    if (pattern.test(remoteUrl)) return provider;
  }
  return 'unknown';
}

export function extractRepoPath(remoteUrl: string, provider: GitProvider): string {
  // SSH format: git@github.com:owner/repo.git
  const sshMatch = remoteUrl.match(/:([^/]+\/[^/]+?)(?:\.git)?$/);
  if (sshMatch) return sshMatch[1];

  // HTTPS format: https://github.com/owner/repo.git
  let urlPath: string;
  try {
    const url = new URL(remoteUrl);
    urlPath = url.pathname;
  } catch {
    // Not a valid URL, try regex
    const httpsMatch = remoteUrl.match(/(?:https?:\/\/[^/]+)\/(.+?)(?:\.git)?$/);
    if (httpsMatch) return httpsMatch[1];
    return remoteUrl;
  }

  // Azure DevOps: /org/project/_git/repo
  if (provider === 'azure') {
    const azureMatch = urlPath.match(/\/([^/]+)\/([^/]+)\/_git\/([^/]+)/);
    if (azureMatch) return `${azureMatch[1]}/${azureMatch[2]}/${azureMatch[3]}`;
  }

  // Standard: /owner/repo.git
  return urlPath.replace(/^\//, '').replace(/\.git$/, '');
}

// =============================================================================
// Git Commands (shell-safe, provider-agnostic)
// =============================================================================

function execGit(cmd: string, cwd: string): string | null {
  try {
    return execSync(`git ${cmd}`, { cwd, stdio: 'pipe', encoding: 'utf-8' }).trim();
  } catch {
    return null;
  }
}

export function isGitRepo(dir: string): boolean {
  return execGit('rev-parse --is-inside-work-tree', dir) === 'true';
}

function getRemoteUrl(dir: string): string | null {
  return execGit('remote get-url origin', dir);
}

function getDefaultBranch(dir: string): string {
  // Try symbolic ref first
  const ref = execGit('symbolic-ref refs/remotes/origin/HEAD', dir);
  if (ref) return ref.replace('refs/remotes/origin/', '');

  // Fallback: check for common defaults
  const branches = execGit('branch -r', dir);
  if (branches?.includes('origin/main')) return 'main';
  if (branches?.includes('origin/master')) return 'master';
  return 'main'; // Modern default
}

function getCurrentBranch(dir: string): string | undefined {
  return execGit('branch --show-current', dir) || undefined;
}

function getIsClean(dir: string): boolean | undefined {
  const status = execGit('status --porcelain', dir);
  if (status === null) return undefined;
  return status === '';
}

function detectVersionStrategy(dir: string): 'tag' | 'manifest' | 'manual' {
  // Check if there are version tags
  const tags = execGit('tag -l "v*"', dir);
  if (tags && tags.split('\n').filter(t => t.trim()).length > 0) return 'tag';

  // Check for package manifest
  const ls = execGit('ls-files package.json Cargo.toml pyproject.toml go.mod', dir);
  if (ls && ls.trim().length > 0) return 'manifest';

  return 'manual';
}

// =============================================================================
// Validation
// =============================================================================

export interface GitValidation {
  has_remote: boolean;
  provider_known: boolean;
  provider: GitProvider;
  has_tags: boolean;
  is_clean: boolean | undefined;
}

export function validateGitContext(ctx: GitContext): GitValidation {
  return {
    has_remote: !!ctx.remote_url,
    provider_known: ctx.provider !== 'unknown',
    provider: ctx.provider,
    has_tags: ctx.version_strategy === 'tag',
    is_clean: ctx.is_clean,
  };
}
