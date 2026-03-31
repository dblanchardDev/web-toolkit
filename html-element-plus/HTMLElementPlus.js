/**
 * @file HTML Element wrapper which adds utility methods to simplify development of native web components. Reduces the need for heavier frameworks and building code when developing simpler websites.
 *
 * @since March 2026
 *
 * @copyright Copyright 2026 David Blanchard. All rights reserved.
 *     The content of this file must not be copied or reproduced in any manner
 *     without the express permission of David Blanchard.
 */

// TODO HTML Rendering/Fetching
// TODO CSS Rendering/Fetching
// TODO Await for DOM ready and attributes reflected

/**
 * HTML Element wrapper which adds utility methods to simplify development of native web components. Reduces the need for heavier frameworks and building code when developing simpler websites.
 *
 * @class HTMLElementPlus
 * @typedef {HTMLElementPlus}
 * @extends {HTMLElement}
 */ //@ts-ignore
export default class HTMLElementPlus extends HTMLElement {
    constructor() {
        super();

        this.#initRefAccess();
        this.#initReflections();
        this.#initOnAttributeChanges();
        this.#initInternalStates();
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

    /**
     * Invoked when one of the custom element's attributes is added, removed, or changed.
     *
     * ⚠️ Implementing this method will break the {@link onAttributeChange} and {@link onAllAttributesSet} methods unless super.attributeChangedCallback() is in the override method.
     *
     * @param {string} name Name of the attribute which changed.
     * @param {string} oldValue Value of the attribute before the change.
     * @param {string} newValue Value of the attribute after the change.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        this.#handleAttributeChangedCallback(name, oldValue, newValue);
    }

    // endregion
    // region: REFERENCE ELEMENTS

    /**
     * Access shadow root HTML elements using their `ref` attribute value.
     *
     * @type {Object<string, (HTMLElement | null)>}
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
    // region: EVENT DISPATCHING

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
    // region: ATTRIBUTE CONFIGURATION

    // BUG: when an attribute is of type boolean, the observation doesn't work in the same way instead casting the value to a boolean
    // BUG: default for a boolean attributes doesn't work as a default of true doesn't result in the attribute being present. Same really for value attributes.
    // FIXME: ensure that on setting reflected to null, the default is used and whether that's desired
    // FIXME: Consider freezing configurations once used.

    /**
     * Object used to define the configuration of attributes in {@link attributeConfigs}.
     * @typedef {{type?: ('string'|'number'|'boolean'), reflected?: boolean, readOnly?: boolean, default?: (string|number|boolean)}} AttributeConfig
     */

    /**
     * Listing of element attributes whose behaviour is to be modified or enhanced. Key is the attributes name and value is a configuration object:
     *
     * type: 'string' – keep the attribute value as a string (default); 'number' – auto-cast strings to numbers, returning NaN when needed; 'boolean' – return a boolean depending on whether the attribute is present.
     * reflected: Boolean indicating whether the element's attributed is reflected as a property in the class. Defaults to false.
     * readOnly: Boolean setting the reflected property to read-only (cannot be modified). Only applied to reflected attributes. Defaults to false.
     * default: Value (string, number, or boolean) to which the property is set if the attribute is not set. The default for attributes is made available in reflections, in {@link onAllAttributesSet} and {@link onAttributeChange} when the attribute itself isn't set.
     *
     * @static
     * @type {Object<string, AttributeConfig>}
     */
    static attributeConfigs = {};

    /**
     * Pre-process an attribute value, applying the defaults and casting the type.
     *
     * @param {string} attrName Name of the attribute.
     * @param {string} value Attribute's value that is to be processed, as read from the attribute.
     * @returns {*} The value after processing.
     */
    #preProcessAttribute(attrName, value) {
        let processed;

        /** @type {AttributeConfig} */ // @ts-ignore
        const config = this.constructor.attributeConfigs[attrName] ?? {};

        // Apply the default if need
        if (value === null && 'default' in config) {
            processed = config.default;
        }

        // Cast the value if number or boolean
        const type = config?.type ?? 'string';
        if (type == 'number') {
            processed = parseFloat(value);
        } else if (type == 'boolean') {
            processed = !!value;
        }

        return processed ?? value;
    }

    // endregion
    // region: ATTRIBUTE REFLECTION

    /** Initialize the reflection of HTML attributes to class properties. */
    #initReflections() {
        /** @type {Object<string, AttributeConfig>} */ //@ts-ignore
        const attrConfigs = this.constructor.attributeConfigs || {};

        for (let [attrName, config] of Object.entries(attrConfigs)) {
            if (!Object.is(config)) config = {};

            if (config?.reflected) {
                const readOnly = !!config?.readOnly;
                if (config?.type === 'boolean') {
                    this.#addBooleanReflection(attrName, readOnly);
                } else {
                    this.#addValueReflection(attrName, readOnly);
                }
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
     * Add a value property to the component which reflects an HTML attribute. Value properties return the actual value stored in the attribute. Defaults and type casting defined in {@link attributeConfigs} are automatically applied.
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
                return this.#preProcessAttribute(attrName, value);
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
                    const castValue = this.#preProcessAttribute(attrName, value);
                    this.setAttribute(attrName, castValue);
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
    // region: ON ATTRIBUTE CHANGE

    /**
     * List of observed attributes which are defined on the HTML element at load and for which we must wait before calling {@link onAllAttributesSet}.
     *
     * @type {string[]}
     */
    #awaitedAttributes = [];

    /**
     * Store each resulting property as it gets loaded in order to invoke {@link onAllAttributesSet}, after which this property gets nulled to indicate all attributes already processed.
     *
     * @type {?Object<string, *>[]}
     */
    #awaitedProperties = [];

    /** Initialize the logic required for {@link onAllAttributesSet} and {@link onAttributeSet}.
     * This is in addition to the {@link attributeChangedCallback} which is responsible for calling {@link #handleAttributeChangedCallback}. */
    #initOnAttributeChanges() {
        // List out all observed attributes that are set so their value can be awaited

        /** @type string[] */ //@ts-ignore
        const observed = this.constructor?.observedAttributes || [];

        this.#awaitedAttributes = observed.filter((attrName) => {
            return !!this.attributes.getNamedItem(attrName);
        });
    }

    /**
     * Handle the attribute change internally, either accumulating the changes to call {@link onAllAttributesSet}, or once all attributes are set, call {@link onAttributeChange} for each change.
     *
     * @param {string} name Name of the attribute which changed.
     * @param {string} oldValue Value of the attribute before the change.
     * @param {string} newValue Value of the attribute after the change.
     */
    #handleAttributeChangedCallback(name, oldValue, newValue) {
        const oldProcessed = this.#preProcessAttribute(name, oldValue);
        const newProcessed = this.#preProcessAttribute(name, newValue);

        // Accumulating properties before calling onAllAttributesSet
        if (this.#awaitedProperties !== null) {
            // Accumulate property for later
            this.#awaitedProperties[name] = newProcessed;

            // No longer awaiting this attribute, so remove
            const awaitingIndex = this.#awaitedAttributes.indexOf(name);
            if (awaitingIndex > -1) {
                this.#awaitedAttributes.splice(awaitingIndex, 1);
            }

            // If last property set, finish call to onAllAttributesSet
            if (this.#awaitedAttributes.length == 0) {
                //@ts-ignore
                const withDefaults = {...this.constructor.defaultAttributes, ...this.#awaitedProperties};
                this.onAllAttributesSet(withDefaults);
                this.#awaitedProperties = null;
            }
        }
        // All already set, this is a change
        else {
            this.onAttributeChange(name, oldProcessed, newProcessed);
        }
    }

    /**
     * Invoked once all observed attributes that will have a value or default are set. Called only once at load time. Values will be passed through {@link defaultAttributes} and {@link attributesParser}. Will only be called once after loading, after which {@link onAttributeChange} should be used.
     *
     * @param {Object<string, (string|number)>[]} attributes - All observed attributes as key-value pairs where the key is the attribute name and the value the attribute's value.
     */
    // eslint-disable-next-line no-unused-vars
    onAllAttributesSet(attributes) {
        /* empty */
    }

    /**
     * Invoke each time an observed attribute changes value. Unlike {@link attributeChangedCallback}, the values are pre-processed by {@link defaultAttributes} and {@link attributesParser}. Additionally, it is not invoked at load time, instead deferring this duty to {@link onAllAttributesSet}.
     *
     * @param {string} name - Name of the attribute.
     * @param {(string|number)} oldValue - Attribute's previous value.
     * @param {(string|number)} newValue - Attribute's new value.
     */
    // eslint-disable-next-line no-unused-vars
    onAttributeChange(name, oldValue, newValue) {
        /* empty */
    }

    // endregion
    // region: REFLECTED INTERNALS STATE

    /**
     * Internal element in which to stores states for CSS.
     *
     * @type {ElementInternals}
     */
    #internals = null;

    /**
     * Configuration for the element internals states (used in CSS via :state() pseudo-class) that get reflected as properties in the class. Keys are the state name, values are a boolean indicating the initial state with `true` being present. See https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_states_and_custom_state_pseudo-class_css_selectors for more details.
     *
     * @static
     * @type {Object<string, boolean>}
     */
    static internalStates = {};

    /** Initialize the element internals states, creating the reflected properties and setting initial status. */
    #initInternalStates() {
        this.#internals = this.attachInternals();

        /** @type {Object<string, boolean>} */ //@ts-ignore
        const stateConfigs = this.constructor.internalStates || {};

        for (let [stateName, initiallyPresent] of Object.entries(stateConfigs)) {
            const propName = this.#addStateReflection(stateName);
            this[propName] = initiallyPresent;
        }
    }

    /**
     * Add a state property to the component which reflects an internal element state.
     *
     * @param {string} stateName Name of the state.
     * @returns {string} Name of the resulting property.
     */
    #addStateReflection(stateName) {
        const propName = this.#snakeToCamel(stateName);

        // Create getter
        Object.defineProperty(this, propName, {
            get() {
                return this.#internals.states.has(stateName);
            },
            set(value) {
                if (value) this.#internals.states.add(stateName);
                else this.#internals.states.delete(stateName);
            },
        });

        return propName;
    }

    // endregion
}
