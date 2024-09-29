export interface HydrateOptions {
  /**
   * id of the island element
   */
  id?: string;
  /**
   * hydrate mode
   */
  on?: 'load' | 'idle' | 'visible' | 'manual' | `media ${string}`;
  /**
   * timeout ms
   */
  timeout?: number;
}

export interface IslandProps {
  hydrate?: HydrateOptions;
}

export const HYDRATE_EVENT_NAME = 'servite-island-hydrate';

let _manualIslands: Set<string> | true = new Set<string>();

export function canManuallyHydrateIsland(id: string) {
  return _manualIslands === true || _manualIslands.has(id);
}

export function hydrateIsland(id: string | true) {
  if (id === true) {
    _manualIslands = true;
  } else if (_manualIslands !== true) {
    _manualIslands.add(id);
  }

  window.dispatchEvent(new CustomEvent(HYDRATE_EVENT_NAME));
}
