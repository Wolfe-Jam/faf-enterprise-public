/**
 * FAF v3 — Backward Compatibility
 * Every v1/v2 .faf is a valid v3 .faf — just with no context chunks.
 */

import { parseV3 } from './parser';
import type { FafV3Document } from './types';

/**
 * Parse any version .faf into a FafV3Document.
 * v1/v2 files produce DNA-only documents (zero context chunks).
 * v3 files produce full documents with context chunks.
 *
 * Downstream code NEVER checks version — it always gets FafV3Document.
 */
export function parseAnyVersion(yamlContent: string): FafV3Document {
  return parseV3(yamlContent);
}

/**
 * Check if a document was originally a v1/v2 file (no context chunks).
 */
export function isLegacyDocument(doc: FafV3Document): boolean {
  return doc.version !== '3.0';
}

/**
 * Check if a document has any v3 features (context chunks or pointers).
 */
export function hasV3Features(doc: FafV3Document): boolean {
  return doc.context.length > 0 || Object.keys(doc.pointers.docs).length > 0;
}
