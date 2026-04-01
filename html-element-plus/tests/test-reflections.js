/** @file Test the reflection of attributes as properties. */

import TestHTMLElementPlus from './TestHTMLElementPlus.js';

class TestReflections extends TestHTMLElementPlus {
    static attributeConfigs = {
        alpha: {reflected: true},
        bravo: {reflected: true, readOnly: true},
        'charlie-delta': {reflected: true},
        present: {reflected: true, type: 'boolean'},
        unchanged: {reflected: true, type: 'boolean', readOnly: true},
        unset: {reflected: true},
        count: {reflected: true, type: 'number'},
        nan: {reflected: true, type: 'number'},
        unreflected: {},
        'unset-default': {reflected: true, default: 'UNSET DEFAULT'},
        'unset-number-default': {reflected: true, default: 9999, type: 'number'},
        'unset-boolean-default': {reflected: true, default: true, type: 'boolean'},
        'set-default': {reflected: true, default: 'DEFAULT'},
        'count-default': {reflected: true, default: '123', type: 'number'},
        nothing: {reflected: true},
        'set-null': {reflected: true},
    };

    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        this.#testSettableValue();
        this.#testReadOnlyValue();
        this.#testSnakeToPascal();
        this.#testSettableBoolean();
        this.#testReadOnlyBoolean();
        this.#testUnset();
        this.#testUnreflected();
        this.#testNumberCasting();
        this.#testNotANumber();
        this.#testUnsetDefault();
        this.#testUnsetNumberDefault();
        this.#testUnsetBooleanDefault();
        this.#testSetDefault();
        this.#testNumberDefault();
        this.#testNothing();
        this.#setAttributeToNull();
        this.#testFrozen();
        this.#testInnerFrozen();
    }

    #testSettableValue() {
        const label = 'Settable Value';
        if (this?.alpha !== 'A') {
            this.fail(label, 'Unreadable');
        } else {
            try {
                this.alpha = 'ALPHA';
                if (this.alpha !== 'ALPHA') {
                    this.fail(label, 'Get Returned Wrong Value After Set');
                } else if (this.getAttribute('alpha') !== 'ALPHA') {
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

    #testReadOnlyValue() {
        const label = 'Read-only Value';
        if (this?.bravo !== 'B') {
            this.fail(label, 'Unreadable');
        } else {
            try {
                this.bravo = 'BRAVO';
                if (this.bravo === 'BRAVO') this.fail(label, 'Is Not Read-Only');
                else this.fail(label, 'Did Not Throw Read-only Error');
            } catch (error) {
                if (error.name != 'TypeError') this.fail(label, 'Not TypeError');
                else if (this.getAttribute('bravo') !== 'B') this.fail(label, 'Attribute Changed');
                else this.pass(label);
            }
        }
    }

    #testSnakeToPascal() {
        const label = 'Snake-case to Camel-case';
        if (this?.charlieDelta !== 'CD') this.fail(label, 'Unreadable');
        else this.pass(label);
    }

    #testSettableBoolean() {
        const label = 'Settable Boolean';
        if (this?.present !== true) {
            this.fail(label, 'Unreadable');
        } else {
            try {
                this.present = false;
                if (this.present !== false) {
                    this.fail(label, 'Get Returned Wrong Value After Set');
                } else if (this.hasAttribute('present') !== false) {
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
        if (this?.unchanged !== true) {
            this.fail(label, 'Unreadable');
        } else {
            try {
                this.unchanged = false;
                if (this.unchanged === false) this.fail(label, 'Is Not Read-Only');
                else this.fail(label, 'Did Not Throw Read-only Error');
            } catch (error) {
                if (error.name != 'TypeError') this.fail(label, 'Not TypeError');
                else if (this.hasAttribute('unchanged') !== true) this.fail('Attribute Changed');
                else this.pass(label);
            }
        }
    }

    #testUnset() {
        const label = 'Unset in HTML';
        if (this?.unset !== null) this.fail(label, 'Unreadable');
        else this.pass(label);
    }

    #testUnreflected() {
        const label = 'Unreflected';
        // eslint-disable-next-line no-undefined -- no alternative
        if (this?.unreflected !== undefined) this.fail(label, 'Reflected When it Should Not');
        else this.pass(label);
    }

    #testNumberCasting() {
        const label = 'Number Casting';
        if (this?.count === 22) this.pass(label);
        else this.fail(label, 'Unexpected Value');
    }

    #testNotANumber() {
        const label = 'Not A Number Casting';
        if (Number.isNaN(this?.nan)) this.pass(label);
        else this.fail(label, 'Unexpected Value');
    }

    #testUnsetDefault() {
        const label = 'Unset Default';
        if (this.getAttribute('unset-default') !== null) {
            this.fail(label, 'Unset Default Attribute Was Set in HTML');
        } else if (this.unsetDefault !== 'UNSET DEFAULT') {
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

    #testNumberDefault() {
        const label = 'Number Casting of Default';
        if (this.countDefault !== 123) this.fail(label, 'Unexpected Value');
        else this.pass(label);
    }

    #testNothing() {
        const label = 'No Default Not Set';
        if (this.nothing !== null) this.fail(label, 'Not Null');
        else this.pass(label);
    }

    #setAttributeToNull() {
        const label = 'Null Removes Attribute';
        this.setNull = null;
        if (this.getAttribute('set-null') === null) this.pass(label);
        else this.fail(label, 'Attribute Not Removed When Nulled');
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
