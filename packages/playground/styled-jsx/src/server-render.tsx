import { ReactElement } from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { createStyleRegistry, StyleRegistry } from 'styled-jsx';

const registry = createStyleRegistry();

export default function render(element: ReactElement) {
  registry.flush();

  const appHtml = renderToString(
    <StyleRegistry registry={registry}>{element}</StyleRegistry>
  );

  const headTags = renderToStaticMarkup(<>{registry.styles()}</>);

  return {
    appHtml,
    headTags,
  };
}
