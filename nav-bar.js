const navTemplate = document.createElement('template');

navTemplate.innerHTML = `
  <style>
    nav {}
  </style>
  <nav>
    <slot></slot>
    |
    <a href="/">Go back Home</a>
    |
    <a href="/projects">Projects page</a>
    |
    <a href="/gw2GemAlert">GW2 Gem Alert</a>
    |
    <a href="/resume">Resume page</a>
    |
    <a href="/about">About page</a>
    |
    <span class="end">
      <slot name="end"></slot>
    </span>
  </nav>
  <hr />
`;

class NavBar extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    shadow.append(navTemplate.content.cloneNode(true));
  }
}

customElements.define('nav-bar', NavBar);
