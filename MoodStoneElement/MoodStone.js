export class MoodStone extends HTMLElement {
    #isHappy;
    get isHappy() {
        return this.#isHappy;
    }
    set isHappy(nv) {
        this.#isHappy = nv;
        const div = this.shadowRoot?.querySelector('#isHappy');
        if (div !== null && div !== undefined)
            div.textContent = '' + nv;
    }
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.shadowRoot.innerHTML = String.raw `
        <div itemscope>
            <h3>Example 1a</h3>
            <input checked name=isHappy type=checkbox be-entrusting>
        </div>
        <be-hive></be-hive>
        `;
    }
}
customElements.define('mood-stone', MoodStone);
