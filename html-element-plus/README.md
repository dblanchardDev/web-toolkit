# HTML Element Plus

HTML Element wrapper which adds utility methods to simplify development of native web components. Reduces the need for heavier frameworks and building code when developing simpler websites.

---

## Original HTMLElementPlus Project

The [_HTMLElementPlus_ project by Ada Rose Cannon](https://github.com/AdaRoseCannon/html-element-plus) is the original source and inspiration for this tool. It has since been heavily modified by myself (David Blanchard), but retains some of the historical structure.

---

## Usage

Include the HTMLElementPlus.js file in your project. Then extend `HTMLElementPlus` instead of `HTMLElement` when creating a web component.

```js
import HTMLElementPlus from "./HTMLElementPlus.js";

class MyComponent extends HTMLElementPlus {

}

customElements.define('my-component', MyComponent);
```

---

## Features

The following features have been added by HTMLElementPlus, in addition to those already provided by [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) and [web component custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#responding_to_attribute_changes).

- **[Attribute Reflection](#attribute-reflection)**: Automatically reflect a element attribute as a class property.
- **[Attribute Defaults & Parsing](#attribute-defaults--parsing)**: Set defaults for unset attributes and pre-process their values.
- **[On All Attributes Set & On Attribute Change](#on-all-attributes-set--on-attribute-change)**: Dedicated methods to detect loaded attributes and changes to attributes. These take into account defaults and parsing.
- **[Query Shadow DOM by Reference](#query-shadow-dom-by-reference)**: Quickly locate elements within your shadow DOM.
- **[Custom Event Dispatching Shortcut](#custom-event-dispatching-shortcut)**: Shortcut for dispatching events from the custom element.
- **[Connected Callback Skipped on Move](#connected-callback-skipped-on-move)**: The _connectedCallback_ method will no longer be called when the custom element is simply moved.

### Attribute Reflection

Attributes can automatically be reflected as properties, allowing getting and setting an HTML element's attributes through a property in the custom element class.

```html
<my-component info='hello'></my-component>
```

```js
class MyComponent extends HTMLElementPlus {
    static reflectedAttributes = {
        info: {},
    };

    method() {
        this.info += 'world!';
        // Will result in the HTML attribute being set to 'hello world!'
    }
}
```

#### Reflect Attributes Object

Attributes that are to be reflected must be defined in the _reflectedAttributes_ static property. Each entry in this object consists of key-value pair where the key is the attribute name as would be set in the HTML tag of the custom element, and the value is a configuration object. The configuration object can contain the following entries:

| Config Key | Type    | Default | Description |
|------------|---------|---------|-------------|
| boolean    | boolean | `false` | A boolean reflected attribute will only detect the presence of the attribute (or lack thereof), with the property returning a boolean. |
| readOnly   | boolean | `false` | Whether the attribute should be settable through its reflected property. |
| state      | boolean | `false` | Whether to set an [element internals state](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_states_and_custom_state_pseudo-class_css_selectors) instead of an HTML element attribute. The _boolean_ and _readOnly_ values will be ignored if set along with `state: true`. |

```js
class MyComponent extends HTMLElementPlus {
    static reflectedAttributes = {
        info: {
            boolean: true,
            readOnly: true,
        },
    };
}
```

The properties of reflect boolean or state attributes always return a boolean, whereas reflected value attributes return the value or null if not set.

> 🐍 **Snake-Case Names**  
> Attributes that use snake-case names which will get an equivalent property name using camel-case. For example, the attribute name `my-data` will become `this.myData` when reflected.

### Attribute Defaults & Parsing

[Reflected attributes](#attribute-reflection) can be pre-processed by:

- setting defaults which will be returned if the attribute is not set,
- parsing the string value before it is returned, which is useful to consistently apply the same processing every time it is accessed (e.g. to cast the string attribute to another type).

```js
class MyComponent extends HTMLElementPlus {
    static reflectedAttributes = {
        count: {},
    };

    static defaultAttributes = {
        count: '0', // always a string, just like attributes themselves
    };

    static attributesParser(attrName, value) {
        if (value === null) return value;

        switch(attrName) {
            case 'count':
                return parseInt(value, 10);
            default:
                return value;
        }
    }
}
```

The values in _defaultAttributes_ should always be strings as attributes are always strings. If a reflected attribute is not set and has no default, `null` will continue to be returned.

The _attributesParser_ method must always return a value, regardless of whether it gets modified.

> ⚠️ **Avoid Heavy Work**  
> The _attributesParser_ method should be lightweight as it gets called each time an attribute changes.

### On All Attributes Set & On Attribute Change

Instead of using the _attributeChangedCallback_ method which gets invoked on all observed attribute changes, HTMLElementPlus offers two methods:

- **_onAllAttributesSet_**: Invoked only once after all observed attributes that will be set at load time have been set. This includes observed attributes specified in the HTML element as well as attributes with defaults. Receives a single parameter which contains an object of attribute-name to value pairs.
- **_onAttributeChange_**: Invoked when an attribute changes value. Unlike _attributeChangedCallback_, this method isn't called at load time (use _onAllAttributesSet_ above instead). Receives the same parameters as _attributeChangedCallback_.

The major advantage of these two alternative methods is that the values they receive as parameters will have been processed by [attribute defaults and parsing](#attribute-defaults--parsing).

> ⚠️ **Using _attributeChangedCallback_**  
> If you choose to still use _attributeChangedCallback_, remember to call `super.attributeChangedCallback(name, oldValue, newValue)` at the start of your method. Otherwise, the _onAllAttributesSet_ and _onAttributeChange_ methods will no longer be invoked.

### Query Shadow DOM by Reference

Elements in the shadow DOM can be quickly accessed using a `ref` attribute as follows:

```html
<span ref="foobar"></span>
```

```js
this.refs.foobar.textContent = "Hello World!";
```

The reference element is returned dynamically and will reflect any changes made in the shadow DOM.

> ⚠️ **Duplicate Ref Values**  
> If the custom element has multiple ref attributes with the same value, only the first one will be located.

### Custom Event Dispatching Shortcut

A shortcut to dispatch custom events is made available through the `emitEvent` and `emitComposedEvent` methods. Both methods take the same parameters, but the `emitComposedEvent` method will dispatch a composed event which triggers listeners outside of a shadow root.

| Parameter | Type    | Default | Description |
|-----------|---------|---------|-------------|
| type      | string  |         | Name of the custom event. |
| detail    | any     | null    | Event-dependent value associated with the event. Available to the handler using the CustomEvent.detail property. |
| bubbles   | boolean | true    | Whether the event bubbles up to its ancestors. |

### Connected Callback Skipped on Move

When the custom element is moved using `Element.moveBefore()`, the _connectedCallback_ method will no longer be invoked, instead invoking the _connectedMoveCallback_ method. This most likely matches the behaviour desired by most web component authors; see [MDN's Lifecycle callbacks and state-preserving moves](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#lifecycle_callbacks_and_state-preserving_moves) for more details.

To return to the original behaviour, simply delete the empty _connectedMoveCallback_ method from the HTMLElementPlus class which was implemented as part of the JSDoc type hints for [custom element life cycle callbacks](#custom-element-life-cycle-callbacks).

---

## JSDoc Type Hints

The HTMLElementPlus class is fully typed and documented using JSDoc. To bring the types and documentation over into your code in Visual Studio Code:

- Make sure you have a [jsconfig.json](https://code.visualstudio.com/docs/languages/jsconfig) file setup with _module_ and _target_ set to an ES version, and _checkJS_ set to true.
- When overriding an method from HTML Element Plus, add a _@type_ JSDoc comment to the override as shown below:

    ```js
    class MyComponent extends HTMLElementPlus {
        /** @type {HTMLElementPlus['attributeDefaults']} */
        static attributeDefaults() {
            return {"foo": "bar"}
        }
    }
    ```

### Custom Element Life Cycle Callbacks

The life cycle callback methods (e.g. connectedCallback, attributeChangedCallback) are defined as empty methods in the HTMLElementPlus class to provide auto-complete capabilities as well as typing for the _attributeChangedCallback_ method.

### Reflected Property Type Hints

To add type hints for [reflected attributed](#Attribute Reflection), define their type in the constructor as shown below. You may also defined them as `@property` in the class's JSDoc, but VS Code does not pickup on those.

```js
class MyComponent extends HTMLElementPlus {
    static reflectedAttributes = {
        info: {},
    };

    constructor() {
        super();

        /**
         * Description goes here
         * @type {string}
         */
        this.info;
    }
}
```

---

## Tests

The [tests](./tests) directory contains an HTML page with several web components, each testing a different facet of the HTMLElementPlus class.

To run the tests, serve the entire _html-element-plus_ directory in a web server and browse to the _.../tests_. On GitHub, you can also access the [test results here](https://dblancharddev.github.io/web-toolkit/html-element-plus/tests/).
