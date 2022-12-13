import { fileURLToPath } from 'url';
import path from 'upath';
import fs from 'fs-extra';
import fg from 'fast-glob';
import { transform } from 'esbuild';
import colors from 'picocolors';

const root = fileURLToPath(new URL('../', import.meta.url));
const patterns = process.argv.slice(2);

async function prebuild() {
  const files = await fg(patterns, {
    ignore: ['**/*.prebuilt.*'],
    absolute: true,
  });

  await Promise.all(
    files.map(async file => {
      const relPath = path.relative(root, file);
      const ext = path.extname(file);
      const outputPath = path.resolve(
        path.dirname(file),
        `${path.basename(file, ext)}.prebuilt${ext}`
      );
      const content = await fs.readFile(file, 'utf-8');

      let { code } = await transform(content, { loader: 'ts', minify: true });

      code = `/**
 * This file is prebuilt from ./${path.basename(file)}
 * Do not edit this directly, but instead edit that file and rerun the prebuild
 * to generate this file.
 */
/* eslint-disable */

export default ${JSON.stringify(code.trim())};
`;

      await fs.outputFile(outputPath, code, 'utf-8');

      console.log(`${colors.gray('Prebuilt:')} ${colors.cyan(relPath)}`);
    })
  );
}

function escapeTemplateLiterals(str: string) {
  return str.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

prebuild();
