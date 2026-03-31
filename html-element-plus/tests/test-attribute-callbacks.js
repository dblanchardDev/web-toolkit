/** @file Test that attributeChangeCallback is modified to use processed attribute values, and that allAttributesChangedCallback works. */

import TestHTMLElementPlus from './TestHTMLElementPlus.js';

const compareDicts = (a, b) => {
    const keys = Object.keys(a);
    return keys.length === Object.keys(b).length && keys.every((k) => Object.hasOwn(b, k) && a[k] === b[k]);
};

class TestAttributeCallbacks extends TestHTMLElementPlus {
    static observedAttributes = ['no-default', 'default', 'processed', 'unset'];

    static attributeConfigs = {
        default: {default: 'DEFAULT'},
        processed: {type: 'number'},
    };

    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        this.allDiv = this.fail('On All Attributes Set', 'Not Run');
        this.oneDiv = this.fail('On Attribute Change', 'Not Run');
    }

    connectedCallback() {
        setTimeout(() => {
            this.setAttribute('processed', '20');
        }, 100);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // Ensure that with overridden method still works
        super.attributeChangedCallback(name, oldValue, newValue);
    }

    onAllAttributesSet(attributes) {
        this.allDiv.remove();

        const label = 'On All Attributes Set';
        const expected = {
            'no-default': 'NO-DEFAULT',
            default: 'DEFAULT',
            processed: 0,
        };

        if (compareDicts(expected, attributes)) {
            this.pass(label);
        } else {
            this.fail(label, 'Attributes returned are not as expected');
            console.error(label, 'Expected:', expected, 'Received:', attributes);
        }
    }

    onAttributeChange(name, oldValue, newValue) {
        this.oneDiv.remove();

        const label = 'On Attribute Change';

        if (name !== 'processed') this.fail(label, 'Unexpected Name');
        else if (oldValue !== 0) this.fail(label, 'Unexpected Old Value');
        else if (newValue !== 20) this.fail(label, 'Unexpected New Value');
        else this.pass(label);
    }
}

customElements.define('test-attribute-callbacks', TestAttributeCallbacks);
