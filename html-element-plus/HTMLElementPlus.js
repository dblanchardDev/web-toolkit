/**
 * @file HTML Element wrapper which adds utility methods to simplify development of native web components. Reduces the need for heavier frameworks and building code when developing simpler websites.
 *
 * @since March 2026
 *
 * @copyright Copyright 2026 David Blanchard. All rights reserved.
 *     The content of this file must not be copied or reproduced in any manner
 *     without the express permission of David Blanchard.
 */

/**
 * HTML Element wrapper which adds utility methods to simplify development of native web components. Reduces the need for heavier frameworks and building code when developing simpler websites.
 *
 * @class HTMLElementPlus
 * @typedef {HTMLElementPlus}
 * @extends {HTMLElement}
 */
export default class HTMLElementPlus extends HTMLElement {
    constructor() {
        super();

        this.#initRefAccess();
    }

    // region: REFERENCE ELEMENTS

    /**
     * Access shadow root HTML elements using their `ref` attribute value.
     *
     * @type {Object<string, (HTMLElement | null)}
     */
    refs = null;

    /** Initialize the this.refs proxy, which allows for quick lookup of HTML elements within the shadow root. */
    #initRefAccess() {
        this.refs = new Proxy(
            {},
            {
                get: this.#getRefFromShadowRoot.bind(this),
            },
        );
    }

    /**
     * Get an element from the shadow root, using its `ref` attribute value.
     *
     * @param {HTMLElement} target Custom element whose shadow root is to be searched.
     * @param {string} name Value of the `ref` attribute to be located.
     * @returns {(HTMLElement | null)} All HTML elements with the matching `ref` value.
     */
    #getRefFromShadowRoot(target, name) {
        return this.shadowRoot?.querySelector(`[ref="${name}"]`);
    }

    // endregion
}
