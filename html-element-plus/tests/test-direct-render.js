/** @file Test the rendering of HTML and CSS that is directly embedded in the HTMLElementPlus. */

import {HTMLElementPlus, html, css} from '../HTMLElementPlus.js';

class TestDirectRender extends HTMLElementPlus {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.render();
    }

    static markup = html`
        <style>
            .cssStyle:before {
                content: '❌ ';
            }
        </style>
        <div>✅ HTML Content Rendered</div>
        <div class="cssStyle">CSS Content Applied</div>
    `;

    static styles = css`
        .cssStyle:before {
            content: '✅ ' !important;
        }
    `;
}

customElements.define('test-direct-render', TestDirectRender);
