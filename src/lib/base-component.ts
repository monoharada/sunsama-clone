/**
 * Base class for all Web Components
 * Provides common functionality and lifecycle hooks
 */
export abstract class BaseComponent extends HTMLElement {
  protected shadow: ShadowRoot;
  protected styleSheet: string = '';

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  disconnectedCallback() {
    this.cleanup();
  }

  /**
   * Render the component's HTML
   */
  protected abstract render(): void;

  /**
   * Attach event listeners
   */
  protected attachEventListeners(): void {
    // Override in subclasses
  }

  /**
   * Cleanup before component is removed
   */
  protected cleanup(): void {
    // Override in subclasses
  }

  /**
   * Create a style element with the component's styles
   */
  protected createStyles(): HTMLStyleElement {
    const style = document.createElement('style');
    style.textContent = this.styleSheet;
    return style;
  }

  /**
   * Emit a custom event
   */
  protected emit(eventName: string, detail?: any) {
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail,
        bubbles: true,
        composed: true,
      })
    );
  }
}
