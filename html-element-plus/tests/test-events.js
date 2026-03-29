/** @file Test that event dispatch shortcuts works as expected. */

import HTMLElementPlus from '../HTMLElementPlus.js';

class TestEventDispatcher extends HTMLElementPlus {
    connectedCallback() {
        if (this.hasAttribute('composed')) {
            this.emitComposedEvent('TestEvent', 'not composed');
        } else {
            this.emitEvent('TestEvent', 'composed');
        }
    }
}

customElements.define('test-event-dispatcher', TestEventDispatcher);

class TestEvents extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.#test('Event', false);
        this.#test('Composed Event', true);
    }

    /**
     * Run an emit test, adding the result to the HTML.
     * @param {string} label Display in test result
     * @param {boolean} composed Whether to use composed event.
     */
    #test(label, composed) {
        // Add result
        let result = document.createElement('div');
        result.textContent = `❌ No ${label} Emitted`;
        this.shadowRoot.appendChild(result);

        // Create test event element and listen
        let dispatcher = document.createElement('test-event-dispatcher');

        if (composed) {
            dispatcher.setAttribute('composed', '');
        }

        dispatcher.addEventListener('TestEvent', (event) => {
            if (composed && event.composed == false) {
                result.textContent = `❌ Composed Event Was Not Composed`;
            } else {
                result.textContent = `✅ ${label} Emitted`;
            }
        });
        this.shadowRoot.appendChild(dispatcher);
    }
}

customElements.define('test-events', TestEvents);
