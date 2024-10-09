export function withoutTrailingSlash(url: string) {
  return url.replace(/\/$/, '').replace('/#', '#');
}
