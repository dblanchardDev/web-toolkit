/**
 * @file HTML Element wrapper which adds utility methods to simplify development of native web components. Reduces the need for heavier frameworks and building code when developing simpler websites.
 *
 * @since March 2026
 */

// BUG: i18n dictionary not retrieved unless render is called

/**
 * Check whether a value is an actual object (i.e. {}).
 *
 * @param {*} value Value to be checked.
 * @returns {boolean} True if it is an object.
 */
function isObject(value) {
    return value !== null && typeof value === 'object' && value.constructor === Object;
}

// region: HTML/CSS FRAGMENTS & FETCHING

/**
 * Template literal tag which activates IDE syntax highlighting of HTML code in JavaScript.
 */
export const html = String.raw;

/**
 * Template literal tag which activates IDE syntax highlighting of CSS code in JavaScript.
 */
export const css = String.raw;

/**
 * Cache the promises for {@link fetchFragment} so that requesting the same resource does not result in another fetch. Do not use directly, always use {@link fetchFragment}.
 *
 * @type {{ markup: {string, Promise<string>}; styles: {string, Promise<string>}; dictionary: {string, Promise<object>}; }}
 */
let fragmentCache = {
    markup: {},
    styles: {},
    dictionary: {},
};

/**
 * Fetch an HTML or CSS fragment, or an i18n dictionary in JSON format, caching it for re-use across all users of HTMLElementPlus.
 *
 * @async
 * @param {URL} url URL to the file to be fetched (or retrieved from the cache)
 * @param {'markup' | 'styles' | 'dictionary'} type Type of file to fetch, either 'markup', 'styles', or 'dictionary'.
 * @returns {(string | object)} Returns a string for HTML and CSS, and an Object for i18n content.
 */
async function fetchFragment(url, type) {
    if (!['markup', 'styles', 'dictionary'].includes(type)) {
        throw new TypeError(`Unable to fetch fragment as type '${type}' is not valid (markup, styles, dictionary).`);
    }

    // If not yet cached or getting fetched
    if (!(url in fragmentCache[type])) {
        // 1. Fetch the fragment
        const promise = fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `HTTP error while fetch fragment from '${url}': ${response.status} - ${response.statusText}.`,
                    );
                }

                // 2. Check returned content type (avoid MIME sniffing)
                const contentType = response.headers.get('content-type');
                if (!contentType) throw new TypeError(`Missing Content-Type header for '${url}'.`);

                const actualMime = contentType.split(';')[0].trim().toLowerCase();
                const expectedMime = {markup: 'text/html', styles: 'text/css', dictionary: 'application/json'}[type];
                if (actualMime !== expectedMime) {
                    throw new TypeError(
                        `MIME type mismatch on '${url}'. Expected '${expectedMime}', received '${actualMime}'.`,
                    );
                }

                // 3. Obtain the contents
                if (type == 'dictionary') return response.json();
                else return response.text();
            })
            .then((data) => {
                // 4. Check the returned contents
                if (type == 'dictionary' && isObject(data) == false) {
                    throw new TypeError(`Fetched i18n contents from '${url}' does not contain an object.`);
                }
                return data;
            });

        fragmentCache[type][url] = promise;
    }

    return await fragmentCache[type][url];
}

// endregion

/**
 * HTML Element wrapper which adds utility methods to simplify development of native web components. Reduces the need for heavier frameworks and building code when developing simpler websites.
 *
 * @class HTMLElementPlus
 * @typedef {HTMLElementPlus}
 * @extends {HTMLElement}
 */
export class HTMLElementPlus extends HTMLElement {
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

    /**
     * Object used to define the configuration of attributes in {@link attributeConfigs}.
     * @typedef {{type?: ('string'|'number'|'boolean'), reflected?: boolean, readOnly?: boolean, default?: (string|number)}} AttributeConfig
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
     * Listing of element attributes whose behaviour is to be modified or enhanced. Key is the attributes name and value is a configuration object:
     *
     * type: 'string' – keep the attribute value as a string (default); 'number' – auto-cast strings to numbers, returning NaN when needed; 'boolean' – return a boolean depending on whether the attribute is present.
     * reflected: Boolean indicating whether the element's attributed is reflected as a property in the class. Defaults to false.
     * readOnly: Boolean setting the reflected property to read-only (cannot be modified). Only applied to reflected attributes. Defaults to false.
     * default: Value (string, number, or boolean) to which the property is set if the attribute is not set. The default for attributes is made available in reflections, in {@link onAllAttributesSet} and {@link onAttributeChange} when the attribute itself isn't set.
     *
     * @readonly
     * @type {Object<string, AttributeConfig>}
     */
    get attributeConfigs() {
        const value = this.constructor?.attributeConfigs ?? {};
        if (!isObject(value)) throw new TypeError('Static attributeConfigs property must be an object (or null).');
        return value;
    }

    /**
     * Pre-process an attribute value, applying the defaults and casting the type.
     *
     * @param {string} attrName Name of the attribute.
     * @param {?(string|number|boolean)} value Attribute's value that is to be processed, as read from the attribute.
     * @returns {*} The value after processing.
     */
    #preProcessAttribute(attrName, value) {
        const config = this.attributeConfigs[attrName] ?? {};

        if (config?.type == 'boolean') {
            // Boolean based on presence (null is absent, other is present)
            value = value !== null;
        } else {
            // Apply the default if need
            if (value === null && 'default' in config) {
                value = config.default;
            }

            // Cast the value if number or boolean
            const type = config?.type ?? 'string';
            if (type == 'number' && value !== null) {
                value = parseFloat(value);
            }
        }

        return value;
    }

    // endregion
    // region: ATTRIBUTE REFLECTION

    /** Initialize the reflection of HTML attributes to class properties. */
    #initReflections() {
        const isFrozen = Object.isFrozen(this.attributeConfigs);
        if (!isFrozen) Object.freeze(this.attributeConfigs);

        for (let [attrName, config] of Object.entries(this.attributeConfigs)) {
            if (!isObject(config)) {
                throw new TypeError(
                    'Values inside the static attributeConfigs property object must also be an object (or null).',
                );
            }
            if (!isFrozen) Object.freeze(config);

            if (config?.reflected) {
                const readOnly = !!config?.readOnly;
                if (config?.type === 'boolean') {
                    if ('default' in config) {
                        console.warn(
                            `HTMLElementPlus: attributeConfigs.${attrName} has a default value, which is not supported on boolean reflections.`,
                        );
                    }
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
                    if (castValue === null) this.removeAttribute(attrName);
                    else this.setAttribute(attrName, castValue);
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
     * List of element attributes which will trigger callbacks on load and change.
     *
     * @readonly
     * @type {string[]}
     */
    get observedAttribute() {
        const value = this.constructor?.observedAttributes || [];
        if (!Array.isArray(value)) throw new TypeError('Static observedAttribute property must be an array (or null).');
        return value;
    }

    /**
     * List of observed attributes which are defined on the HTML element at load and for which we must wait before calling {@link onAllAttributesSet}. Afterwards, this property gets nulled to indicate all attributes already processed.
     *
     * @type {?string[]}
     */
    #awaitedAttributes = [];

    /**
     * Store each resulting property as it gets loaded in order to invoke {@link onAllAttributesSet}. Afterwards, this property gets set to null to release the memory usage.
     *
     * @type {?Object<string, (string|number|boolean)>}
     */
    #accumulatedProperties = {};

    /** Initialize the logic required for {@link onAllAttributesSet} and {@link onAttributeSet}. This is in addition to the {@link attributeChangedCallback} which is responsible for calling {@link handleAttributeChangedCallback}. */
    #initOnAttributeChanges() {
        for (const attrName of this.observedAttribute) {
            const isSet = !!this.attributes.getNamedItem(attrName);

            if (isSet) {
                // Attribute is set and needs to be awaited
                this.#awaitedAttributes.push(attrName);
            } else {
                const config = this.attributeConfigs[attrName] ?? {};
                if (config?.type == 'boolean') {
                    this.#accumulatedProperties[attrName] = false;
                } else if ('default' in config) {
                    this.#accumulatedProperties[attrName] = config.default;
                }
            }
        }
    }

    /**
     * Handle the attribute change internally, either accumulating the changes to call {@link onAllAttributesSet}, or after all attributes are set, call {@link onAttributeChange} for each change.
     *
     * @param {string} name Name of the attribute which changed.
     * @param {string} oldValue Value of the attribute before the change.
     * @param {string} newValue Value of the attribute after the change.
     */
    #handleAttributeChangedCallback(name, oldValue, newValue) {
        const newProcessed = this.#preProcessAttribute(name, newValue);

        // Accumulating properties before calling onAllAttributesSet
        if (this.#awaitedAttributes !== null) {
            // Accumulate property for later
            this.#accumulatedProperties[name] = newProcessed;

            // No longer awaiting this attribute, so remove
            this.#awaitedAttributes = this.#awaitedAttributes.filter((n) => n !== name);

            // If last property set, finish call to onAllAttributesSet
            if (this.#awaitedAttributes.length == 0) {
                this.onAllAttributesSet(this.#accumulatedProperties);
                this.#awaitedAttributes = null;
                this.#accumulatedProperties = null;
            }
        }
        // All already set, this is a change
        else {
            const oldProcessed = this.#preProcessAttribute(name, oldValue);
            this.onAttributeChange(name, oldProcessed, newProcessed);
        }
    }

    /**
     * Invoked once all observed attributes that will have a value or default are set. Called only once at load time. Values will be passed through {@link defaultAttributes} and {@link attributesParser}. Will only be called once after loading, after which {@link onAttributeChange} should be used.
     *
     * @param {Object<string, (string|number|boolean)>} attributes - All observed attributes as key-value pairs where the key is the attribute name and the value the attribute's value.
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

    /**
     * Configuration for the element internals states (used in CSS via :state() pseudo-class) that get reflected as properties in the class. Keys are the state name, values are a boolean indicating the initial state with `true` being present. See https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_states_and_custom_state_pseudo-class_css_selectors for more details.
     *
     * @readonly
     * @type {Object<string, boolean>}
     */
    get internalStates() {
        const value = this.constructor?.internalStates || {};
        if (!isObject(value)) throw new TypeError('Static internalStates property must be an object (or null).');
        return value;
    }

    /** Initialize the element internals states, creating the reflected properties and setting initial status. */
    #initInternalStates() {
        this.#internals = this.attachInternals();

        Object.freeze(this.internalStates);

        for (let [stateName, initiallyPresent] of Object.entries(this.internalStates)) {
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
    // region: HTML/CSS RENDERING + INTERNATIONALIZATION

    /**
     * HTML to be rendered when calling {@link render}. Can either be a string containing the HTML fragment itself, or a URL() to an HTML file containing the fragment. Changes to this value after calling {@link render} will be ignored.
     *
     * @static
     * @type {string | URL}
     */
    static markup = html``;

    /**
     * HTML to be rendered when calling {@link render}. Can either be a string containing the HTML fragment itself, or a URL() to an HTML file containing the fragment. Changes to this value after calling {@link render} will be ignored.
     *
     * @readonly
     * @type {string | URL}
     */
    get markup() {
        return this.constructor.markup;
    }

    /**
     * CSS to be used for styling the {@link template} when calling {@link render}. Can either be a string containing the CSS fragment itself, or a URL() to a CSS file containing the fragment. Changes to this value after calling {@link render} will be ignored.
     *
     * @static
     * @type {string | URL}
     */
    static styles = css``;

    /**
     * CSS to be used for styling the {@link template} when calling {@link render}. Can either be a string containing the CSS fragment itself, or a URL() to a CSS file containing the fragment. Changes to this value after calling {@link render} will be ignored.
     *
     * @readonly
     * @type {string | URL}
     */
    get styles() {
        return this.constructor.styles;
    }

    /**
     * Internationalization dictionaries. Key-value pairs should be the language code and the word lookup, respectively. The language code can also be "default", which will be used when set language is unavailable or does not contain all words. The word lookup must be an object, containing key-word pairs.
     *
     * @static
     * @type {Object<string, Object<string, *> | URL>}
     */
    static dictionaries = {};

    /**
     * Internationalization dictionaries. Key-value pairs should be the language code and the word lookup, respectively. The language code can also be "default", which will be used when set language is unavailable or does not contain all words. The word lookup must be an object, containing key-word pairs.
     *
     * @readonly
     * @type {Object<string, Object<string, *> | URL>}
     */
    get dictionaries() {
        const value = this.constructor.dictionaries;
        if (!isObject(value)) throw new TypeError('Static dictionaries property must be an object (or null).');
        return value;
    }

    /**
     * Compiled internationalization dictionary for the current language, as derived from the static {@link dictionaries}. Available privately only to prevent modification by the user. The {@link info} getter is used by users.
     *
     * @type {Object<string, *>}
     */
    #i18n = {};

    /**
     * Compiled internationalization dictionary for the current language, as derived from the static {@link dictionaries}.
     *
     * @readonly
     * @type {Object<string, *>}
     */
    get i18n() {
        return this.#i18n;
    }

    /**
     * Whether the component has already been rendered.
     *
     * @type {boolean}
     */
    #rendered = false;

    /** Automatically add the HTML stored in {@link template} to the shadow root and style it using the contents of {@link styles}. Content will only be rendered once; calling this method a second time will do nothing.
     *
     * @async
     */
    async render() {
        // Ensure rendering only occurs once
        if (this.#rendered) return;
        this.#rendered = true;

        // Retrieve the contents
        const [markupGetter, stylesGetter] = await Promise.all([
            this.#retrieveStringFragment('markup'),
            this.#retrieveStringFragment('styles'),
            this.#deriveI18n(),
        ]);

        // Add the style sheet to the shadow root
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(stylesGetter());
        this.shadowRoot.adoptedStyleSheets = [sheet];

        // Add the HTML to the shadow root
        const template = document.createElement('template');
        template.innerHTML = markupGetter();
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    /**
     * Retrieve an HTML or CSS fragment, either getting it directly from this class' constructor if it is a string, or fetching it when its a URL.
     *
     * @async
     * @param {'markup' | 'styles'} type Type of data to retrieve.
     * @returns {() => string} A factory function which when called returns the fragment string with i18n templates replaced.
     */
    async #retrieveStringFragment(type) {
        const raw = this[type];

        if (raw instanceof URL) {
            // For URLs, fetch the fragment - returns function which applies i18n substitution
            return await fetchFragment(raw, type).then((fragment) => {
                return () => {
                    // Replaces any `${i18n.myString}`
                    return fragment.replace(/\$\{(.*?)\}/gu, (_, key) => {
                        return this.i18n[key];
                    });
                };
            });
        } else if (typeof raw === 'string') {
            // Return the data itself, but through a function that call the getter to allow i18n to apply
            return () => {
                return this[type];
            };
        }

        throw new TypeError(`Definition for static property '${type}' was not a URL() nor a string.`);
    }

    /**
     * Populate the {@link #i18n} (and therefore also {@link i18n}) with data from the dictionaries. The language codes will be obtained from this custom elements lang attribute, falling back to the document's lang attribute. In addition, the language specific dictionary will be merged with the default dictionary (if both present).
     *
     * @async
     */
    async #deriveI18n() {
        // Choose dictionaries to be processed
        const rawDefault = this.dictionaries?.default ?? {};

        const langCode = this.lang || document.documentElement.lang || null;
        const rawLang = this.dictionaries?.[langCode] ?? {};

        // Fetch any URL based dictionaries
        const [defaultDict, langDict] = await Promise.all(
            [rawDefault, rawLang].map((dict) => {
                if (dict instanceof URL) return fetchFragment(dict, 'dictionary');
                else if (isObject(dict)) return dict;
                throw new TypeError(
                    "An entry within the static property 'dictionaries' was not a URL() nor an object.",
                );
            }),
        );

        // Set the i18n property to the combined dictionaries
        this.#i18n = {...defaultDict, ...langDict};
    }

    // endregion
}

// Provide a default export version.
export default HTMLElementPlus;
