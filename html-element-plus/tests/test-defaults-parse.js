/** @file Test the setting of defaults for attributes, as well as pre-parsing of attributes before reflection. */

import TestHTMLElementPlus from './TestHTMLElementPlus.js';

class TestDefaultsParse extends TestHTMLElementPlus {
    static reflectedAttributes = {unset: {}, set: {}, count: {}, 'count-unset': {}, nothing: {}};

    static defaultAttributes = {
        unset: 'UNSET',
        set: 'DEFAULT',
        'count-unset': '22',
    };

    static attributesParser(attrName, value) {
        if (attrName.includes('count')) {
            return parseInt(value, 10);
        }
        return value;
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        this.#testUnsetDefault();
        this.#testSetDefault();
        this.#testParseNoDefault();
        this.#testParseUnsetWithDefault();
        this.#testNothing();
    }

    #testUnsetDefault() {
        const label = 'Unset Default';
        if (this.unset !== 'UNSET') this.fail(label, 'Default Not Returned');
        else this.pass(label);
    }

    #testSetDefault() {
        const label = 'Set Default';
        if (this.set === 'DEFAULT') this.fail(label, 'Default Used Even When Attribute Set');
        else if (this.set !== 'SET') this.fail(label, 'Wrong Value Returned');
        else this.pass(label);
    }

    #testParseNoDefault() {
        const label = 'Parse Without Default';
        if (this.count !== 0) this.fail(label, 'Unexpected Value');
        else this.pass(label);
    }

    #testParseUnsetWithDefault() {
        const label = 'Parse Unset With Default';
        if (this.countUnset !== 22) this.fail(label, 'Unexpected Value');
        else this.pass(label);
    }

    #testNothing() {
        const label = 'No Default No Parsing';
        if (this.nothing !== null) this.fail(label, 'Not Undefined');
        else this.pass(label);
    }
}

customElements.define('test-defaults-parse', TestDefaultsParse);
