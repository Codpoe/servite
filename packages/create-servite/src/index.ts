/* eslint-disable no-console */
import path from 'node:path';
import fs from 'node:fs';
import minimist from 'minimist';
import { execaCommand } from 'execa';
import prompts, { Answers } from 'prompts';
import colors from 'picocolors';

const argv = minimist<{ ts?: boolean }>(process.argv.slice(2), {
  string: ['_'],
});

const cwd = process.cwd();

const defaultTargetDir = 'servite-app';
const serviteVersion = '^2.0.0';
const vinxiVersion = '^0.4.3';

const viteConfigContent = `\
import { defineConfig } from 'servite/config';

// https://servite.vercel.app/zh/guide/config
export default defineConfig({});
`;

const demoPageContent = `export default function Page() {
  return (
    <div>Hello World</div>
  );
}
`;

function formatTargetDir(dir?: string) {
  return dir?.trim().replace(/\/+$/, '');
}

function isEmpty(path: string) {
  const files = fs.readdirSync(path);
  return files.length === 0 || (files.length === 1 && files[0] === '.git');
}

function emptyDir(dir: string, ignore?: string[]) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const file of fs.readdirSync(dir)) {
    if (ignore?.includes(file)) {
      continue;
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
  }
}

async function init() {
  let targetDir = formatTargetDir(argv._[0]) || '';
  let answers: Answers<'appName' | 'overwrite'>;

  try {
    answers = await prompts([
      {
        type: targetDir ? null : 'text',
        name: 'appName',
        message: 'App name:',
        initial: defaultTargetDir,
        onState: state =>
          (targetDir = formatTargetDir(state.value) || defaultTargetDir),
      },
      {
        type: () =>
          !fs.existsSync(targetDir!) || isEmpty(targetDir!) ? null : 'select',
        name: 'overwrite',
        message: () =>
          (targetDir === '.'
            ? 'Current directory'
            : `Target directory "${targetDir}"`) +
          ` is not empty. Please choose how to proceed:`,
        initial: 0,
        choices: [
          {
            title: 'Remove existing files and continue',
            value: 'yes',
          },
          {
            title: 'Cancel operation',
            value: 'no',
          },
          {
            title: 'Ignore files and continue',
            value: 'ignore',
          },
        ],
      },
      {
        type: (_, { overwrite }: { overwrite?: string }) => {
          if (overwrite === 'no') {
            throw new Error(colors.red('✖') + ' Operation cancelled');
          }
          return null;
        },
        name: 'overwriteChecker',
      },
    ]);
  } catch (cancelled) {
    console.log(cancelled);
    return;
  }

  const root = path.join(cwd, targetDir);

  if (answers.overwrite === 'yes') {
    emptyDir(root, ['.git']);
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }

  const appName = path.basename(targetDir === '.' ? cwd : targetDir);
  const [, pkgManager = 'npm', version = ''] =
    process.env.npm_config_user_agent?.match(/^(.*?)\/(\S*)/) || [];
  const isNpm7Plus =
    pkgManager === 'npm' && (!version || Number(version.split('.')[0]) >= 7);

  const result = execaCommand(
    `${pkgManager} create vite@latest ${appName} ${isNpm7Plus ? '--' : ''} --template react-ts ${answers.overwrite ? `--overwrite ${answers.overwrite}` : ''}`,
    {
      stdout: 'pipe',
    },
  );

  const successLines: string[] = [];

  for await (const line of result) {
    if (line.startsWith('Done') || successLines.length) {
      successLines.push(line);
    } else {
      console.log(line);
    }
  }

  if (!successLines.length) {
    throw new Error('Failed to create servite app');
  }

  const src = path.resolve(root, 'src');

  // 1. Modify package.json
  // =====================================
  const pkgPath = path.resolve(root, 'package.json');
  const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

  // Remove dev deps: @vitejs/plugin-react
  delete pkgJson.devDependencies['@vitejs/plugin-react'];
  // Add deps: servite
  pkgJson.dependencies.servite = serviteVersion;
  pkgJson.dependencies.vinxi = vinxiVersion;
  // Modify scripts
  pkgJson.scripts.dev = 'vinxi dev';
  pkgJson.scripts.build = 'tsc -b && vinxi build';
  pkgJson.scripts.preview = 'node .output/server/index.mjs';

  fs.writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2));

  // 2. Modify vite.config
  // =====================================
  const viteConfigPath = path.resolve(root, `vite.config.ts`);
  fs.writeFileSync(viteConfigPath, viteConfigContent, 'utf-8');

  // 3. Remove index.html
  // =====================================
  fs.rmSync(path.resolve(root, 'index.html'));

  // 4. Clean src
  // =====================================
  emptyDir(src, ['vite-env.d.ts']);

  // 5. Modify vite-env.d.ts
  // =====================================
  const viteEnvDtsPath = path.resolve(src, 'vite-env.d.ts');

  if (fs.existsSync(viteEnvDtsPath)) {
    fs.appendFileSync(
      viteEnvDtsPath,
      '/// <reference types="servite/env" />\n',
      'utf-8',
    );
  }

  // 6. Add demo page
  // =====================================
  const pagesPath = path.resolve(src, 'pages');
  fs.mkdirSync(pagesPath);
  fs.writeFileSync(
    path.resolve(pagesPath, 'page.tsx'),
    demoPageContent,
    'utf-8',
  );

  console.log(successLines.join('\n'));
}

init().catch(err => {
  console.error(err);
  process.exit(1);
});
