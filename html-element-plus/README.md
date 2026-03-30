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

- **[Query Shadow DOM by Reference](#query-shadow-dom-by-reference)**: Quickly locate elements within your shadow DOM.
- **[Custom Event Dispatching Shortcut](#custom-event-dispatching-shortcut)**: Shortcut for dispatching events from the custom element.
- **[Attribute Configuration](#attribute-configuration)**: Add type casting, reflection, and defaults to attributes.
- **[On All Attributes Set & On Attribute Change](#on-all-attributes-set--on-attribute-change)**: Dedicated methods to detect loaded attributes and changes to attributes. These methods respect the [attribute configuration](#attribute-configuration) including defaults and type.
- **[Reflected Internals State](#reflectedInternalsState)**: Reflection of element internals state to properties for in CSS with :state() pseudo-class.
- **[Connected Callback Skipped on Move](#connected-callback-skipped-on-move)**: The _connectedCallback_ method will no longer be called when the custom element is simply moved.

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

### Attribute Configuration

Additional behaviour can be automatically added to [HTML element attributes](https://developer.mozilla.org/en-US/docs/Glossary/Attribute), including setting defaults and automatically [reflecting the attribute as a property](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Reflected_attributes).

This behaviour is set in the _attributeConfigs_ static property as an object, with the key of each entry being the name of the attribute (using snake-case) and the value of each entry being an object with the configuration. The following options are available in the configuration:

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| type | string | `'string'` | Defines the casting and behaviour of the attribute. See [Attribute Types](#attribute-types) below for details. |
| reflected | boolean | `false` | Indicates whether a [reflected property](#reflected-property) is created for this attribute. If set to `false`, defaults and typing will only be applied to [observed attributes](#observed-attributes). |
| readOnly | boolean | `false` | Whether the reflected property is read-only or is editable. Has no effect if _reflected_ is `false`. |
| default | string \| number \| boolean | `null` | When an attribute is not set in the HTML, the reflected attribute and observed attributes will see the default value instead of `null`. If setting a reflected attribute to null, the default will be used. |

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

#### Attribute Types

The _type_ value in the attribute configuration can be one of the following:

- **`'string'`**: The default. Attribute value will be kept as a string.
- **`'number'`**: The attribute (which is always a string) will be cast to a number before being reflected or observed. If the value is not a number, will return `NaN`. With reflections, the casting is applied in both the setter and the getter.
- **`'boolean'`**: The attribute behaves based on presence only, with a `true` value indicating the attribute is present. The string value set in the attribute is ignored.

The properties of reflected boolean attributes always return a boolean. Other properties of other reflected attributes return the value itself (after casting to a number if applicable) or when not set return the default or null.

#### Reflected Property

When _reflected_ is set to true, the attributes become available as a property within the class and can be read and changed using this property. See [Reflected attributes on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Reflected_attributes) for more details.

The default value, read-only setting, and type casting to number will be applied to the properties. <!-- FIXME: Add details once bugs fixed -->

> 🐍 **Snake-Case Names**  
> Attributes that use snake-case names which will get an equivalent property name using camel-case. For example, the attribute name `my-data` will become `this.myData` when reflected.

```js
class MyComponent extends HTMLElementPlus {
    static attributeConfigs = {
        count: {
            type: 'number',
            reflected: true,
        },
    };

    myMethod() {
        this.count += 10;
    }
}
```

#### Observed Attributes

Observed attributes set in the [_observedAttributes_ array](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#responding_to_attribute_changes) can also be manipulated by the attribute configuration, with defaults and type casting to number being applied before observed changes invoke the [On All Attributes Set](#on-all-attributes-set--on-attribute-change) and [On Attribute Change](#on-all-attributes-set--on-attribute-change) methods.

> 🚫 **Attribute Changed Callback Method**  
> The _attributeChangedCallback_ method is native to web components and its behaviour cannot be modified. Defaults and type casting do not apply to values passed to this method.

### On All Attributes Set & On Attribute Change

Instead of using the _attributeChangedCallback_ method which gets invoked on all observed attribute changes, HTMLElementPlus offers two methods:

- **_onAllAttributesSet_**: Invoked only once after all observed attributes that will be set at load time have been set. This includes observed attributes specified in the HTML element as well as attributes with defaults. Receives a single parameter which contains an object of attribute-name to value pairs.
- **_onAttributeChange_**: Invoked when an attribute changes value. Unlike _attributeChangedCallback_, this method isn't called at load time (use _onAllAttributesSet_ above instead). Receives the same parameters as _attributeChangedCallback_.

The major advantage of these two alternative methods is that the values they receive as parameters will respected the [attribute configuration](#attribute-configuration) where set; meaning the default will be used for unset attributes and values will be pre-cast to numbers where applicable. <!-- FIXME: Adjust once behaviour bugs fixed -->

> ⚠️ **Using _attributeChangedCallback_**  
> If you choose to still use _attributeChangedCallback_, remember to call `super.attributeChangedCallback(name, oldValue, newValue)` at the start of your method. Otherwise, the _onAllAttributesSet_ and _onAttributeChange_ methods will no longer be invoked.

### Reflected Internal States

The use if [element internals states](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_states_and_custom_state_pseudo-class_css_selectors) has been simplified through reflection of states, similar to how [attribute reflection works](#reflected-property).

Reflected states must be specified in the _internalStates_ static object, with each entry's key being the name of the state and the value being the initial state of the state. When the initial state is set to `true`, it will be automatically activated during the constructor.

```js
class MyComponent extends HTMLElementPlus {
    static internalStates = {
        hidden: true,
    };

    becomeVisible() {
        this.visible = false;
    }
```

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
