// @ts-ignore
import { jsx as _jsx, jsxs as _jsxs, Fragment } from 'react/jsx-runtime';
import { hackJsx } from './hack-jsx.js';

export const { jsx, jsxs, islands } = hackJsx({
  jsx: _jsx,
  jsxs: _jsxs,
});
export { Fragment };
