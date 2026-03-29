/** @file Test that this.ref.myKey returns the HTML Elements in question. */

import HTMLElementPlus from '../HTMLElementPlus.js';

class TestReferences extends HTMLElementPlus {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        ['Constructor', 'Dot Notation', 'Bracket Notation'].forEach((value) => {
            let div = document.createElement('div');
            div.setAttribute('ref', value.replaceAll(' ', ''));
            div.textContent = `❌ Reference Not Located from ${value}`;
            this.shadowRoot.appendChild(div);
        });

        this.refs.Constructor.textContent = '✅ Reference Located from Constructor';
    }

    connectedCallback() {
        this.refs.DotNotation.textContent = '✅ Reference Located from Dot Notation';
        // eslint-disable-next-line dot-notation
        this.refs['BracketNotation'].textContent = '✅ Reference Located from Bracket Notation';
    }
}

customElements.define('test-references', TestReferences);
