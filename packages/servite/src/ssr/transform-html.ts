import { Transform } from 'stream';
import { HelmetProvider } from 'react-helmet-async';
import { H3Event } from 'vinxi/http';
import { getManifest } from 'vinxi/manifest';
import { HtmlTagWithoutInjectTo, RouterName } from '../types/index.js';
import { groupHtmlTags, InjectedTags, serializeTags } from './html-tags.js';

export type HelmetContext = NonNullable<
  React.ComponentProps<typeof HelmetProvider>['context']
>;

export interface TransformHtmlParams {
  event: H3Event;
  helmetContext: HelmetContext;
}

type TransformHtmlState = 'start' | 'processing' | 'end';

interface DoTransformHtmlParams extends TransformHtmlParams {
  state: TransformHtmlState;
  /**
   * middleware injected tags.
   */
  injectedTags: InjectedTags;
}

async function doTransformHtml(
  html: string,
  { event, helmetContext, state, injectedTags }: DoTransformHtmlParams,
) {
  if (state === 'start') {
    const clientManifest = getManifest(RouterName.Client);
    // client build assets
    const assets = (await clientManifest.inputs[
      clientManifest.handler
    ].assets()) as any as HtmlTagWithoutInjectTo[];

    // helmet tags
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

    const headTags = [title, priority, meta, link, style, script]
      .map(x => x?.toString())
      .filter(Boolean)
      .join('\n    ');

    html = `\
<!DOCTYPE html>
<html ${htmlAttrs}>
  <head>
    ${serializeTags(injectedTags.headPrependTags, '    ')}
    <meta charSet="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${headTags}
    ${serializeTags(assets, '    ')}
    ${serializeTags(injectedTags.headTags, '    ')}
  </head>
  <body ${bodyAttrs}>
    <noscript>We're sorry but this app doesn't work properly without JavaScript enabled. Please enable it to continue.</noscript>
    ${serializeTags(injectedTags.bodyPrependTags, '    ')}
    <div id="root">${html}`;

    // bootstrapModule is `async`, but react-refresh script is `type="module"` which is `defer`,
    // so we hack it to make it `normal`.
    if (
      import.meta.env.DEV &&
      html.includes('window.__vite_plugin_react_preamble_installed__ = true')
    ) {
      html = html
        .replace(
          '</head>',
          str =>
            `  <script>window.__vite_plugin_react_preamble_installed__ = true</script>\n  ${str}`,
        )
        .replace(
          'window.__vite_plugin_react_preamble_installed__ = true',
          str => {
            return `${str}
;window.__vite_plugin_react_preamble_installed_resolve__?.(true)`;
          },
        );
    }
  }

  if (state === 'end') {
    html = `</div>
${serializeTags(injectedTags.bodyTags, '    ')}
  </body>
</html>`;
  }

  // User middlewares added html transformers.
  if (event.context._htmlTransformers?.length) {
    for (const transformer of event.context._htmlTransformers) {
      html = await transformer(html);
    }
  }

  return html;
}

const textDecoder = new TextDecoder();

export function transformHtmlForReadableStream(params: TransformHtmlParams) {
  const textEncoder = new TextEncoder();
  const injectedTags = groupHtmlTags(params.event.context._htmlInjectedTags);
  let state: TransformHtmlState = 'start';

  return new TransformStream({
    async transform(chunk, controller) {
      chunk = textEncoder.encode(
        await doTransformHtml(textDecoder.decode(chunk), {
          ...params,
          state,
          injectedTags,
        }),
      );
      state = 'processing';
      controller.enqueue(chunk);
    },
    async flush(controller) {
      state = 'end';
      controller.enqueue(
        textEncoder.encode(
          await doTransformHtml('', { ...params, state, injectedTags }),
        ),
      );
    },
  });
}

export function transformHtmlForPipeableStream(params: TransformHtmlParams) {
  const injectedTags = groupHtmlTags(params.event.context._htmlInjectedTags);
  let state: TransformHtmlState = 'start';

  return new Transform({
    async transform(chunk, _encoding, callback) {
      chunk = Buffer.from(
        await doTransformHtml(chunk.toString('utf-8'), {
          ...params,
          state,
          injectedTags,
        }),
        'utf-8',
      );
      state = 'processing';
      this.push(chunk);
      callback();
    },
    async flush(callback) {
      state = 'end';
      this.push(
        Buffer.from(
          await doTransformHtml('', { ...params, state, injectedTags }),
          'utf-8',
        ),
      );
      callback();
    },
  });
}
