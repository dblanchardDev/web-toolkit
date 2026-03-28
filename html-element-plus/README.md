# HTML Element Plus

HTML Element wrapper which adds utility methods to simplify development of native web components. Reduces the need for heavier frameworks and building code when developing simpler websites.

## Original HTMLElementPlus Project

The [_HTMLElementPlus_ project by Ada Rose Cannon](https://github.com/AdaRoseCannon/html-element-plus) is the original source and inspiration for this tool. It has since been heavily modified by myself (David Blanchard), but retains some of the historical structure.

## Usage

Include the HTMLElementPlus.js file in your project. Then extend `HTMLElementPlus` instead of `HTMLElement` when creating a web component.

```js
import HTMLElementPlus from "./HTMLElementPlus.js";

class MyComponent extends HTMLElementPlus {

}

customElements.define('my-component', MyComponent);
```

## Features

The following features have been added by HTMLElementPlus, in addition to those already provided by [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) and [web component custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#responding_to_attribute_changes).

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

### Connected Callback Skipped on Move

When the custom element is moved using `Element.moveBefore()`, the _connectedCallback_ method will no longer be invoked, instead invoking the _connectedMoveCallback_ method. This most likely matches the behaviour desired by most web component authors; see [MDN's Lifecycle callbacks and state-preserving moves](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#lifecycle_callbacks_and_state-preserving_moves) for more details.

To return to the original behaviour, simply delete the empty _connectedMoveCallback_ method from the HTMLElementPlus class which was implemented as part of the JSDoc type hints for [custom element life cycle callbacks](#custom-element-life-cycle-callbacks).

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
