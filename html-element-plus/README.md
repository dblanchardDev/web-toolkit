# HTML Element Plus

HTML Element wrapper which adds various utility methods that simplify development of native web components. Reduces the need for heavier frameworks and building code when developing simpler websites.

- [Original HTMLElementPlus Project](#original-htmlelementplus-project)
- [Usage](#usage)
- [Features](#features)
  - [HTML & CSS Rendering & Internationalization](#html--css-rendering--internationalization)
  - [Query Shadow DOM by Reference](#query-shadow-dom-by-reference)
  - [Custom Event Dispatching Shortcut](#custom-event-dispatching-shortcut)
  - [Attribute Configuration](#attribute-configuration)
  - [Improved Observed Attribute Callbacks](#improved-observed-attribute-callbacks)
  - [Reflected Internals States](#reflected-internals-states)
  - [Connected Callback Skipped on Move](#connected-callback-skipped-on-move)
- [JSDoc Type Hints](#jsdoc-type-hints)
- [Tests](#tests)

---

## Original HTMLElementPlus Project

The [_HTMLElementPlus_ project by Ada Rose Cannon](https://github.com/AdaRoseCannon/html-element-plus) is the original source and inspiration for this tool.

Features that originated from the original code include: [Query Shadow DOM by Reference](#query-shadow-dom-by-reference), [Custom Event Dispatching Shortcut](#custom-event-dispatching-shortcut) and [On All Attributes Set & On Attribute Change](#improved-observed-attribute-callbacks); all of which have since been heavily modified. All other features are original to this version and were developed by myself (David Blanchard).

---

## Usage

Include the HTMLElementPlus.js file in your project. Then extend `HTMLElementPlus` instead of `HTMLElement` when creating a web component.

```js
import HTMLElementPlus from "./HTMLElementPlus.js";

class MyComponent extends HTMLElementPlus {

}

customElements.define('my-component', MyComponent);
```

### Browser Compatibility

This tool should be compatible with the latest version of all modern evergreen browsers and is tested against:

- Mozilla Firefox on Windows, Android, and iOS
- Microsoft Edge on Windows, and Android
- Google Chrome on Windows, Android, and iOS
- Apple Safari on iOS

---

## Features

The following features are provided by the HTMLElementPlus class. This is in addition to those already provided by [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) and web component [custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#responding_to_attribute_changes).

- **[HTML & CSS Rendering & Internationalization](#html--css-rendering--internationalization)**: Define HTML and CSS contents within the custom component and automatically apply internationalization.
- **[Query Shadow DOM by Reference](#query-shadow-dom-by-reference)**: Quickly locate elements within your shadow DOM.
- **[Custom Event Dispatching Shortcut](#custom-event-dispatching-shortcut)**: Shortcut for dispatching events from the custom element.
- **[Attribute Configuration](#attribute-configuration)**: Add type casting, reflection, and defaults to attributes.
- **[Improved Observed Attribute Callbacks](#improved-observed-attribute-callbacks)**: Dedicated methods to detect loaded attributes and changes to attributes. These methods respect the [attribute configuration](#attribute-configuration) including defaults and type.
- **[Reflected Internals States](#reflected-internals-states)**: Reflection of element internals state. Used in CSS with `:state()` pseudo-class.
- **[Connected Callback Skipped on Move](#connected-callback-skipped-on-move)**: The _connectedCallback_ method will no longer be called when the custom element is simply moved.

### HTML & CSS Rendering & Internationalization

Define your custom element's HTML and CSS directly in the HTMLElementPlus and call its _render_ method to have it applied to the shadow root automatically.

Simply define your HTML code within the _markup_ static property, and your CSS code within the _styles_ static property. To render the content, call the _render_ method after attaching the shadow in the constructor. Only the first call to _render_ will actually render the contents. Subsequent calls will be ignored.

```js
import {HTMLElementPlus, html, css} from 'HTMLElementPlus.js';

class MyComponent extends HTMLElementPlus {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.render();
    }

    static markup = html`
        <div class="foobar">Hello World!</div>
    `;

    static styles = css`
        .foobar {
            color: blue;
        }
    `;
}
```

> ✒️ **Template Literal Tags**
>
> To enable IDEs to provide syntax highlighting and autocomplete for the HTML and CSS content properties, use the _html_ and _css_ template literal tags that are provided by HTMLElementPlus. Depending on your IDE, you may need to install an extension such as one for Lit syntax highlighting, which shares this template approach.

#### Fetching HTML & CSS Fragments

If the HTML or CSS fragments are lengthy and better stored in their own file, a URL() can be provided in place of the strings in the _markup_ and/or _styles_ static properties.

The call to the _render_ method will now by asynchronous and should be awaited before accessing the shadow root contents. As asynchronous operations should not be in the constructor, the call to the render method should be moved to the _connectedCallback_ method.

```js
class MyComponent extends HTMLElementPlus {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    async connectedCallback() {
        await this.render();
        this.shadowRoot.querySelector(...);
    }

    static markup = new URL('my-html-fragment.html', import.meta.url);

    static styles = new URL('my-css-fragment.css', import.meta.url);
}
```

> 🔗 **Relative URLs**
>
> When constructing a new URL() with a relative path, the base URL must be provided as the second argument. Use `import.meta.url` if the path is relative to the custom component's JavaScript file, or `document.baseURI` if relative to the document's URL (or [base URL](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/base) if set).

The fetching of HTML and CSS fragments is cached and shared across instances of the HTMLElementPlus implementations. Therefore, the same file will only be fetched once and shared across all its users.

#### Internationalization

A multilingual interface can be produced using the internationalization (i18n) dictionaries.

Each language dictionary should be defined in the static _dictionaries_ object property, with the key-value pairs being the language code and the key-term translations object, respectively. In addition to using language codes such as `en` and `fr`, the `default` language code can be used to define a default/fallback dictionary; which will be used if the requested language doesn't exist, or if the key isn't defined in the language specific dictionary.

The HTML Element Plus will automatically compile the dictionary to be used and make it available in the _i18n_ instance property. The language is determined by reading the _lang_ attribute from the custom element, falling back to the document's _lang_`_ attribute.

```js
import HTMLElementPlus from 'HTMLElementPlus.js';

class MyComponent extends HTMLElementPlus {
    constructor() {
        super();
        this.lang = "fr";
        this.render();
    }

    static dictionaries = {
        default: {
            hello: 'Hello!',
            check: '✔️',
        },
        fr: {
            hello: 'Bonjour!',
        },
        de: {
            hello: 'Hallo!',
        }
    }

    sayHello() {
        this.refs.greeting.textContent = this.i18n.hello;
    }
}
```

> 🎯 **Accessing _i18n_ directly**  
> To access the _i18n_ dictionary directly from the code, the _render_ method must have been called (and awaited if any of its resources are fetched). Otherwise, the _i18n_ property will be empty. This allows for the language to be defined and the fetches to be awaited if necessary.

##### Fetching Dictionaries

Similar to [fetching HTML & CSS fragments](#fetching-html--css-fragments), the dictionaries can be fetched from a JSON file. Each language should have its own dictionary, including the default dictionary. Only required dictionaries will be fetched.

```js
import HTMLElementPlus from 'HTMLElementPlus.js';

class MyComponent extends HTMLElementPlus {
    // ...

    static dictionaries = {
        default: new URL('i18n/default.json', import.meta.url),
        fr: new URL('i18n/fr.json', import.meta.url),
        de: new URL('i18n/de.json', import.meta.url),
    }

    // ...
}
```

##### Using i18n Values in Built-In Fragments

To use the values found in the resulting _i18n_ dictionary within HTML and CSS fragments that are embedded directly into the custom element class, use an instance getter instead of the static property to define your _markup_ and _styles_.

Within these getters, you can freely access the _i18n_ dictionary on `this`.

```js
class MyComponent extends HTMLElementPlus {
    // ...

    get markup() {
        return html`
            <div>${this.i18n.hello}</div>
        `;
    }

    get styles() {
        return css`
            .correct:before {
                content: '${this.i18n.check}';
            }
        `;
    }

    // ...
}
```

##### Using i18n Values in Fetched Fragments

To use the values found in the resulting _i18n_ dictionary within [HTML and CSS fragments that are fetched](#fetching-html--css-fragments), use an embedded expression just like is used in JavaScript template literals, containing the name of the _i18n_ key.

> 🪜 **Single Level Access**  
> Only single-level entries can be accessed within the _i18n_ object. Accessing values of inner-objects or arrays is not supported.

```html
<div>${hello}</div>
```

```css
    .correct:before {
        content: '${check} ';
    }
```

### Query Shadow DOM by Reference

Elements in the shadow DOM can be quickly accessed using a `ref` attribute as follows:

```html
<span ref="foobar"></span>
```

```js
class MyComponent extends HTMLElementPlus {
    myMethod() {
        this.refs.foobar.textContent = "Hello World!";
    }
}
```

The reference element is returned dynamically and will reflect any changes made in the shadow DOM.

> ⚠️ **Duplicate Ref Values**  
> If the custom element has multiple ref attributes with the same value, only the first one will be located.

### Custom Event Dispatching Shortcut

A shortcut to dispatch custom events is made available through the `emitEvent` and `emitComposedEvent` methods. Both methods take the same parameters, but the `emitComposedEvent` method will dispatch a composed event which triggers listeners beyond any parent shadow roots.

| Parameter | Type    | Default | Description |
|-----------|---------|---------|-------------|
| type      | string  |         | Name of the custom event. |
| detail    | any     | `null`    | Event-dependent value associated with the event. Available to the handler using the `CustomEvent.detail` property. |
| bubbles   | boolean | `true`    | Whether the event bubbles up to its ancestors. |

```js
class MyComponent extends HTMLElementPlus {
    myMethod() {
        this.emitEvent('downloaded', {file: 'corrections.csv', type: 'csv'});
    }
}
```

### Attribute Configuration

Commonly required behaviour can be automatically added to [element attributes](https://developer.mozilla.org/en-US/docs/Glossary/Attribute), including setting defaults, type casting the value, and [reflecting the attribute](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Reflected_attributes).

This behaviour is set in the _attributeConfigs_ static property as an object, where the key-value pair is the name of the attribute (using snake-case) and the configuration, respectively. The configuration is an object with the following potential values (all optional):

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| type | string | `'string'` | Defines the casting and behaviour of the attribute. See [Attribute Types](#attribute-types) below for details. |
| reflected | boolean | `false` | Indicates whether a [reflected property](#reflected-property) is created for this attribute. If set to `false`, defaults and typing will only be applied to [observed attributes](#observed-attributes). |
| readOnly | boolean | `false` | Whether the reflected property is read-only or is editable. Has no effect if _reflected_ is `false`. |
| default | string \| number | `null` | If the attribute is not set, reflected and observed attributes will default to this value. Has no effect if _type_ is `'boolean'`. |

```js
class MyComponent extends HTMLElementPlus {
    static attributeConfigs = {
        filtered: {
            type: 'boolean',
            reflected: true,
        },
    };
}
```

The _attributesConfigs_ property is also made available as a read only class property. Both the static and instance version of this property will be frozen to prevent modification on first initialization.

#### Attribute Types

The _type_ value in the attribute configuration can be one of the following:

- **`'string'`**: The default. Attribute value remains unchanged when reflected or observed. Value is always a string, or null if not set (and no defaults).
- **`'number'`**: The attribute (which is always a string) will be cast to a number before being reflected or observed. Value is always a number or `NaN`, or null if not set (and no defaults). If non-numeric values are passed to the reflected setter, it will result in the attribute being set to `"NaN"`.
- **`'boolean'`**: The attribute behaves based on presence only, with a `true` value indicating the attribute is present and `false` indicating the attribute is absent. The actual string value of the attribute is ignored.

#### Reflected Property

When _reflected_ is set to true, the attributes become available as a property within the class and can be read and changed using this property. See [Reflected attributes on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Reflected_attributes) for more details.

Values returned by the properties will be type casted and defaults will be used when the attribute isn't set. If _readOnly_ is false, the property can also be set and will be type casted. If a reflected property is set to null, the attribute is removed and will return the default if set or null.

> 🐍 **Snake-Case Names**  
> Attributes that use snake-case names will get an equivalent property name in camel-case. For example, the attribute name `my-data` will become `this.myData` when reflected.

```js
class MyComponent extends HTMLElementPlus {
    static attributeConfigs = {
        count: {
            type: 'number',
            reflected: true,
            default: 0,
        },
    };

    countUp() {
        this.count += 1;
    }
}
```

#### Observed Attributes

Attributes added to the [_observedAttributes_](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#responding_to_attribute_changes) static array can also be manipulated using the [attribute configuration](#attribute-configuration).

Specifically, the defaults and type casting are applied before calling the custom [On All Attributes Set](#improved-observed-attribute-callbacks) and [On Attribute Change](#improved-observed-attribute-callbacks) methods.

> 🚫 **Attribute Changed Callback**  
> The _attributeChangedCallback_ method is native to web components and its behaviour cannot be modified. Defaults and type casting do not apply to values passed to this method.

The _observedAttributes_ property is also made available as a read only class property.

### Improved Observed Attribute Callbacks

Attributes observed using the _observedAttributes_ static array are usually monitored using the _attributeChangedCallback_ method. The HTMLElementPlus class offers two replacements for this native method:

- **_onAllAttributesSet_**: Only invoked once after all attributes that are either set in the HTML or have a default in the [attribute configuration](#attribute-configuration) are loaded. Takes a single parameter: an object where the key-value pairs are the attribute name (in snake-case) and the set/default value, respectively.
- **_onAttributeChange_**: Invoked when an attribute's value is changed, including when it is added or removed. Unlike _attributeChangedCallback_, this method isn't called at load time (use _onAllAttributesSet_ instead). Takes the same 3 parameters as _attributeChangedCallback_: name (string), oldValue (string, number, or boolean), and newValue (string, number, or boolean).

Aside from the separation of the load and change callbacks, the advantage of these methods is that they will respect the [attribute configuration](#attribute-configuration), namely default values and type casting.

> ⚠️ **Using _attributeChangedCallback_**  
> If using the native _attributeChangedCallback_ method, remember to call `super.attributeChangedCallback(name, oldValue, newValue)` at the start of the method. Otherwise, the _onAllAttributesSet_ and _onAttributeChange_ methods will no longer be invoked.

The _observedAttributes_ property is also made available as a read only class property.

### Reflected Internals States

Using [element internals states](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_states_and_custom_state_pseudo-class_css_selectors) for CSS selectors has been simplified by providing [reflected](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Reflected_attributes) versions of the states.

Reflected states must be specified in the _internalStates_ static object, with each key-value pair being the name of the state and the initial state as a boolean, respectively. When the initial state is `true`, the state will be activated automatically during element construction.

```js
class MyComponent extends HTMLElementPlus {
    static internalStates = {
        hidden: true,
    };

    becomeVisible() {
        this.visible = false;
    }
```

The _internalStates_ property is also made available as a read only class property. Both the static and instance version of this property will be frozen to prevent modification on first initialization.

### Connected Callback Skipped on Move

When the custom element is moved using `Element.moveBefore()`, the _connectedCallback_ method will no longer be invoked, instead invoking the _connectedMoveCallback_ method. This matches the behaviour desired by most web component authors; see [MDN's Lifecycle callbacks and state-preserving moves](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#lifecycle_callbacks_and_state-preserving_moves) for more details.

To return to the original behaviour, simply delete the empty _connectedMoveCallback_ method from the HTMLElementPlus class.

---

## JSDoc Type Hints

The HTMLElementPlus class is fully typed and documented using JSDoc. To carry the types and documentation over into your code in Visual Studio Code:

- Make sure you have a [jsconfig.json](https://code.visualstudio.com/docs/languages/jsconfig) file setup with _module_ and _target_ set to an ES version, and _checkJS_ set to true.
- When overriding a method from HTMLElementPlus, add a _@type_ JSDoc comment to the override as shown below:

    ```js
    class MyComponent extends HTMLElementPlus {
        /** @type {HTMLElementPlus['attributeDefaults']} */
        static attributeDefaults() {
            return {"foo": "bar"}
        }
    }
    ```

### Custom Element Life Cycle Callbacks

The life cycle callback methods (e.g. _connectedCallback_, and _attributeChangedCallback_) are defined as empty methods in the HTMLElementPlus class to provide auto-complete capabilities as well as typing where possible.

### Reflected Property Type Hints

To add type hints for [reflected properties](#reflected-property), define their type in the constructor as shown below. You may also defined them as `@property` in the class's JSDoc, but Visual Studio Code does not pick up on those.

```js
class MyComponent extends HTMLElementPlus {
    static reflectedAttributes = {
        info: {},
    };

    constructor() {
        super();

        /**
         * Info text displayed to the users.
         * @type {string}
         */
        this.info;
    }
}
```

---

## Tests

The [tests](./tests) directory contains an HTML page with several web components, each testing a different facet of the HTMLElementPlus class.

To run the tests, serve the entire [html-element-plus](../html-element-plus/) directory in a web server and browse to the _.../tests_ URL. On GitHub, you can also access the [test results here](https://dblancharddev.github.io/web-toolkit/html-element-plus/tests/) for the main branch.
