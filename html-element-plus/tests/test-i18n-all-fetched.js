/** @file Test the use of the internationalization with fragments and dictionaries fetched. */

import HTMLElementPlus from '../HTMLElementPlus.js';

class TestI18nAllFetched extends HTMLElementPlus {
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

    markup = new URL('test-i18n.html', import.meta.url);

    styles = new URL('test-i18n.css', import.meta.url);
}

customElements.define('test-i18n-all-fetched', TestI18nAllFetched);
