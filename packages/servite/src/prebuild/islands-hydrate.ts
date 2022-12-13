import type { IslandType } from '../shared/types.js';

/**
 * Astro passes `children` as a string of HTML, so we need
 * a wrapper `div` to render that content as VNodes.
 *
 * As a bonus, we can signal to React that this subtree is
 * entirely static and will never change via `shouldComponentUpdate`.
 */
const StaticHtml = ({ name, html }: { name: string; html: string }) => {
  if (!html) {
    return null;
  }
  return window.__SERVITE__createElement('servite-slot', {
    name,
    suppressHydrationWarning: true,
    dangerouslySetInnerHTML: { __html: html },
  });
};

/**
 * This tells React to opt-out of re-rendering this subtree,
 * In addition to being a performance optimization,
 * this also allows other frameworks to attach to `children`.
 *
 * See https://preactjs.com/guide/v8/external-dom-mutations
 */
StaticHtml.shouldComponentUpdate = () => false;

if (!customElements.get('servite-island')) {
  customElements.define(
    'servite-island',
    class ServiteIsland extends HTMLElement {
      Component?: any;

      async connectedCallback() {
        const type = this.getAttribute('type') as IslandType;

        switch (type) {
          case 'idle': {
            if ('requestIdleCallback' in window) {
              window.requestIdleCallback(this.hydrate);
            } else {
              setTimeout(this.hydrate, 200);
            }
            break;
          }
          case 'visible': {
            await this.ensureChildren();

            const observer = new IntersectionObserver(entries => {
              for (const entry of entries) {
                if (!entry.isIntersecting) {
                  continue;
                }
                // As soon as we hydrate, disconnect this IntersectionObserver for every `servite-island`
                observer.disconnect();
                this.hydrate();
                // break loop on first match
                break;
              }
            });

            for (let i = 0; i < this.children.length; i++) {
              observer.observe(this.children[i]);
            }
            break;
          }
          case 'media': {
            const opts = this.getAttribute('opts');
            if (opts) {
              const mql = matchMedia(opts);
              if (mql.matches) {
                this.hydrate();
              } else {
                mql.addEventListener('change', this.hydrate, { once: true });
              }
            }
            break;
          }
          // `load` ...
          default: {
            this.hydrate();
          }
        }
      }

      async ensureChildren() {
        if (this.children.length) {
          return;
        }

        return new Promise<void>(resolve => {
          new MutationObserver((_, observer) => {
            if (this.children.length) {
              observer.disconnect();
              resolve();
            }
          }).observe(this, { childList: true });
        });
      }

      hydrate = async () => {
        if (!window.__SERVITE__islands) {
          // If islands script is not ready, wait for 'servite:hydrate' event
          window.addEventListener('servite:hydrate', this.hydrate, {
            once: true,
          });
          return;
        }

        const index = Number(this.getAttribute('index'));
        const props = JSON.parse(this.getAttribute('props') || '');
        const client = Boolean(this.getAttribute('client'));

        this.Component ??= await window.__SERVITE__islands?.[index]?.();

        if (this.Component) {
          // Render slots
          this.querySelectorAll('servite-slot').forEach(slot => {
            const slotName = slot.getAttribute('name');

            if (!slotName) {
              return;
            }

            props[slotName] = window.__SERVITE__createElement(StaticHtml, {
              name: slotName,
              html: slot.innerHTML,
            });
          });

          const element = window.__SERVITE__createElement(
            this.Component,
            props
          );

          if (client) {
            window.__SERVITE__createRoot(this).render(element);
          } else {
            // Hydrate
            window.__SERVITE__hydrateRoot(this, element);
          }
        }
      };
    }
  );
}
