function isStyle(node: Node): node is HTMLStyleElement {
  return (
    node.nodeType === node.ELEMENT_NODE &&
    (node as Element).tagName.toLowerCase() === 'style'
  );
}

function isViteInjectedStyle(node: Node): node is HTMLStyleElement {
  return isStyle(node) && node.getAttribute('type') === 'text/css';
}

const ssrInjectedStyles = new Map<string, Element>();

document.querySelectorAll<HTMLStyleElement>('style').forEach(el => {
  if (el.getAttribute('ssr') != null) {
    ssrInjectedStyles.set(el.innerHTML.trim(), el);
  }
});

// Vite injects `<style type="text/css">` for ESM imports of styles
// but servite also SSRs with `<style ssr>` blocks.
// This MutationObserver removes any duplicates as soon as they are hydrated client-side.
const observer = new MutationObserver(records => {
  records.forEach(record => {
    record.addedNodes.forEach(node => {
      if (isViteInjectedStyle(node)) {
        ssrInjectedStyles.get(node.innerHTML.trim())?.remove();
      }
    });
  });
});

observer.observe(document.documentElement, {
  subtree: true,
  childList: true,
});
