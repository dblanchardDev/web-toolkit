/** @file Base class for testing which includes code to generate the pass/fail HTML elements. */

import HTMLElementPlus from '../HTMLElementPlus.js';

export default class TestHTMLElementPlus extends HTMLElementPlus {
    /**
     * Add a passed result to the HTML.
     * @param {string} label Label identifying the result type
     */
    pass(label) {
        this.#addResult(true, label);
    }

    /**
     * Add a failed result to the HTML.
     * @param {string} label Label identifying the result type
     * @param {string} [reason=null] Reason for failure
     */
    fail(label, reason = null) {
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
