/** @file Test that attributeChangeCallback is modified to use processed attribute values, and that allAttributesChangedCallback works. */

import TestHTMLElementPlus from './TestHTMLElementPlus.js';

const compareDicts = (a, b) => {
    const keys = Object.keys(a);
    return keys.length === Object.keys(b).length && keys.every((k) => Object.hasOwn(b, k) && a[k] === b[k]);
};

class TestAttributeCallbacks extends TestHTMLElementPlus {
    static observedAttributes = ['no-default', 'default', 'number', 'boolean', 'unset'];

    static attributeConfigs = {
        default: {default: 'DEFAULT'},
        number: {type: 'number'},
        boolean: {type: 'boolean'},
    };

    allLabel = 'On All Attributes Set';
    stringLabel = 'On String Attribute Change';
    numberLabel = 'On Number Attribute Change';
    booleanLabel = 'On Boolean Attribute Change';

    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        this.allDiv = this.fail(this.allLabel, 'Did Not Run');
        this.stringDiv = this.fail(this.stringLabel, 'Did Not Run');
        this.numberDiv = this.fail(this.numberLabel, 'Did Not Run');
        this.booleanDiv = this.fail(this.booleanLabel, 'Did Not Run');
    }

    connectedCallback() {
        setTimeout(() => {
            this.setAttribute('default', 'NEW');
            this.setAttribute('number', '20');
            this.setAttribute('boolean', '');
        }, 100);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // Ensure that with overridden method still works
        super.attributeChangedCallback(name, oldValue, newValue);
    }

    onAllAttributesSet(attributes) {
        this.allDiv.remove();

        const expected = {
            'no-default': 'NO-DEFAULT',
            default: 'DEFAULT',
            number: 0,
            presence: false,
        };

        if (compareDicts(expected, attributes)) {
            this.pass(this.allLabel);
        } else {
            this.fail(this.allLabel, 'Attributes returned are not as expected');
            console.error(this.allLabel, 'Expected:', expected, 'Received:', attributes);
        }
    }

    onAttributeChange(name, oldValue, newValue) {
        let label;

        switch (name) {
            case 'default':
                label = this.stringLabel;
                this.stringDiv.remove();
                if (oldValue != 'DEFAULT') this.fail(label, 'Unexpected Old Value');
                else if (newValue !== 'NEW') this.fail(label, 'Unexpected New Value');
                else this.pass(label);
                break;
            case 'number':
                label = this.numberLabel;
                this.numberDiv.remove();
                if (oldValue !== 0) this.fail(label, 'Unexpected Old Value');
                else if (newValue !== 20) this.fail(label, 'Unexpected New Value');
                else this.pass(label);
                break;
            case 'boolean':
                label = this.booleanLabel;
                this.booleanDiv.remove();
                if (oldValue !== false) this.fail(label, 'Unexpected Old Value');
                else if (newValue !== true) this.fail(label, 'Unexpected New Value');
                else this.pass(label);
                break;
            default:
                this.fail('Single Attribute Change', 'Unexpected Name');
        }
    }
}

customElements.define('test-attribute-callbacks', TestAttributeCallbacks);
