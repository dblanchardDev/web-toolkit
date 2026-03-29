// @ts-check
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
        this.#initReflectedAttributes();
    }

    // region: TYPE HINTS FOR CUSTOM ELEMENT FUNCTIONS

    /**
     * List of attributes that when changed should invoke the attributeChangedCallback method.
     *
     * @static
     * @type {string[]}
     */
    static observedAttributes = [];

    /** Invoked when the custom element is first connected to the document's DOM. */
    connectedCallback() {
        /*empty*/
    }

    /** Invoked when the custom element is disconnected from the document's DOM. */
    disconnectedCallback() {
        /*empty*/
    }

    /** Invoked when the element is moved to a different place in the DOM via Element.moveBefore(). */
    connectedMoveCallback() {
        /*empty*/
    }

    /** Invoked when the custom element is moved to a new document. */
    adoptedCallback() {
        /*empty*/
    }

    /* eslint-disable no-unused-vars -- REASON */
    /**
     * Invoked when one of the custom element's attributes is added, removed, or changed.
     *
     * @param {string} name Name of the attribute which changed.
     * @param {string} oldValue Value of the attribute before the change.
     * @param {string} newValue Value of the attribute after the change.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        /*empty*/
    }
    /* eslint-enable no-unused-vars */

    // endregion
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
    // region: EVENTS

    /**
     * Dispatch a new custom event on this custom element. It will not be composed and is therefore restricted to the shadow root.
     *
     * @param {string} type Name of the custom event.
     * @param {*} [detail=null] Event-dependent value associated with the event. Available to the handler using the CustomEvent.detail property. Defaults to null.
     * @param {boolean} [bubbles=true] Whether the event bubbles up to its ancestors. Defaults to true.
     */
    emitEvent(type, detail = null, bubbles = true) {
        this.dispatchEvent(new CustomEvent(type, {detail, bubbles, composed: false}));
    }

    /**
     * Dispatch a new custom event on this custom element. It be composed will therefore trigger listeners outside of a shadow root.
     *
     * @param {string} type Name of the custom event.
     * @param {*} [detail=null] Event-dependent value associated with the event. Available to the handler using the CustomEvent.detail property. Defaults to null.
     * @param {boolean} [bubbles=true] Whether the event bubbles up to its ancestors. Defaults to true.
     */
    emitComposedEvent(type, detail = null, bubbles = true) {
        this.dispatchEvent(new CustomEvent(type, {detail, bubbles, composed: true}));
    }

    // endregion
    // region: REFLECTED ATTRIBUTES

    /**
     * List of HTML element attributes that should be made available as properties of this custom element. The property will be reflected both ways unless it is set to read-only at which point it cannot be modified at the custom element property level. Attributes marked as boolean only have their presence reflected, whereas all other values are reflected as their string value.
     *
     * @static
     * @type {Object<string, {boolean?: boolean, readOnly?: boolean}>}
     */
    static reflectedAttributes = {};

    /** Initialize the reflection of HTML attributes to class properties. */
    #initReflectedAttributes() {
        /** @type {Object<string, {boolean?: boolean, readOnly?: boolean}>} */
        let reflected = this.constructor.reflectedAttributes || {};

        for (let [attrName, config] of Object.entries(reflected)) {
            if (!config) config = {};
            const readOnly = config?.readOnly || false;

            if (config?.boolean) {
                this.#addBooleanReflection(attrName, readOnly);
            } else {
                this.#addValueReflection(attrName, readOnly);
            }
        }
    }

    /**
     * Convert a snake-case attribute name to a camel case property name.
     *
     * @param {string} name The snake-case name.
     * @returns {string} The camel-case name.
     */
    #snakeToCamel(name) {
        if (name.includes('-')) {
            name = name
                .split('-')
                .map((value, index) => {
                    if (index > 0) return value.slice(0, 1).toUpperCase() + value.slice(1);
                    else return value;
                })
                .join('');
        }
        return name;
    }

    /**
     * Add a boolean property to the component which reflects an HTML attribute. Boolean properties work based on the presence or absence of the attribute only.
     *
     * @param {string} attrName Name of the source attribute.
     * @param {boolean} readOnly Whether the property is read-only. Will decide whether a setter is added.
     * @returns {string} Name of the resulting property.
     */
    #addBooleanReflection(attrName, readOnly) {
        const propName = this.#snakeToCamel(attrName);

        // Create getter
        Object.defineProperty(this, propName, {
            get() {
                return this.hasAttribute(attrName);
            },
            configurable: true,
        });

        // Create setter
        if (readOnly) {
            this.#addReadOnlySetter(propName);
        } else {
            /* eslint-disable accessor-pairs -- get defined elsewhere */
            Object.defineProperty(this, propName, {
                set(value) {
                    if (value) this.setAttribute(attrName, '');
                    else this.removeAttribute(attrName);
                },
            });
            /* eslint-enable accessor-pairs */
        }

        Object.defineProperty(this, propName, {configurable: false});

        return propName;
    }

    /**
     * Add a value property to the component which reflects an HTML attribute. Value properties return the actual value stored in the attribute.
     *
     * @param {string} attrName Name of the source attribute.
     * @param {boolean} readOnly Whether the property is read-only. Will decide whether a setter is added.
     * @returns {string} Name of the resulting property.
     */
    #addValueReflection(attrName, readOnly) {
        const propName = this.#snakeToCamel(attrName);

        // Create getter
        Object.defineProperty(this, propName, {
            get() {
                const value = this.getAttribute(attrName);
                return value; // TODO: add support for parsing and defaults
            },
            configurable: true,
        });

        // Create setter
        if (readOnly) {
            this.#addReadOnlySetter(propName);
        } else {
            /* eslint-disable accessor-pairs -- get set elsewhere */
            Object.defineProperty(this, propName, {
                set(value) {
                    this.setAttribute(attrName, value);
                },
            });
            /* eslint-enable accessor-pairs */
        }

        Object.defineProperty(this, propName, {configurable: false});

        return propName;
    }

    /**
     * Add a read-only setter to a reflected property, throwing an error if setter is called.
     *
     * @param {string} propName Name of the resulting property.
     */
    #addReadOnlySetter(propName) {
        /* eslint-disable accessor-pairs -- getter set elsewhere */
        Object.defineProperty(this, propName, {
            set() {
                throw new TypeError(`${propName} is read-only`);
            },
        });
        /* eslint-enable accessor-pairs */
    }

    // endregion
}
