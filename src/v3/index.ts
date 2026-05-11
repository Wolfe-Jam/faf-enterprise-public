/**
 * FAF v3 — Enterprise Edition
 * IFF Container Format: DNA (scored) + Context (unlimited) + Pointers (references)
 */

// Types
export type {
  FafV3Document,
  FafVersion,
  DnaChunk,
  ContextChunk,
  PointerChunk,
  ManifestData,
  ManifestType,
  ManifestValidation,
  GitContext,
  GitProvider,
  MergeRule,
  ResolutionChain,
  AgentDefinition,
  AgentsChunk,
} from './types';

// Parser
export {
  parseV3,
  separateChunks,
  detectVersion,
  getContextChunk,
  getContextTypes,
  hasContextChunk,
  getParentFafPath,
} from './parser';

// Chunk Registry
export {
  DNA_KEYS,
  POINTER_KEY,
  KNOWN_CHUNK_TYPES,
  classifyKey,
  isKnownChunkType,
} from './chunk-registry';

// Compatibility
export {
  parseAnyVersion,
  isLegacyDocument,
  hasV3Features,
} from './compat';

// Manifest
export {
  detectManifest,
  detectAllManifests,
  validateManifestAgainstDna,
} from './manifest';

// Git
export {
  detectGitContext,
  detectProvider,
  extractRepoPath,
  isGitRepo,
  validateGitContext,
} from './git';

// Context Injector
export {
  injectContextChunks,
} from './context-injector';
export type {
  InjectOptions,
  InjectionResult,
} from './context-injector';

// Resolver
export {
  resolve,
  mergeDocuments,
} from './resolver';
