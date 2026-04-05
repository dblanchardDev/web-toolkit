/** @file Test the use of the internationalization with fragments and dictionaries built-in. */

import {HTMLElementPlus, html, css} from '../HTMLElementPlus.js';

class TestI18nAllBuiltin extends HTMLElementPlus {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.lang = 'en';
        this.render();
    }

    dictionary = {
        default: {
            defaultOnly: '✅ From Default Dictionary',
            both: '❌ From Language Dictionary – Obtained from Default',
            checkMark: '✅',
        },
        en: {
            both: '✅ From Language Dictionary',
        },
    };

    get markup() {
        return html`
            <div>${this.i18n.defaultOnly}</div>
            <div>${this.i18n.both}</div>
            <div class="cssTest">CSS Content Internationalization</div>
        `;
    }

    get styles() {
        return css`
            .cssTest:before {
                content: '${this.i18n.checkMark} ';
            }
        `;
    }
}

customElements.define('test-i18n-all-builtin', TestI18nAllBuiltin);
