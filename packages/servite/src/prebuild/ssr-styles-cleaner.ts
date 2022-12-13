function getStyleSsrDevId(el: HTMLElement): string | undefined {
  return el.dataset.ssrDevId;
}

function getStyleViteDevId(node: Node): string | undefined {
  if (
    node.nodeType === node.ELEMENT_NODE &&
    (node as Element).tagName.toLowerCase() === 'style'
  ) {
    return (node as HTMLStyleElement).dataset.viteDevId;
  }
  return undefined;
}

const ssrInjectedStyles = new Map<string, Element>();

document
  .querySelectorAll<HTMLElement>(
    'style[data-ssr-dev-id], link[data-ssr-dev-id]'
  )
  .forEach(el => {
    const ssrDevId = getStyleSsrDevId(el);
    if (ssrDevId) {
      ssrInjectedStyles.set(ssrDevId, el);
    }
  });

// Vite injects `<style type="text/css">` for ESM imports of styles
// but servite also SSRs with `<style data-ssr-dev-id="xxx">` blocks.
// This MutationObserver removes any duplicates as soon as they are hydrated client-side.
const observer = new MutationObserver(records => {
  records.forEach(record => {
    record.addedNodes.forEach(node => {
      const viteDevId = getStyleViteDevId(node);
      if (viteDevId) {
        ssrInjectedStyles.get(viteDevId)?.remove();
      }
    });
  });
});

observer.observe(document.documentElement, {
  subtree: true,
  childList: true,
});
