/** @file Test the use of the internationalization with fragments built-in and dictionaries fetched. */

import {HTMLElementPlus, html, css} from '../HTMLElementPlus.js';

class TestI18nDictsFetched extends HTMLElementPlus {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.lang = 'en';
        this.render();
    }

    dictionaries = {
        default: new URL('test-i18n-default.json', import.meta.url),
        en: new URL('test-i18n-en.json', import.meta.url),
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

customElements.define('test-i18n-dicts-fetched', TestI18nDictsFetched);
