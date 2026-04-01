    #testInternals() {
        const style = document.createElement('style');
        style.textContent = `
            #testInternals {
                &:before {
                    content: "❌ ";
                }
                &:after {
                    content: " Failed - CSS State Not Applied";
                }
            }

            :host(:state(internals)) {
                #testInternals {
                    &:before {
                        content: "✅ ";
                    }
                    &:after {
                        content: " Successful";
                    }
                }
            }
        `;
        this.shadowRoot.appendChild(style);

        const div = document.createElement('div');
        div.setAttribute('id', 'testInternals');
        div.textContent = 'Element Internals State';
        this.shadowRoot.appendChild(div);
        this.internals = true;
    }