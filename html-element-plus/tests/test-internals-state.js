/** @file Test the reflection of element internals - state as properties. */

import TestHTMLElementPlus from './TestHTMLElementPlus.js';

class TestInternalsState extends TestHTMLElementPlus {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        this.#testDefaultTrue();
        this.#testDefaultFalse();
        this.#testSetTrue();
        this.#testSetFalse();
    }

    static internalStates = {
        'default-true': true,
        'default-false': false,
        'set-true': false,
        'set-false': true,
    };

    #testDefaultTrue() {
        // Ensure state set via CSS
        const id = 'testDefaultTrue';
        const styleText = this.#createStyleText(id, 'default-true', true);
        this.#addTest(id, 'Default True', styleText);

        // Ensure reflection works
        const reflectLabel = 'Reflection of True Default';
        if (this.defaultTrue === true) this.pass(reflectLabel);
        else this.fail(reflectLabel, 'Value Was Not True');
    }

    #testDefaultFalse() {
        // Ensure state set via CSS
        const id = 'testDefaultFalse';
        const styleText = this.#createStyleText(id, 'default-false', false);
        this.#addTest(id, 'Default False', styleText);

        // Ensure reflection works
        const reflectLabel = 'Reflection of False Default';
        if (this.defaultFalse === false) this.pass(reflectLabel);
        else this.fail(reflectLabel, 'Value Was Not False');
    }

    #testSetTrue() {
        this.setTrue = true;

        // Ensure state set via CSS
        const id = 'testSetrue';
        const styleText = this.#createStyleText(id, 'set-true', true);
        this.#addTest(id, 'Set True', styleText);

        // Ensure reflection works
        const reflectLabel = 'Reflection of Set True';
        if (this.setTrue === true) this.pass(reflectLabel);
        else this.fail(reflectLabel, 'Value Was Not True');
    }

    #testSetFalse() {
        this.setFalse = false;

        // Ensure state set via CSS
        const id = 'testSetFalse';
        const styleText = this.#createStyleText(id, 'set-false', false);
        this.#addTest(id, 'Set False', styleText);

        // Ensure reflection works
        const reflectLabel = 'Reflection of Set False';
        if (this.setFalse === false) this.pass(reflectLabel);
        else this.fail(reflectLabel, 'Value Was Not False');
    }

    #addTest(id, label, styleText) {
        const style = document.createElement('style');
        style.textContent = styleText;
        this.shadowRoot.appendChild(style);

        const div = document.createElement('div');
        div.setAttribute('id', id);
        div.textContent = `Element Internal State – ${label}`;
        this.shadowRoot.appendChild(div);
    }

    #createStyleText(id, state, presence) {
        const absentPre = presence ? '❌' : '✅';
        const absentPost = presence ? 'Failed – CSS State not Applied' : 'Succeeded';
        const presentPre = presence ? '✅' : '❌';
        const presentPost = presence ? 'Succeeded' : 'Failed – CSS State Not Applied';

        const styleText = `
            #${id} {
                &:before {
                    content: "${absentPre} ";
                }
                &:after {
                    content: " ${absentPost}";
                }
            }

            :host(:state(${state})) {
                #${id} {
                    &:before {
                        content: "${presentPre} ";
                    }
                    &:after {
                        content: " ${presentPost}";
                    }
                }
            }
        `;

        return styleText;
    }
}

customElements.define('test-internals-state', TestInternalsState);
