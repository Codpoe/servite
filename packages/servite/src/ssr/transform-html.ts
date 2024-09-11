import { Transform } from 'stream';
import { HelmetProvider } from 'react-helmet-async';

export type HelmetContext = NonNullable<
  React.ComponentProps<typeof HelmetProvider>['context']
>;

export interface TransformHtmlParams {
  helmetContext: HelmetContext;
}

function doTransformHtml(html: string, { helmetContext }: TransformHtmlParams) {
  const {
    htmlAttributes,
    bodyAttributes,
    title,
    priority,
    meta,
    link,
    style,
    script,
  } = helmetContext.helmet || {};
  const htmlAttrs = htmlAttributes?.toString() || '';
  const bodyAttrs = bodyAttributes?.toString();

  if (htmlAttrs) {
    html = html.replace('<html>', `<html ${htmlAttrs}>`);
  }

  if (bodyAttrs) {
    html = html.replace('<body>', `<body ${bodyAttrs}>`);
  }

  const headTags = [title, priority, meta, link, style, script]
    .map(x => x?.toString())
    .filter(Boolean)
    .join('\n  ');

  if (headTags) {
    html = html.replace('<template id="__HEAD_TAGS__"></template>', headTags);
  }

  // bootstrapModule is `async`, but react-refresh script is `type="module"` which is `defer`,
  // bootstrapModule need to wait for react-refresh script to be loaded.
  if (import.meta.env.DEV) {
    html = html.replace(
      'window.__vite_plugin_react_preamble_installed__ = true',
      str => {
        return `${str}
;window.__vite_plugin_react_preamble_installed_resolve__?.(true)`;
      },
    );
  }

  return html;
}

const textDecoder = new TextDecoder();

export function transformHtmlForReadableStream(params: TransformHtmlParams) {
  const textEncoder = new TextEncoder();
  let isFirstChunk = true;

  return new TransformStream({
    transform(chunk, controller) {
      if (isFirstChunk) {
        isFirstChunk = false;
        chunk = textEncoder.encode(
          doTransformHtml(textDecoder.decode(chunk), params),
        );
      }
      controller.enqueue(chunk);
    },
  });
}

export function transformHtmlForPipeableStream(params: TransformHtmlParams) {
  let isFirstChunk = true;

  return new Transform({
    transform(chunk, _encoding, callback) {
      if (isFirstChunk) {
        isFirstChunk = false;
        chunk = Buffer.from(
          doTransformHtml(chunk.toString('utf-8'), params),
          'utf-8',
        );
      }
      this.push(chunk);
      callback();
    },
  });
}
