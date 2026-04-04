# DOM Ready

Simple promised based way to await for the DOM content to be loaded.

Make use of the `DOMContentLoaded` event and the `document.readyState` to make sure the DOM content being loaded is always caught.

An example of when this may be needed is for dynamically rendered web components that adjust their sizing depending on the size of the content, which is only available after DOM Content Loaded.

## Usage

Simply import the module into your JavaScript code and await the `domReady` property.

```js
import DOMReady from "./DOMReady.js";

class MyClass {
    method() {
        await DOMReady;
        // Code requiring the content to be ready
    }
}
```
