import React from 'react';
import { HtmlTag } from '../types/index.js';

const selfCloseTags = new Set(['link', 'meta', 'base']);

export function groupHtmlTags(tags: HtmlTag[] = []) {
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

export function serializeTags(tags?: HtmlTag[] | string): string {
  if (typeof tags === 'string') {
    return tags;
  } else if (tags?.length) {
    return tags.map(tag => serializeTag(tag)).join('\n');
  }
  return '';
}

function serializeTag({ tag, attrs, children }: HtmlTag): string {
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
        res += attrs[key] ? ` ${key}` : ``;
      } else {
        res += ` ${key}=${JSON.stringify(attrs[key])}`;
      }
    }
  }
  return res;
}

export function renderTags(tags?: HtmlTag[] | string): React.ReactNode {
  if (typeof tags === 'string') {
    return tags;
  } else if (tags?.length) {
    return tags.map(tag => renderTag(tag));
  }
  return null;
}

function renderTag({ tag, attrs, children }: HtmlTag): React.ReactNode {
  const Tag: any = tag;
  return <Tag {...attrs}>{renderTags(children)}</Tag>;
}
