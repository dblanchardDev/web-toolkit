// Test that this.ref.myKey returns the HTML Elements in question.

import HTMLElementPlus from '../HTMLElementPlus.js';

class TestReferences extends HTMLElementPlus {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        // Reference by dot notation
        let constructDiv = document.createElement('div');
        constructDiv.setAttribute('ref', 'constructDiv');
        constructDiv.textContent = '❌ Reference Not Located from Constructor';
        this.shadowRoot.appendChild(constructDiv);
        this.refs.constructDiv.textContent = '✅ Reference Located from Constructor';

        // Reference by dot notation
        let dotDiv = document.createElement('div');
        dotDiv.setAttribute('ref', 'dotDiv');
        dotDiv.textContent = '❌ Reference Not Located from Dot Notation';
        this.shadowRoot.appendChild(dotDiv);

        // Reference by brackets
        let bracketDiv = document.createElement('div');
        bracketDiv.setAttribute('ref', 'bracketDiv');
        bracketDiv.textContent = '❌ Reference Not Located from Brackets';
        this.shadowRoot.appendChild(bracketDiv);
    }

    connectedCallback() {
        this.refs.dotDiv.textContent = '✅ Reference Located from Dot Notation';
        // eslint-disable-next-line dot-notation
        this.refs['bracketDiv'].textContent = '✅ Reference Located from Brackets';
    }
}

customElements.define('test-references', TestReferences);
