/** @file Test that attributeChangeCallback is modified to use processed attribute values, and that allAttributesChangedCallback works. */

import TestHTMLElementPlus from './TestHTMLElementPlus.js';

const compareDicts = (a, b) => {
    const setA = new Set(Object.entries(a).map(([k, v]) => `${k}␟${v}`));
    const setB = new Set(Object.entries(b).map(([k, v]) => `${k}␟${v}`));
    return setA.symmetricDifference(setB).size === 0;
};

class TestAttributeCallbacks extends TestHTMLElementPlus {
    static observedAttributes = [
        'string',
        'string-unset',
        'string-default-set',
        'string-default-unset',
        'string-to-null',
        'number',
        'number-default',
        'number-to-null',
        'number-nan',
        'boolean-unset',
        'boolean-set',
        'boolean-default',
    ];

    static attributeConfigs = {
        string: {},
        'string-default-set': {default: 'DEFAULT'},
        'string-default-unset': {default: 'DEFAULT'},
        number: {type: 'number'},
        'number-default': {type: 'number', default: 55},
        'number-to-null': {type: 'number'},
        'number-nan': {type: 'number'},
        'boolean-set': {type: 'boolean'},
        'boolean-unset': {type: 'boolean'},
        'boolean-default': {type: 'boolean', default: true},
    };

    allLabel = 'On All Attributes Set';
    stringLabel = 'On String Attribute Change';
    numberLabel = 'On Number Attribute Change';
    booleanLabel = 'On Boolean Attribute Change';

    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        this.allDiv = this.fail(this.allLabel, 'Did Not Run');

        for (const key of [
            'string',
            'stringUnset',
            'stringDefaultSet',
            'stringDefaultUnset',
            'stringToNull',
            'number',
            'numberDefault',
            'numberToNull',
            'numberNan',
            'booleanUnset',
            'booleanSet',
        ]) {
            const label = `On ${key} Attribute Change`;
            this[`${key}Label`] = label;
            this[`${key}Div`] = this.fail(label, 'Did Not Run');
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // Ensure that with overridden method still works
        super.attributeChangedCallback(name, oldValue, newValue);
    }

    onAllAttributesSet(attributes) {
        this.allDiv.remove();

        const expected = {
            string: 'STRING',
            'string-default-set': 'STRING-DEFAULT-SET',
            'string-default-unset': 'DEFAULT',
            'string-to-null': 'TO-BE-NULL',
            number: 12.5,
            'number-default': 55,
            'number-to-null': 74,
            'number-nan': NaN,
            'boolean-set': true,
            'boolean-unset': false,
            'boolean-default': false,
        };

        if (compareDicts(expected, attributes)) {
            this.pass(this.allLabel);
        } else {
            this.fail(this.allLabel, 'Attributes returned are not as expected');
            console.error(this.allLabel, 'Expected:', expected, 'Received:', attributes);
        }
    }

    connectedCallback() {
        setTimeout(() => {
            this.setAttribute('string', 'NEW-STRING');
            this.setAttribute('string-unset', 'NEW-STRING-UNSET');
            this.removeAttribute('string-default-set');
            this.setAttribute('string-default-unset', 'NEW-STRING-DEFAULT-UNSET');
            this.removeAttribute('string-to-null');
            this.setAttribute('number', 123.456);
            this.setAttribute('number-default', 12);
            this.removeAttribute('number-to-null');
            this.setAttribute('number-nan', 'xyz');
            this.setAttribute('boolean-unset', '');
            this.removeAttribute('boolean-set');
        }, 100);
    }

    onAttributeChange(name, oldValue, newValue) {
        switch (name) {
            case 'string':
                this.#validate('string', name, oldValue, 'STRING', newValue, 'NEW-STRING');
                break;
            case 'string-unset':
                this.#validate('stringUnset', name, oldValue, null, newValue, 'NEW-STRING-UNSET');
                break;
            case 'string-default-set':
                this.#validate('stringDefaultSet', name, oldValue, 'STRING-DEFAULT-SET', newValue, 'DEFAULT');
                break;
            case 'string-default-unset':
                this.#validate('stringDefaultUnset', name, oldValue, 'DEFAULT', newValue, 'NEW-STRING-DEFAULT-UNSET');
                break;
            case 'string-to-null':
                this.#validateRemoved('stringToNull', name, oldValue, 'TO-BE-NULL', newValue, null);
                break;
            case 'number':
                this.#validate('number', name, oldValue, 12.5, newValue, 123.456);
                break;
            case 'number-default':
                this.#validate('numberDefault', name, oldValue, 55, newValue, 12);
                break;
            case 'number-to-null':
                this.#validateRemoved('numberToNull', name, oldValue, 74, newValue, null);
                break;
            case 'number-nan':
                this.#validate('numberNan', name, Number.isNaN(oldValue), true, Number.isNaN(newValue), true);
                break;
            case 'boolean-unset':
                console.log(oldValue);
                this.#validate('booleanUnset', name, oldValue, false, newValue, true);
                break;
            case 'boolean-set':
                this.#validate('booleanSet', name, oldValue, true, newValue, false);
                break;
            default:
                this.fail('Single Attribute Change', 'Unexpected Name');
        }
    }

    #validate(key, name, oldValue, oldExpect, newValue, newExpect) {
        const label = this[`${key}Label`];

        if (oldValue != oldExpect) this.fail(label, 'Unexpected Old Value');
        else if (newValue !== newExpect) this.fail(label, 'Unexpected New Value');
        else this.pass(label);

        this[`${key}Div`].remove();
    }

    #validateRemoved(key, name, oldValue, oldExpect, newValue, newExpect) {
        const label = this[`${key}Label`];
        if (this.hasAttribute(name)) {
            this.fail(label, 'Attribute Not Removed');
        } else {
            this.#validate(key, name, oldValue, oldExpect, newValue, newExpect);
        }
    }
}

customElements.define('test-attribute-callbacks', TestAttributeCallbacks);
