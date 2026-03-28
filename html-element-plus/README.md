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

customElements.define('my-component', MYComponent);
```

## Features

The following features have been added by HTMLElementPlus, in addition to those already provided by [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) and [web component custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#responding_to_attribute_changes).
