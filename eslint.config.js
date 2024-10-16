import { codpoeConfig } from '@codpoe/eslint-config';

export default [
  {
    ignores: ['packages/servite/src/libs'],
  },
  ...codpoeConfig({ globals: ['node', 'browser'] }),
];
