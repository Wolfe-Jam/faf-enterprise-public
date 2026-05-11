/**
 * FAF v3 — Resolution Engine
 * Walk parent_faf chain, merge with inheritance rules.
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import { parseV3, getParentFafPath } from './parser';
import type { FafV3Document, ContextChunk, MergeRule, ResolutionChain } from './types';

// =============================================================================
// Merge Rules Per Chunk Type
// =============================================================================

const CHUNK_MERGE_RULES: Record<string, MergeRule> = {
  // Context chunks with special rules
  compliance: 'union',
  security: 'strictest',
  ai_policy: 'strictest',
  // Pointer chunk
  docs: 'merge',
  // Default for everything else
  _default: 'override',
};

function getMergeRule(chunkType: string): MergeRule {
  return CHUNK_MERGE_RULES[chunkType] || CHUNK_MERGE_RULES._default;
}

// =============================================================================
// Resolution
// =============================================================================

export async function resolve(fafPath: string): Promise<ResolutionChain> {
  const visited = new Set<string>();
  const chain: string[] = [];

  const resolved = await resolveRecursive(fafPath, visited, chain);

  return { chain, resolved };
}

async function resolveRecursive(
  fafPath: string,
  visited: Set<string>,
  chain: string[]
): Promise<FafV3Document> {
  const absolutePath = path.resolve(fafPath);

  // Circular reference detection
  if (visited.has(absolutePath)) {
    throw new Error(`Circular parent_faf reference detected: ${absolutePath}`);
  }
  visited.add(absolutePath);
  chain.push(absolutePath);

  // Parse this file
  const content = await fs.readFile(absolutePath, 'utf-8');
  const doc = parseV3(content);

  // Check for parent
  const parentFafRel = getParentFafPath(doc);
  if (!parentFafRel) {
    return doc; // Root of chain
  }

  // Resolve parent (recursive)
  const parentPath = path.resolve(path.dirname(absolutePath), parentFafRel);
  const parent = await resolveRecursive(parentPath, visited, chain);

  // Merge: parent (base) + child (overrides)
  return mergeDocuments(parent, doc);
}

// =============================================================================
// Merge Engine
// =============================================================================

export function mergeDocuments(parent: FafV3Document, child: FafV3Document): FafV3Document {
  return {
    version: child.version,
    dna: mergeDna(parent.dna, child.dna),
    context: mergeContextChunks(parent.context, child.context),
    pointers: mergePointers(parent.pointers, child.pointers),
    raw: { ...parent.raw, ...child.raw },
  };
}

// =============================================================================
// DNA Merge (child overrides parent)
// =============================================================================

function mergeDna(
  parent: Record<string, unknown>,
  child: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  // Start with parent
  for (const [key, value] of Object.entries(parent)) {
    result[key] = deepClone(value);
  }

  // Child overrides
  for (const [key, value] of Object.entries(child)) {
    if (value !== undefined && value !== null) {
      if (isPlainObject(result[key]) && isPlainObject(value)) {
        // Deep merge objects (child fields override parent fields)
        result[key] = { ...(result[key] as Record<string, unknown>), ...(value as Record<string, unknown>) };
      } else {
        result[key] = deepClone(value);
      }
    }
  }

  return result;
}

// =============================================================================
// Context Chunk Merge (rule-based)
// =============================================================================

function mergeContextChunks(parent: ContextChunk[], child: ContextChunk[]): ContextChunk[] {
  const result: Map<string, ContextChunk> = new Map();

  // Add parent chunks
  for (const chunk of parent) {
    result.set(chunk.type, { ...chunk, data: deepClone(chunk.data) as Record<string, unknown> });
  }

  // Merge child chunks
  for (const chunk of child) {
    const rule = getMergeRule(chunk.type);
    const existing = result.get(chunk.type);

    if (!existing) {
      result.set(chunk.type, { ...chunk, data: deepClone(chunk.data) as Record<string, unknown> });
      continue;
    }

    switch (rule) {
      case 'union':
        result.set(chunk.type, {
          type: chunk.type,
          data: mergeUnion(existing.data, chunk.data),
        });
        break;

      case 'strictest':
        result.set(chunk.type, {
          type: chunk.type,
          data: mergeStrictest(existing.data, chunk.data),
        });
        break;

      case 'override':
      default:
        result.set(chunk.type, { ...chunk, data: deepClone(chunk.data) as Record<string, unknown> });
        break;
    }
  }

  return Array.from(result.values());
}

// =============================================================================
// Merge Strategies
// =============================================================================

/** UNION: child adds, never removes. Arrays concatenate + deduplicate. */
function mergeUnion(
  parent: Record<string, unknown>,
  child: Record<string, unknown>
): Record<string, unknown> {
  const result = deepClone(parent) as Record<string, unknown>;

  for (const [key, value] of Object.entries(child)) {
    const existing = result[key];

    if (Array.isArray(existing) && Array.isArray(value)) {
      // Union arrays: deduplicate
      result[key] = [...new Set([...existing, ...value])];
    } else if (isPlainObject(existing) && isPlainObject(value)) {
      // Deep merge objects
      result[key] = mergeUnion(existing as Record<string, unknown>, value as Record<string, unknown>);
    } else {
      // Child adds new field (never removes parent fields)
      result[key] = deepClone(value);
    }
  }

  return result;
}

/** STRICTEST WINS: for arrays use intersection, for SLAs use tighter values. */
function mergeStrictest(
  parent: Record<string, unknown>,
  child: Record<string, unknown>
): Record<string, unknown> {
  const result = deepClone(parent) as Record<string, unknown>;

  for (const [key, value] of Object.entries(child)) {
    const existing = result[key];

    if (Array.isArray(existing) && Array.isArray(value)) {
      // Intersection for provider lists
      if (key === 'approved_providers' || key === 'providers') {
        result[key] = existing.filter(item => (value as unknown[]).includes(item));
      } else {
        // For restriction lists, union (more restrictions = stricter)
        result[key] = [...new Set([...existing, ...value])];
      }
    } else if (isPlainObject(existing) && isPlainObject(value)) {
      result[key] = mergeStrictest(existing as Record<string, unknown>, value as Record<string, unknown>);
    } else if (typeof existing === 'string' && typeof value === 'string' && isSlaValue(existing) && isSlaValue(value)) {
      // For SLA-like values, pick the stricter (shorter) one
      result[key] = pickStricter(existing, value);
    } else {
      // Child overrides (child is assumed stricter by definition)
      result[key] = deepClone(value);
    }
  }

  return result;
}

/** Parse SLA time strings like "4 hours", "24 hours", "7 days" → minutes */
function isSlaValue(val: string): boolean {
  return /^\d+\s+(hour|hours|day|days|minute|minutes|min|mins)$/i.test(val);
}

function slaToMinutes(val: string): number {
  const match = val.match(/^(\d+)\s+(hour|hours|day|days|minute|minutes|min|mins)$/i);
  if (!match) return Infinity;
  const num = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  if (unit.startsWith('hour')) return num * 60;
  if (unit.startsWith('day')) return num * 1440;
  return num; // minutes
}

function pickStricter(a: string, b: string): string {
  return slaToMinutes(a) <= slaToMinutes(b) ? a : b;
}

// =============================================================================
// Pointer Merge
// =============================================================================

function mergePointers(
  parent: { docs: Record<string, string> },
  child: { docs: Record<string, string> }
): { docs: Record<string, string> } {
  return {
    docs: { ...parent.docs, ...child.docs },
  };
}

// =============================================================================
// Utilities
// =============================================================================

function isPlainObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

function deepClone<T>(val: T): T {
  if (val === null || val === undefined) return val;
  return JSON.parse(JSON.stringify(val));
}
