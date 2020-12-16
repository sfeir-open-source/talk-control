import '@webcomponents/webcomponentsjs/webcomponents-loader';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import { bulmaStyles } from '@granite-elements/granite-lit-bulma/granite-lit-bulma';
import { LitElement, html, css } from 'lit-element';

class MagicInfo extends LitElement {
    static get styles() {
        return [
            bulmaStyles,
            css`
                .content {
                    position: relative;
                    height: 100%;
                    padding: 0.5rem;
                }
            `
        ];
    }

    firstUpdated() {
        this.shadowRoot.querySelector('#doMagic').addEventListener('click', this.doMagic);
    }

    doMagic() {
        let url = sessionStorage.getItem('presentationUrl');
        if (url.includes('tc-presentation-url')) return;

        const magicUrl = `tc-presentation-url=${url}`;
        sessionStorage.setItem('presentationUrl', magicUrl);
        location.reload();
    }

    render() {
        return html`
            <div class="content is-medium">
                <h1>TalkControl cannot control your presentation</h1>
                <p>
                    You need to add tc-component.js script to your presentation to take control of it.
                </p>
                <h2>Do it with magic</h2>
                <p>
                    We implement a mecanism that could inject for you the script in your presentation but this one could not work with one of those cases:
                    <ul>
                    <li>Use of external server call in slides</li>
                    <li>Use of websockets</li>
                    <li>Use of an Iframe pointing to an external website</li>
                    </ul>
                    If you are in one of those cases, we encourage you to test the "magic" before.<br/>
                    If something is not working, please refer to manually process.<br/>
                    To use the magic, please click here :
                </p>
                <p class="has-text-centered">
                    <button id="doMagic" class="is-size-4">Do the magic 🧙‍♀️</button>
                </p>
                <h2>Or do it manually</h2>
                <p>
                    <ul>
                        <li>Open your the index.html file of your presentation</li>
                        <li>Insert the following code just before the &lt;/body&gt; tag :
                            <pre>
                                <code>
&lt;script type="application/javascript"&gt;
// Configure the url of the server serving the tc-component and other split shunks
window.tcResourcePath = 'http://localhost:3000/'
&lt;/script>
&lt;script type="text/javascript" src="http://localhost:3000/tc-component.bundle.js"&gt;&lt;/script&gt;	
                                </code>
                            </pre>
                        </li>
                    </ul>
                </p>
            </div>
        `;
    }
}

// Register the new element with the browser.
customElements.define('tc-magic-info', MagicInfo);
