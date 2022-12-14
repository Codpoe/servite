/* eslint-disable no-console */
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import minimist from 'minimist';
import { execaCommand } from 'execa';

const argv = minimist<{ ts?: boolean }>(process.argv.slice(2), {
  string: ['_'],
});

const cwd = process.cwd();

const serviteVersion = '^0.1.1';

const viteConfigContent = `import { defineConfig } from 'vite';
import { servite } from 'servite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [servite()],
});
`;

const demoPageContent = `export default function Page() {
  return (
    <div>Hello World</div>
  );
}
`;

async function init() {
  const [, pkgManager = 'npm', version = ''] =
    process.env.npm_config_user_agent?.match(/^(.*?)\/(\S*)/) || [];

  const isNpm7Plus = pkgManager === 'npm' && Number(version.split('.')[0]) >= 7;
  const template = argv.ts ? 'react-ts' : 'react';

  let successStr = '';

  await new Promise<void>((resolve, reject) => {
    const child = execaCommand(
      `${pkgManager} create vite ${
        isNpm7Plus ? '--' : ''
      } --template ${template} ${argv._.join(' ')}`,
      {
        stdin: 'inherit',
      }
    );

    child.stdout
      ?.on('data', chunk => {
        const str: string = chunk.toString();

        if (str.includes('Done') || successStr) {
          successStr += str;
        } else {
          process.stdout.write(chunk);
        }
      })
      .on('end', () => {
        resolve();
      })
      .on('error', err => {
        reject(err);
      });
  });

  if (!successStr) {
    return;
  }

  const [, relativePath] = successStr.match(/ cd\s+(.*?)(?:(\s|$))/) || [];
  const root = relativePath ? path.resolve(cwd, relativePath) : cwd;
  const src = path.resolve(root, 'src');

  // 1. Modify package.json
  // =====================================
  const pkgPath = path.resolve(root, 'package.json');
  const pkgJson = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));

  // Remove dev deps: @vitejs/plugin-react
  delete pkgJson.devDependencies['@vitejs/plugin-react'];
  // Add deps: servite
  pkgJson.dependencies.servite = serviteVersion;
  // Modify scripts.build
  pkgJson.scripts.build = 'tsc && servite build';

  await fs.writeFile(pkgPath, JSON.stringify(pkgJson, null, 2));

  // 2. Modify vite.config
  // =====================================
  const viteConfigPath = path.resolve(
    root,
    `vite.config.${argv.ts ? 'ts' : 'js'}`
  );
  await fs.writeFile(viteConfigPath, viteConfigContent, 'utf-8');

  // 3. Remove index.html
  // =====================================
  await fs.rm(path.resolve(root, 'index.html'));

  // 4. Clean src
  // =====================================
  await Promise.all(
    (
      await fs.readdir(src)
    ).map(async file => {
      // Keep some files as needed
      if (file === 'vite-env.d.ts') {
        return;
      }
      await fs.rm(path.resolve(src, file), { recursive: true });
    })
  );

  // 5. Modify vite-env.d.ts
  // =====================================
  const viteEnvDtsPath = path.resolve(src, 'vite-env.d.ts');

  if (existsSync(viteEnvDtsPath)) {
    await fs.appendFile(
      viteEnvDtsPath,
      '/// <reference types="servite/global" />\n',
      'utf-8'
    );
  }

  // 6. Add demo page
  // =====================================
  const pagesPath = path.resolve(src, 'pages');
  await fs.mkdir(pagesPath);
  await fs.writeFile(
    path.resolve(pagesPath, `index.${argv.ts ? 'tsx' : 'jsx'}`),
    demoPageContent,
    'utf-8'
  );

  console.log(successStr);
}

init().catch(err => {
  console.error(err);
  process.exit(1);
});
