/** @file Test the rendering of HTML and CSS that is provided as URLs to be fetched. */

import HTMLElementPlus from '../HTMLElementPlus.js';

class TestFetchedRender extends HTMLElementPlus {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    async connectedCallback() {
        await this.render();

        // DOM Available After Awaiting Render
        this.shadowRoot.querySelector('.awaited span').textContent = '✅';
    }

    static markup = new URL('test-fetched-render.html', import.meta.url);

    static styles = new URL('test-fetched-render.css', import.meta.url);
}

customElements.define('test-fetched-render', TestFetchedRender);
