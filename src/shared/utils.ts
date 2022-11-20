const VALID_ID_PREFIX = `/@id/`;
const NULL_BYTE_PLACEHOLDER = '__x00__';

export function wrapViteId(id: string): string {
  return id.startsWith(VALID_ID_PREFIX)
    ? id
    : VALID_ID_PREFIX + id.replace('\0', NULL_BYTE_PLACEHOLDER);
}

export function unwrapViteId(id: string): string {
  return id.startsWith(VALID_ID_PREFIX) ? id.slice(VALID_ID_PREFIX.length) : id;
}
