/**
 * 🔗 faf resolve - Walk parent_faf chain, merge with inheritance rules
 *
 * Resolves a .faf file by walking its parent_faf chain and applying
 * merge rules: DNA override, compliance UNION, security STRICTEST,
 * ai_policy STRICTEST (providers INTERSECT), docs MERGE.
 */

import { chalk } from '../fix-once/colors';
import { resolve as resolveChain } from '../v3/resolver';
import { getContextTypes, getContextChunk, getParentFafPath } from '../v3/parser';
import { findFafFile } from '../utils/file-utils';
import { stringify as stringifyYAML } from '../fix-once/yaml';
import * as path from 'path';

interface ResolveOptions {
  json?: boolean;
  yaml?: boolean;
  chain?: boolean;
  quiet?: boolean;
  output?: string;
}

export async function resolveCommand(
  file?: string,
  options: ResolveOptions = {}
) {
  try {
    // Find .faf file
    let fafPath: string | null;
    if (file) {
      fafPath = file.endsWith('.faf') ? file : await findFafFile(file);
    } else {
      fafPath = await findFafFile();
    }

    if (!fafPath) {
      console.error(chalk.red('❌ No .faf file found'));
      console.log(chalk.yellow('💡 Run "faf init" to create one, or pass a path: faf resolve ./project.faf'));
      process.exit(1);
    }

    // Resolve the chain
    const { chain, resolved } = await resolveChain(fafPath);

    // Chain-only mode: just show the chain (display root→leaf for humans)
    if (options.chain) {
      const displayChain = [...chain].reverse(); // root first
      if (!options.quiet) {
        console.log(chalk.cyan('🔗 Resolution Chain:'));
        console.log();
      }
      displayChain.forEach((p, i) => {
        const name = path.basename(p);
        const indent = '  '.repeat(i);
        const arrow = i === 0 ? '📄' : '↳ ';
        console.log(`${indent}${arrow} ${name}`);
      });
      if (!options.quiet) {
        console.log();
        console.log(chalk.gray(`${chain.length} files in chain`));
      }
      return;
    }

    // Output format
    if (options.json) {
      // JSON output
      const output = JSON.stringify({
        version: resolved.version,
        chain: chain.map(p => path.basename(p)),
        dna: resolved.dna,
        context: resolved.context.map(c => ({ [c.type]: c.data })),
        pointers: resolved.pointers,
      }, null, 2);

      if (options.output) {
        const fs = await import('fs');
        fs.writeFileSync(options.output, output, 'utf-8');
        console.log(chalk.green(`✅ Resolved JSON written to ${options.output}`));
      } else {
        console.log(output);
      }
      return;
    }

    // Default: YAML output (reconstructed .faf)
    const yamlObj: Record<string, unknown> = {
      faf: resolved.version,
    };

    // DNA sections
    for (const [key, value] of Object.entries(resolved.dna)) {
      if (key === 'faf') continue; // skip version marker
      yamlObj[key] = value;
    }

    // Context chunks
    for (const chunk of resolved.context) {
      yamlObj[chunk.type] = chunk.data;
    }

    // Pointers
    if (Object.keys(resolved.pointers.docs).length > 0) {
      yamlObj['docs'] = resolved.pointers.docs;
    }

    const yamlOutput = stringifyYAML(yamlObj);

    if (options.output) {
      const fs = await import('fs');
      fs.writeFileSync(options.output, yamlOutput, 'utf-8');
      console.log(chalk.green(`✅ Resolved .faf written to ${options.output}`));
    } else {
      if (!options.quiet) {
        console.log(chalk.cyan(`🔗 Resolved: ${path.basename(fafPath)}`));
        console.log(chalk.gray(`   Chain: ${[...chain].reverse().map(p => path.basename(p)).join(' → ')}`));
        console.log(chalk.gray(`   DNA sections: ${Object.keys(resolved.dna).filter(k => k !== 'faf').length}`));
        console.log(chalk.gray(`   Context chunks: ${resolved.context.length}`));
        console.log(chalk.gray(`   Pointer docs: ${Object.keys(resolved.pointers.docs).length}`));
        console.log();
      }
      console.log(yamlOutput);
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('Circular parent_faf')) {
      console.error(chalk.red(`❌ ${message}`));
      console.log(chalk.yellow('💡 Check your parent_faf paths for circular references'));
    } else if (message.includes('ENOENT')) {
      console.error(chalk.red(`❌ Parent .faf file not found: ${message}`));
      console.log(chalk.yellow('💡 Ensure parent_faf paths are correct relative paths'));
    } else {
      console.error(chalk.red(`❌ Resolution failed: ${message}`));
    }
    process.exit(1);
  }
}
