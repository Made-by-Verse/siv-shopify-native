export default class Base {
  constructor() {
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;
  }

  destroy() {
    this.initialized = false;
  }

  // Utility method for handling DOM queries
  $(selector, context = document) {
    return context.querySelector(selector);
  }

  // Utility method for handling multiple DOM queries
  $$(selector, context = document) {
    return [...context.querySelectorAll(selector)];
  }

  // Utility method for event delegation
  delegate(element, eventName, selector, handler) {
    element.addEventListener(eventName, (event) => {
      if (event.target.matches(selector)) {
        handler(event);
      }
    });
  }
}
