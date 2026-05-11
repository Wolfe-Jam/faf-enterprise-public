/**
 * FAF v3 — Parser
 * Separates raw YAML into DNA (scored), Context (unscored), and Pointer chunks.
 */

import { parse as parseYAML } from 'yaml';
import type {
  FafV3Document,
  FafVersion,
  DnaChunk,
  ContextChunk,
  PointerChunk,
} from './types';
import { classifyKey, POINTER_KEY } from './chunk-registry';

// =============================================================================
// Version Detection
// =============================================================================

export function detectVersion(raw: Record<string, unknown>): FafVersion {
  const fafValue = raw['faf'];
  if (fafValue === '3.0' || fafValue === 3.0) return '3.0';
  if (fafValue === '2.0' || fafValue === 2.0) return '2.0';

  // Legacy: faf_version field or no version marker
  const legacyVersion = raw['faf_version'];
  if (typeof legacyVersion === 'string' && legacyVersion.startsWith('2')) return '2.0';

  return '1.0';
}

// =============================================================================
// Core Parser
// =============================================================================

export function parseV3(yamlContent: string): FafV3Document {
  const raw = parseYAML(yamlContent) as Record<string, unknown>;
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid .faf: YAML must parse to an object');
  }

  return separateChunks(raw);
}

export function separateChunks(raw: Record<string, unknown>): FafV3Document {
  const version = detectVersion(raw);
  const dna: DnaChunk = {};
  const context: ContextChunk[] = [];
  const pointers: PointerChunk = { docs: {} };

  for (const [key, value] of Object.entries(raw)) {
    const classification = classifyKey(key);

    switch (classification) {
      case 'dna':
        // Assign to DNA chunk (scored)
        (dna as Record<string, unknown>)[key] = value;
        break;

      case 'pointer':
        // Assign to pointer chunk
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          pointers.docs = value as Record<string, string>;
        }
        break;

      case 'context':
        // Create a context chunk
        context.push({
          type: key,
          data: (value && typeof value === 'object')
            ? value as Record<string, unknown>
            : { value },
        });
        break;
    }
  }

  return { version, dna, context, pointers, raw };
}

// =============================================================================
// Convenience Accessors
// =============================================================================

/** Get a context chunk by type */
export function getContextChunk(doc: FafV3Document, type: string): ContextChunk | undefined {
  return doc.context.find(c => c.type === type);
}

/** Get all context chunk types present in the document */
export function getContextTypes(doc: FafV3Document): string[] {
  return doc.context.map(c => c.type);
}

/** Check if document has a specific context chunk */
export function hasContextChunk(doc: FafV3Document, type: string): boolean {
  return doc.context.some(c => c.type === type);
}

/** Get the parent_faf path if it exists */
export function getParentFafPath(doc: FafV3Document): string | undefined {
  return doc.dna.enterprise?.parent_faf;
}
