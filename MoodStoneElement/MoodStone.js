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
    #isSad;
    get isSad() {
        return this.#isSad;
    }
    set isSad(nv) {
        this.#isSad = nv;
        const div = this.shadowRoot?.querySelector('#isSad');
        if (div !== null && div !== undefined)
            div.textContent = '' + nv;
    }
    #isPensive;
    get isPensive() {
        return this.#isPensive;
    }
    set isPensive(nv) {
        this.#isPensive = nv;
        const div = this.shadowRoot?.querySelector('#isPensive');
        if (div !== null && div !== undefined)
            div.textContent = '' + nv;
    }
    #isTriumphant;
    get isTriumphant() {
        return this.#isTriumphant;
    }
    set isTriumphant(nv) {
        this.#isTriumphant = nv;
        const div = this.shadowRoot?.querySelector('#isTriumphant');
        if (div !== null && div !== undefined)
            div.textContent = '' + nv;
    }
    #isEager;
    get isEager() {
        return this.#isEager;
    }
    set isEager(nv) {
        this.#isEager = nv;
        const div = this.shadowRoot?.querySelector('#isEager');
        if (div !== null && div !== undefined)
            div.textContent = '' + nv;
    }
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.shadowRoot.innerHTML = String.raw `
        <div id=isHappy></div>
        <div id=isSad></div>
        <div id=isPensive></div>
        <div id=isTriumphant></div>
        <div id=isEager></div>
        <div itemscope>
            <!-- <h3>Example 1a</h3>
            <input checked name=isHappy type=checkbox be-entrusting>
            <h3>Example 1b</h3>
            <input disabled be-entrusting='of disabled property of $0 to is triumphant property of host.'>
            <h3>Example 1c</h3>
            <input disabled be-entrusting='of disabled to /isSad.'>
            <h3>Example 1d</h3>
            <link itemprop=isPensive>
            <input disabled be-entrusting='of disabled to $isPensive.'> -->
            <h3>Example 1e</h3>
            <link itemprop=isEager be-entrusting href=http://schema.org/True>
        </div>
        <be-hive></be-hive>
        `;
    }
}
customElements.define('mood-stone', MoodStone);
