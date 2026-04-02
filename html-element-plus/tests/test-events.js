/** @file Test that event dispatch shortcuts works as expected. */

import HTMLElementPlus from '../HTMLElementPlus.js';

class TestEventDispatcher extends HTMLElementPlus {
    connectedCallback() {
        let args = ['TestEvent', this.getAttribute('detail')];

        let bubbles = this.getAttribute('bubbles');
        if (bubbles !== null) args.push(!!parseInt(bubbles, 10));

        if (this.hasAttribute('composed')) {
            this.emitComposedEvent(...args);
        } else {
            this.emitEvent(...args);
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
        this.#test('Event', false, 0);
        this.#test('Composed Event', true, 0);
        this.#test('Bubbling Event', false, 1);
        this.#test('Composed & Bubbling Event', true, 1);
        this.#test('Default Event', false, null);
        this.#test('Composed Default Event', true, null);
    }

    /**
     * Run an emit test, adding the result to the HTML.
     * @param {string} label Display in test result
     * @param {boolean} composed Whether to use composed event.
     * @param {?number} bubbles Whether the event should bubble
     */
    #test(label, composed, bubbles) {
        // Add result
        let result = document.createElement('div');
        result.textContent = `❌ No ${label} Emitted`;
        this.shadowRoot.appendChild(result);

        // Create test event element and listen
        let dispatcher = document.createElement('test-event-dispatcher');
        const detail = String(Math.random());
        dispatcher.setAttribute('detail', detail);

        if (composed) {
            dispatcher.setAttribute('composed', '');
        }

        let bubblesExpected = true;
        if (bubbles !== null) {
            dispatcher.setAttribute('bubbles', bubbles);
            bubblesExpected = !!parseInt(bubbles, 10);
        }

        // Listen for the event and add element to dispatch
        dispatcher.addEventListener('TestEvent', (event) => {
            if (event.detail !== detail) {
                result.textContent = `❌ ${label} – Detail Incorrect`;
            } else if (event.composed !== composed) {
                result.textContent = `❌ ${label} – Composed Option Incorrect`;
            } else if (event.bubbles !== bubblesExpected) {
                result.textContent = `❌ ${label} – Bubbles Option Incorrect`;
            } else {
                result.textContent = `✅ ${label} Emitted`;
            }
        });
        this.shadowRoot.appendChild(dispatcher);
    }
}

customElements.define('test-events', TestEvents);
