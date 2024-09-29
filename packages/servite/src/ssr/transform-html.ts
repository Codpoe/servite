import { Transform } from 'stream';
import { HelmetProvider } from 'react-helmet-async';
import { H3Event } from 'vinxi/http';
import { groupHtmlTags, serializeTags } from './html-tags.js';

export type HelmetContext = NonNullable<
  React.ComponentProps<typeof HelmetProvider>['context']
>;

export interface TransformHtmlParams {
  event: H3Event;
  helmetContext: HelmetContext;
}

const headInjectRE = /\n[ \t]*<\/head>/;
const headPrependInjectRE = /<head[^>]*>\n/;
const bodyInjectRE = /\n[ \t]*<\/body>/;
const bodyPrependInjectRE = /<body[^>]*>\n/i;

async function doTransformHtml(
  html: string,
  { event, helmetContext }: TransformHtmlParams,
) {
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

  // User middlewares injected tags.
  if (event.context.html?._injectTags?.length) {
    const { headTags, headPrependTags, bodyTags, bodyPrependTags } =
      groupHtmlTags(event.context.html._injectTags);

    if (headTags) {
      html = html.replace(
        headInjectRE,
        str => `${serializeTags(headTags)}${str}`,
      );
    }

    if (headPrependTags) {
      html = html.replace(
        headPrependInjectRE,
        str => `${str}${serializeTags(headPrependTags)}`,
      );
    }

    if (bodyTags) {
      html = html.replace(
        bodyInjectRE,
        str => `${serializeTags(bodyTags)}${str}`,
      );
    }

    if (bodyPrependTags) {
      html = html.replace(
        bodyPrependInjectRE,
        str => `${str}${serializeTags(bodyPrependTags)}`,
      );
    }
  }

  // User middlewares added html transformers.
  if (event.context.html?._transformers?.length) {
    for (const transformer of event.context.html._transformers) {
      html = await transformer(html);
    }
  }

  return html;
}

const textDecoder = new TextDecoder();

export function transformHtmlForReadableStream(params: TransformHtmlParams) {
  const textEncoder = new TextEncoder();
  let isFirstChunk = true;

  return new TransformStream({
    async transform(chunk, controller) {
      if (isFirstChunk) {
        isFirstChunk = false;
        chunk = textEncoder.encode(
          await doTransformHtml(textDecoder.decode(chunk), params),
        );
      }
      controller.enqueue(chunk);
    },
  });
}

export function transformHtmlForPipeableStream(params: TransformHtmlParams) {
  let isFirstChunk = true;

  return new Transform({
    async transform(chunk, _encoding, callback) {
      if (isFirstChunk) {
        isFirstChunk = false;
        chunk = Buffer.from(
          await doTransformHtml(chunk.toString('utf-8'), params),
          'utf-8',
        );
      }
      this.push(chunk);
      callback();
    },
  });
}
