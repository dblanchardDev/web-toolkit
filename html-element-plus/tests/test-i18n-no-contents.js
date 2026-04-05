/** @file Test access to the i18n dictionary even when rendering has not been initiated. */

import TestHTMLElementPlus from './TestHTMLElementPlus.js';

class TestI18nNoContents extends TestHTMLElementPlus {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    async connectedCallback() {
        await this.render();
        const div = document.createElement('div');
        div.textContent = this.i18n.pass ?? '❌ Dictionary Not Accessible';
        this.shadowRoot.appendChild(div);
    }

    static dictionaries = {
        default: {
            pass: '✅ Dictionary Accessed',
        },
    };
}

customElements.define('test-i18n-no-contents', TestI18nNoContents);
