/**
 * FAF v3 — Enterprise Edition Type Definitions
 * IFF Container Format: DNA (scored) + Context (unlimited) + Pointers (references)
 */

// =============================================================================
// Core Document
// =============================================================================

export type FafVersion = '1.0' | '2.0' | '3.0';

export interface FafV3Document {
  /** Detected format version */
  version: FafVersion;
  /** Scored DNA chunk — the slot system */
  dna: DnaChunk;
  /** Unscored context chunks — unlimited structured definitions */
  context: ContextChunk[];
  /** Pointer chunk — references to companion docs */
  pointers: PointerChunk;
  /** Original parsed YAML (preserve all keys for round-trip) */
  raw: Record<string, unknown>;
}

// =============================================================================
// DNA Chunk (Scored)
// =============================================================================

export interface DnaChunk {
  project?: {
    name?: string;
    description?: string;
    goal?: string;
    main_language?: string;
    version?: string;
    type?: string;
    [key: string]: unknown;
  };
  stack?: {
    // --- Base 21: Frontend Stack (4) ---
    framework?: string;
    css?: string;
    ui_library?: string;
    state?: string;
    // --- Base 21: Backend Stack (5) ---
    backend?: string;
    api?: string;
    runtime?: string;
    db?: string;
    connection?: string;
    // --- Base 21: Universal Stack (3) ---
    hosting?: string;
    build?: string;
    cicd?: string;
    // --- Enterprise 12: Infra (5) ---
    monorepo_tool?: string;
    pkg_manager?: string;
    workspaces?: string[];
    // (packages_count + build_orchestrator on monorepo object)
    // --- Enterprise 12: App (4) ---
    admin?: string;
    cache?: string;
    search?: string;
    storage?: string;
    // --- Pass-through ---
    message_queue?: string;
    monitoring?: string;
    [key: string]: unknown;
  };
  enterprise?: {
    owner?: string;
    division?: string;
    parent_faf?: string;
    classification?: string;
    [key: string]: unknown;
  };
  goals?: string[];
  rules?: string[];
  key_files?: Array<{ path: string; purpose: string } | string>;
  human_context?: {
    who?: string;
    what?: string;
    why?: string;
    where?: string;
    when?: string;
    how?: string;
    [key: string]: unknown;
  };
  monorepo?: {
    packages_count?: number;
    build_orchestrator?: string;
    versioning?: string;
    shared_configs?: string[];
    remote_cache?: string;
    [key: string]: unknown;
  };
  /** Pass-through for any other DNA-level keys */
  [key: string]: unknown;
}

// =============================================================================
// Context Chunks (Unscored)
// =============================================================================

export interface ContextChunk {
  /** Chunk type identifier (e.g., 'architecture', 'compliance', 'security') */
  type: string;
  /** Structured YAML content */
  data: Record<string, unknown>;
}

// =============================================================================
// Pointer Chunk
// =============================================================================

export interface PointerChunk {
  /** Map of doc name → relative file path */
  docs: Record<string, string>;
}

// =============================================================================
// Manifest Integration
// =============================================================================

export type ManifestType = 'package.json' | 'Cargo.toml' | 'pyproject.toml' | 'go.mod';

export interface ManifestData {
  type: ManifestType;
  path: string;
  name?: string;
  version?: string;
  description?: string;
  license?: string;
  language: string;
  repository?: string;
}

export interface ManifestValidation {
  field: string;
  manifest_value: string;
  faf_value: string;
  match: boolean;
}

// =============================================================================
// Git Integration
// =============================================================================

export type GitProvider = 'github' | 'gitlab' | 'bitbucket' | 'azure' | 'gitea' | 'unknown';

export interface GitContext {
  provider: GitProvider;
  repo: string;
  default_branch: string;
  remote_url: string;
  version_strategy: 'tag' | 'manifest' | 'manual';
  current_version?: string;
  current_branch?: string;
  is_clean?: boolean;
}

// =============================================================================
// Resolution
// =============================================================================

export type MergeRule = 'override' | 'union' | 'strictest' | 'intersect' | 'merge';

export interface ResolutionChain {
  /** Ordered list of .faf paths from root to leaf */
  chain: string[];
  /** The fully resolved document */
  resolved: FafV3Document;
}

// =============================================================================
// Agents Layer
// =============================================================================

export interface AgentDefinition {
  name: string;
  role: string;
  /** Which context chunk types this agent reads */
  reads: string[];
  /** Which context chunk types this agent can write */
  writes: string[];
  /** Preferred model (e.g., 'claude-opus', 'gemini-pro', 'grok', 'internal') */
  model?: string;
  /** AI provider that runs this agent */
  provider?: AgentProvider;
  /** MCP tools or capabilities this agent can use */
  tools?: string[];
  /** Path to the agent's instruction file (.md) */
  instructions?: string;
  /** Events that activate this agent */
  triggers?: string[];
  /** Agent names this agent can delegate work to */
  handoff_to?: string[];
}

export type AgentProvider = 'anthropic' | 'google' | 'openai' | 'xai' | 'cursor' | 'internal' | string;

export type OrchestrationPattern = 'conductor' | 'swarm' | 'chain' | 'parallel';

export interface AgentsOrchestration {
  pattern: OrchestrationPattern;
  /** Which agent starts the flow */
  entry_point?: string;
  /** Agents the conductor/entry_point can invoke */
  delegates?: string[];
  /** Routing description — how agents are selected */
  routing?: string;
}

export type GenerationTargetType = 'agents.md' | 'claude.md' | 'cursorrules' | 'gemini.md' | 'grok.md' | 'json';

export interface GenerationTarget {
  type: GenerationTargetType;
  /** Output path (optional — defaults to convention) */
  path?: string;
}

export interface AgentsChunk {
  definitions: AgentDefinition[];
  orchestration?: AgentsOrchestration;
  /** Platform-specific files to generate from this chunk */
  generation_targets?: GenerationTarget[];
}
