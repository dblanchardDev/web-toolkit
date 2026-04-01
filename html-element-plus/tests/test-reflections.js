/** @file Test the reflection of attributes as properties. */

import TestHTMLElementPlus from './TestHTMLElementPlus.js';

class TestReflections extends TestHTMLElementPlus {
    static attributeConfigs = {
        'snake-case': {reflected: true},
        string: {reflected: true},
        readonly: {reflected: true, readOnly: true},
        number: {reflected: true, type: 'number'},
        'readonly-number': {reflected: true, type: 'number', readOnly: true},
        nan: {reflected: true, type: 'number'},
        'to-nan': {reflected: true, type: 'number'},
        boolean: {reflected: true, type: 'boolean'},
        'readonly-boolean': {reflected: true, type: 'boolean', readOnly: true},
        unset: {reflected: true},
        'unset-default': {reflected: true, default: 'UNSET-DEFAULT'},
        'unset-number-default': {reflected: true, default: 9999, type: 'number'},
        'unset-boolean-default': {reflected: true, default: true, type: 'boolean'},
        'set-default': {reflected: true, default: 'DEFAULT'},
        unreflected: {},
        'set-null': {reflected: true},
        nothing: {reflected: true},
    };

    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        this.#testSnakeToPascal();
        this.#testSettableString();
        this.#testReadOnlyString();
        this.#testSettableNumber();
        this.#testReadOnlyNumber();
        this.#testReadNotANumber();
        this.#testSetNotANumber();
        this.#testSettableBoolean();
        this.#testReadOnlyBoolean();
        this.#testUnset();
        this.#testUnsetDefault();
        this.#testUnsetNumberDefault();
        this.#testUnsetBooleanDefault();
        this.#testSetDefault();
        this.#testUnreflected();
        this.#setAttributeToNull();
        this.#testNothing();
        this.#testFrozen();
        this.#testInnerFrozen();
    }

    #testSnakeToPascal() {
        const label = 'Snake-case to Camel-case';
        if (this?.snakeCase !== 'SNAKE-CASE') this.fail(label, 'Unreadable');
        else this.pass(label);
    }

    #testSettableString() {
        const label = 'Settable String';
        if (this?.string !== 'STRING') {
            this.fail(label, 'Unreadable');
        } else {
            try {
                this.string = 'NEW-STRING';
                if (this.string !== 'NEW-STRING') {
                    this.fail(label, 'Get Returned Wrong Value After Set');
                } else if (this.getAttribute('string') !== 'NEW-STRING') {
                    this.fail(label, 'Set Value Not Reflected to Attribute');
                } else {
                    this.pass(label);
                }
            } catch (error) {
                this.fail(label, `Error Thrown When Set`);
                console.error(label, error);
            }
        }
    }

    #testReadOnlyString() {
        const label = 'Read-only String';
        if (this?.readonly !== 'READONLY') {
            this.fail(label, 'Unreadable');
        } else {
            try {
                this.readonly = 'NEW-READONLY';
                if (this.readonly === 'NEW-READONLY') this.fail(label, 'Is Not Read-Only');
                else this.fail(label, 'Did Not Throw Read-only Error');
            } catch (error) {
                if (error.name != 'TypeError') this.fail(label, 'Not TypeError');
                else if (this.getAttribute('readonly') !== 'READONLY') this.fail(label, 'Attribute Changed');
                else this.pass(label);
            }
        }
    }

    #testSettableNumber() {
        const label = 'Settable Number';
        if (this?.number === 22.5) this.pass(label);
        else this.fail(label, 'Unexpected Value');
    }

    #testReadOnlyNumber() {
        const label = 'Read-only Number';
        if (this?.readonlyNumber !== 1234) {
            this.fail(label, 'Unreadable');
        } else {
            try {
                this.readonlyNumber = 9999;
                if (this.readonlyNumber === 9999) this.fail(label, 'Is Not Read-Only');
                else this.fail(label, 'Did Not Throw Read-only Error');
            } catch (error) {
                if (error.name != 'TypeError') this.fail(label, 'Not TypeError');
                else if (this.getAttribute('readonly-number') !== '1234') this.fail(label, 'Attribute Changed');
                else this.pass(label);
            }
        }
    }

    #testReadNotANumber() {
        const label = 'Read Not A Number';
        if (Number.isNaN(this?.nan)) this.pass(label);
        else this.fail(label, 'Unexpected Value');
    }

    #testSetNotANumber() {
        const label = 'Set Not A Number';
        this.toNan = 'NOT';
        if (this.getAttribute('to-nan') === 'NaN') this.pass(label);
        else this.fail(label, 'Setter Not Converting to NaN');
    }

    #testSettableBoolean() {
        const label = 'Settable Boolean';
        if (this?.boolean !== true) {
            this.fail(label, 'Unreadable');
        } else {
            try {
                this.boolean = false;
                if (this.boolean !== false) {
                    this.fail(label, 'Get Returned Wrong Value After Set');
                } else if (this.hasAttribute('boolean') !== false) {
                    this.fail(label, 'Set Value Not Reflected to Attribute');
                } else {
                    this.pass(label);
                }
            } catch (error) {
                this.fail(label, `Error Thrown When Set`);
                console.error(label, error);
            }
        }
    }

    #testReadOnlyBoolean() {
        const label = 'Read-only Boolean';
        if (this?.readonlyBoolean !== true) {
            this.fail(label, 'Unreadable');
        } else {
            try {
                this.readonlyBoolean = false;
                if (this.readonlyBoolean === false) this.fail(label, 'Is Not Read-Only');
                else this.fail(label, 'Did Not Throw Read-only Error');
            } catch (error) {
                if (error.name != 'TypeError') this.fail(label, 'Not TypeError');
                else if (this.hasAttribute('readonly-boolean') !== true) this.fail(label, 'Attribute Changed');
                else this.pass(label);
            }
        }
    }

    #testUnset() {
        const label = 'Unset in HTML';
        if (this?.unset !== null) this.fail(label, 'Unreadable');
        else this.pass(label);
    }

    #testUnsetDefault() {
        const label = 'Unset Default';
        if (this.getAttribute('unset-default') !== null) {
            this.fail(label, 'Unset Default Attribute Was Set in HTML');
        } else if (this.unsetDefault !== 'UNSET-DEFAULT') {
            this.fail(label, 'Default Not Returned');
        } else {
            this.pass(label);
        }
    }

    #testUnsetNumberDefault() {
        const label = 'Unset Number Default';
        if (this.getAttribute('unset-number-default') !== null) {
            this.fail(label, 'Unset Default Attribute Was Set in HTML');
        } else if (this.unsetNumberDefault === '9999') {
            this.fail(label, 'Default Number Not Parsed');
        } else if (this.unsetNumberDefault !== 9999) {
            this.fail(label, 'Default Not Returned or Unexpected Value');
        } else {
            this.pass(label);
        }
    }

    #testUnsetBooleanDefault() {
        const label = 'Unset Boolean Default';
        if (this.hasAttribute('unset-boolean-default') !== false) {
            this.fail(label, 'Attribute Was Present');
        } else if (this.unsetBooleanDefault !== false) {
            this.fail(label, 'Unexpected Value');
        } else {
            this.pass(label);
        }
    }

    #testSetDefault() {
        const label = 'Set Default';
        if (this.setDefault === 'DEFAULT') this.fail(label, 'Default Used Even When Attribute Set');
        else if (this.setDefault !== 'SET') this.fail(label, 'Wrong Value Returned');
        else this.pass(label);
    }

    #testUnreflected() {
        const label = 'Unreflected';
        // eslint-disable-next-line no-undefined -- no alternative
        if (this?.unreflected !== undefined) this.fail(label, 'Reflected When it Should Not');
        else this.pass(label);
    }

    #setAttributeToNull() {
        const label = 'Null Removes Attribute';
        this.setNull = null;
        if (this.getAttribute('set-null') === null) this.pass(label);
        else this.fail(label, 'Attribute Not Removed When Nulled');
    }

    #testNothing() {
        const label = 'No Default Not Set';
        if (this.nothing !== null) this.fail(label, 'Not Null');
        else this.pass(label);
    }

    #testFrozen() {
        const label = 'Attribute Configs Frozen';

        try {
            this.constructor.attributeConfigs.WRONG = {};
            this.fail(label, 'Object Extendable');
        } catch (error) {
            if (error.name !== 'TypeError') this.fail(label, 'Unexpected Error Type');

            try {
                this.constructor.attributeConfigs.alpha = {};
                this.fail(label, 'Object Writable');
            } catch (innerError) {
                if (innerError.name !== 'TypeError') this.fail(label, 'Unexpected Error Type');
                else this.pass(label);
            }
        }
    }

    #testInnerFrozen() {
        const label = 'Attribute Configs Inner Config Frozen';

        try {
            this.constructor.attributeConfigs.alpha.WRONG = false;
            this.fail(label, 'Object Extendable');
        } catch (error) {
            if (error.name !== 'TypeError') this.fail(label, 'Unexpected Error Type');

            try {
                this.constructor.attributeConfigs.alpha.reflected = null;
                this.fail(label, 'Object Writable');
            } catch (innerError) {
                if (innerError.name !== 'TypeError') this.fail(label, 'Unexpected Error Type');
                else this.pass(label);
            }
        }
    }
}

customElements.define('test-reflections', TestReflections);
