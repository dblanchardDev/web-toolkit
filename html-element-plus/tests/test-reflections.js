/** @file Test the reflection of attributes as properties. */

import HTMLElementPlus from '../HTMLElementPlus.js';

class TestReflections extends HTMLElementPlus {
    static reflectedAttributes = {
        alpha: {},
        bravo: {readOnly: true},
        'charlie-delta': {},
        present: {boolean: true},
        unchanged: {boolean: true, readOnly: true},
        unset: {},
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
    }

    #testSettableValue() {
        const label = 'Settable Value';
        if (this?.alpha !== 'A') {
            this.#fail(label, 'Unreadable');
        } else {
            try {
                this.alpha = 'ALPHA';
                if (this.alpha !== 'ALPHA') {
                    this.#fail(label, 'Get Returned Wrong Value After Set');
                } else if (this.getAttribute('alpha') !== 'ALPHA') {
                    this.#fail(label, 'Set Value Not Reflected to Attribute');
                } else {
                    this.#pass(label);
                }
            } catch (error) {
                this.#fail(label, `Error Thrown When Set`);
                console.error(label, error);
            }
        }
    }

    #testReadOnlyValue() {
        const label = 'Read-only Value';
        if (this?.bravo !== 'B') {
            this.#fail(label, 'Unreadable');
        } else {
            try {
                this.bravo = 'BRAVO';
                if (this.bravo === 'BRAVO') this.#fail(label, 'Is Not Read-Only');
                else this.#fail(label, 'Did Not Throw Read-only Error');
            } catch (error) {
                if (error.name != 'TypeError') this.#fail(label, 'Not TypeError');
                else if (this.getAttribute('bravo') !== 'B') this.#fail(label, 'Attribute Changed');
                else this.#pass(label);
            }
        }
    }

    #testSnakeToPascal() {
        const label = 'Snake-case to Camel-case';
        if (this?.charlieDelta !== 'CD') this.#fail(label, 'Unreadable');
        else this.#pass(label);
    }

    #testSettableBoolean() {
        const label = 'Settable Boolean';
        if (this?.present !== true) {
            this.#fail(label, 'Unreadable');
        } else {
            try {
                this.present = false;
                if (this.present !== false) {
                    this.#fail(label, 'Get Returned Wrong Value After Set');
                } else if (this.hasAttribute('present') !== false) {
                    this.#fail(label, 'Set Value Not Reflected to Attribute');
                } else {
                    this.#pass(label);
                }
            } catch (error) {
                this.#fail(label, `Error Thrown When Set`);
                console.error(label, error);
            }
        }
    }

    #testReadOnlyBoolean() {
        const label = 'Read-only Boolean';
        if (this?.unchanged !== true) {
            this.#fail(label, 'Unreadable');
        } else {
            try {
                this.unchanged = false;
                if (this.unchanged === false) this.#fail(label, 'Is Not Read-Only');
                else this.#fail(label, 'Did Not Throw Read-only Error');
            } catch (error) {
                if (error.name != 'TypeError') this.#fail(label, 'Not TypeError');
                else if (this.hasAttribute('unchanged') !== true) this.#fail('Attribute Changed');
                else this.#pass(label);
            }
        }
    }

    #testUnset() {
        const label = 'Unset in HTML';
        if (this?.unset !== null) this.#fail(label, 'Unreadable');
        else this.#pass(label);
    }

    #testUnreflected() {
        const label = 'Unreflected';
        // eslint-disable-next-line no-undefined -- no alternative
        if (this?.unreflected !== undefined) this.#fail(label, 'Reflected When it Should Not');
        else this.#pass(label);
    }

    /**
     * Add a passed result to the HTML.
     * @param {string} label Label identifying the result type
     */
    #pass(label) {
        this.#addResult(true, label);
    }

    /**
     * Add a failed result to the HTML.
     * @param {string} label Label identifying the result type
     * @param {string} [reason=null] Reason for failure
     */
    #fail(label, reason = null) {
        this.#addResult(false, label, reason);
    }

    /**
     * Add a result to the HTML.
     * @param {boolean} success Whether the test was successful
     * @param {string} label Label identifying the result type
     * @param {?string} [reason=null] Reason for failure
     */
    #addResult(success, label, reason = null) {
        const div = document.createElement('div');
        const icon = success ? '✅' : '❌';
        const result = success ? 'Succeeded' : 'Failed';
        div.textContent = `${icon} Reflection of ${label} ${result}`;

        if (reason) div.textContent += ` – ${reason}`;

        this.shadowRoot.appendChild(div);
    }
}

customElements.define('test-reflections', TestReflections);
