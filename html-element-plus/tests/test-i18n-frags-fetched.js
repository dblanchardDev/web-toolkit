/** @file Test the use of the internationalization with fragments fetched and dictionaries built-in. */

import HTMLElementPlus from '../HTMLElementPlus.js';

class TestI18nFragsFetched extends HTMLElementPlus {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.lang = 'en';
        this.render();
    }

    dictionaries = {
        default: {
            defaultOnly: '✅ From Default Dictionary',
            both: '❌ From Language Dictionary – Obtained from Default',
            checkMark: '✅',
        },
        en: {
            both: '✅ From Language Dictionary',
        },
    };

    markup = new URL('test-i18n.html', import.meta.url);

    styles = new URL('test-i18n.css', import.meta.url);
}

customElements.define('test-i18n-frags-fetched', TestI18nFragsFetched);
