import { HtmlTag, HtmlTagWithoutInjectTo } from '../types/index.js';

const selfCloseTags = new Set(['link', 'meta', 'base']);

export interface InjectedTags {
  headTags?: HtmlTag[];
  headPrependTags?: HtmlTag[];
  bodyTags?: HtmlTag[];
  bodyPrependTags?: HtmlTag[];
}

export function groupHtmlTags(tags: HtmlTag[] = []): InjectedTags {
  let headTags: HtmlTag[] | undefined;
  let headPrependTags: HtmlTag[] | undefined;
  let bodyTags: HtmlTag[] | undefined;
  let bodyPrependTags: HtmlTag[] | undefined;

  for (const tag of tags) {
    switch (tag.injectTo) {
      case 'head':
        (headTags ??= []).push(tag);
        break;
      case 'head-prepend':
        (headPrependTags ??= []).push(tag);
        break;
      case 'body':
        (bodyTags ??= []).push(tag);
        break;
      default:
        (bodyPrependTags ??= []).push(tag);
        break;
    }
  }

  return {
    headTags,
    headPrependTags,
    bodyTags,
    bodyPrependTags,
  };
}

export function serializeTags(
  tags?: HtmlTagWithoutInjectTo[] | string,
  indent = '',
): string {
  if (typeof tags === 'string') {
    return tags;
  } else if (tags?.length) {
    return tags.map(tag => serializeTag(tag)).join(`\n${indent}`);
  }
  return '';
}

function serializeTag({
  tag,
  attrs,
  children,
}: HtmlTagWithoutInjectTo): string {
  if (selfCloseTags.has(tag)) {
    return `<${tag}${serializeAttrs(attrs)}>`;
  }
  return `<${tag}${serializeAttrs(attrs)}>${serializeTags(children)}</${tag}>`;
}

function serializeAttrs(attrs?: Record<string, any>): string {
  let res = '';

  if (attrs) {
    for (const key in attrs) {
      if (typeof attrs[key] === 'boolean') {
        res += attrs[key] ? ` ${key.toLowerCase()}` : ``;
      } else {
        res += ` ${key.toLowerCase()}=${JSON.stringify(attrs[key])}`;
      }
    }
  }
  return res;
}
