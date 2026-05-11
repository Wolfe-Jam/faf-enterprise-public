/**
 * FAF v3 — Chunk Registry
 * Separates DNA keys (scored) from context chunk types (unscored).
 * Open-ended: unknown keys default to context chunks.
 */

// =============================================================================
// DNA Keys — These are SCORED by the Mk4 engine
// =============================================================================

export const DNA_KEYS = new Set([
  // Version marker
  'faf',
  // Core identity
  'project',
  'stack',
  'enterprise',
  'goals',
  'rules',
  'key_files',
  // Human context
  'human_context',
  // Monorepo
  'monorepo',
  // Preferences & state
  'preferences',
  'state',
  // Scoring metadata
  'scores',
  'tags',
  'faf_dna',
  'ai_instructions',
  'ai_scoring_details',
  // Legacy / compat keys
  'instant_context',
  'context_quality',
  'claude_code',
  'gemini',
  'faf_version',
  'generated',
  'ai_score',
  'ai_confidence',
  'ai_value',
  'ai_tldr',
  'grok_approved',
  'metadata',
  'priority_files',
]);

// =============================================================================
// Pointer Key — References to companion documents
// =============================================================================

export const POINTER_KEY = 'docs';

// =============================================================================
// Known Context Chunk Types (tools understand these)
// =============================================================================

export const KNOWN_CHUNK_TYPES = new Set([
  'architecture',
  'compliance',
  'security',
  'skills',
  'api_contract',
  'api_standards',
  'team',
  'runbook',
  'dependencies',
  'data_classification',
  'ai_policy',
  'sla',
  'testing',
  'git',
  'manifest',
  'interop',
  'agents',
]);

// =============================================================================
// Classification
// =============================================================================

export type ChunkClassification = 'dna' | 'context' | 'pointer';

/**
 * Classify a top-level YAML key.
 * DNA keys are scored. 'docs' is the pointer chunk. Everything else is context.
 */
export function classifyKey(key: string): ChunkClassification {
  if (DNA_KEYS.has(key)) return 'dna';
  if (key === POINTER_KEY) return 'pointer';
  return 'context';
}

/**
 * Check if a chunk type is well-known (tools can interpret it).
 * Unknown types are still valid — just preserved as opaque data.
 */
export function isKnownChunkType(type: string): boolean {
  return KNOWN_CHUNK_TYPES.has(type);
}
