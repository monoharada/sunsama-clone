/**
 * Helper functions for htmx integration
 */

/**
 * Initialize htmx for a given element
 */
export function initHtmx(element: HTMLElement) {
  if (typeof window !== 'undefined' && 'htmx' in window) {
    (window as any).htmx.process(element);
  }
}

/**
 * Trigger an htmx event
 */
export function triggerHtmxEvent(element: HTMLElement, eventName: string, detail?: any) {
  element.dispatchEvent(new CustomEvent(eventName, { detail, bubbles: true }));
}
