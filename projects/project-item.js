const projectItemTemplate = document.createElement('template');

projectItemTemplate.innerHTML = `
  <style>
    .description {
      font-size: .65rem;
      font-weight: lighter;
      color: #777;
    }
  </style>
  <li>
    <input type="checkbox" />
    <slot></slot>
    <span class="description">
      <slot name="description"></slot>
    </span>
  </li>
`;

class ProjectItem extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    shadow.append(projectItemTemplate.content.cloneNode(true));

    this.checkbox = shadow.querySelector('input');
  }

  get isChecked() {
    // not used; just for fun
    return this.checkbox.checked !== 'false' && this.checkbox.checked != null;
  }

  static get observedAttributes() {
    return ['checked'];
  }

  connectedCallback() {
    console.log('Web-Component connected');
  }

  disconnectedCallback() {
    console.log('Web-Component disconnected');
  }

  /**
   * @param {string} name
   * @param {string} oldVal
   * @param {string} newVal
   */
  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'checked') {
      this.updateChecked(newVal);
    }
  }

  /**
   * @param {string} value
   */
  updateChecked(value) {
    this.checkbox.checked = value != null && value !== 'false';
  }
}

customElements.define('project-item', ProjectItem);

// const item = document.querySelector('project-item');
// let checked = true;
// setInterval(() => {
//   checked = !checked;
//   item.setAttribute('checked', checked);
// }, 1000);
