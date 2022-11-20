/**
 * This adds component source path to JSX tags.
 *
 * == JSX Literals ==
 * import Comp from '../comp';
 * <Comp __island="load" />
 *
 * becomes:
 * import Comp from '../comp';
 * <Comp __island="load" __islandComponent="default__ISLAND__../comp__ISLAND__/User/import.ts" />
 *
 *
 * == JSX Literals ==
 * import { A as Comp } from '../comp';
 * <Comp __island="load" />
 *
 * becomes:
 * import { A as Comp } from '../comp';
 * <Comp __island="load" __islandComponent="A__ISLAND__../comp__ISLAND__/User/import.ts" />
 *
 *
 * == JSX Literals ==
 * import { * as A } from '../comp';
 * <A.Comp __island="load" />
 *
 * becomes:
 * import { * as A } from '../comp';
 * <A.Comp __island="load" __islandComponent="Comp__ISLAND__../comp__ISLAND__/User/import.ts" />
 */
import { type PluginObj, types as t } from '@babel/core';
import { normalizePath } from 'vite';
import { ISLAND_SPLITTER } from '../constants.js';

function getTagName(node: t.JSXOpeningElement) {
  return jsxElementNameToString(node.name);
}

function jsxElementNameToString(
  node: t.JSXOpeningElement['name']
): string | undefined {
  if (t.isJSXMemberExpression(node)) {
    return `${jsxElementNameToString(node.object)}.${node.property.name}`;
  }
  if (t.isJSXIdentifier(node) || t.isIdentifier(node)) {
    return node.name;
  }
  // Not support namespace tag
  return undefined;
}

function isComponent(tagName: string) {
  return (
    (tagName[0] && tagName[0].toLowerCase() !== tagName[0]) ||
    tagName.includes('.') ||
    /[^a-zA-Z]/.test(tagName[0])
  );
}

export function babelJsxIsland(): PluginObj {
  return {
    name: 'jsx-island',
    visitor: {
      JSXAttribute(path, state) {
        if (path.node.name.name !== '__island') {
          return;
        }

        const jsxOpeningElement = path.findParent(p =>
          t.isJSXOpeningElement(p.node)
        )?.node as t.JSXOpeningElement | undefined;

        if (!jsxOpeningElement) {
          return;
        }

        const tagName = getTagName(jsxOpeningElement);

        if (!tagName || !isComponent(tagName)) {
          return;
        }

        const [importLocal, ...localMembers] = tagName.split('.');
        const binding = path.scope.getBinding(importLocal);

        if (!binding || !t.isImportDeclaration(binding.path.parent)) {
          return;
        }

        const source = binding.path.parent.source.value;

        const spec = binding.path.node as
          | t.ImportDefaultSpecifier
          | t.ImportNamespaceSpecifier
          | t.ImportSpecifier;

        // import Comp from './Comp'
        // <Comp />
        // -> default
        // -------------------------
        // import * as Comp from './Comp'
        // <Comp.C.D />
        // -> C.D
        // -------------------------
        // import { Comp } from './Comp'
        // <Comp.C.D />
        // -> Comp.C.D
        let imported: string;

        if (t.isImportDefaultSpecifier(spec)) {
          imported = 'default';
        } else if (t.isImportNamespaceSpecifier(spec)) {
          imported = localMembers.join('.');
        } else {
          imported = [
            t.isIdentifier(spec.imported)
              ? spec.imported.name
              : spec.imported.value,
            ...localMembers,
          ].join('.');
        }

        jsxOpeningElement.attributes.push(
          // __islandComponent="Comp__ISLAND__./Comp__ISLAND__/User/xxx/project/src"
          t.jsxAttribute(
            t.jsxIdentifier('__islandComponent'),
            t.stringLiteral(
              `${imported}${ISLAND_SPLITTER}${source}${ISLAND_SPLITTER}${normalizePath(
                state.filename || ''
              )}`
            )
          )
        );
      },
    },
  };
}
