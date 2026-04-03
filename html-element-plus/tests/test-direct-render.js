/** @file Test the rendering of HTML and CSS that is directly embedded in the HTMLElementPlus. */

import {HTMLElementPlus, html, css} from '../HTMLElementPlus.js';

class TestDirectRender extends HTMLElementPlus {
    connectedCallback() {
        this.attachShadow({mode: 'open'});
        this.render();
    }

    static htmlContent = html`
        <style>
            .cssStyle:before {
                content: '❌ ';
            }
        </style>
        <div>✅ HTML Content Rendered</div>
        <div class="cssStyle">CSS Content Applied</div>
    `;

    static cssContent = css`
        .cssStyle:before {
            content: '✅ ' !important;
        }
    `;
}

customElements.define('test-direct-render', TestDirectRender);
