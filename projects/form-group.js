/**
# `<form-group>` component

This component uses a progressive enhancement approach to add custom error message handling to your existing text inputs, radio button groups and textareas. When users type into those fields, the component will use the native validity of the inputs to determine whether or not to show errors. Error messages can be customized according to each possible validty state.

## Demo

This web component was created for two tutorials on Kevin Powell's YouTube channel.

- [Using the web component](https://youtu.be/qUhtlnL48yA)
- Creating a web component *(coming soon)*

## Installation

Link the code to your application by importing the script file into your application javascript.

## Usage

The `<form-group>` component is meant to be a wrapper around either a single field (text inputs) or a radio button group. When the component is loaded, it will decorate the existing inputs to add a span for the error message using `aria-live=polite` for announcing errors to users using assistive technology.

Here is an example of the component in action with a text input:

```html
<form-group>
  <label for="fname">First Name</label>
  <input type="text" id="fname" name="first_name" required />
</form-group>
```

### Attributes

The error messages that are displayed are customizable via attributes on the `<form-group>` element. The attribute names correspond to the native constraint names in the [ValidityState](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) object natively assocated to every form field.

```html
<form-group
  value-missing-message="Apply when the field is required but has no value"
  too-long-message="Apply when the value is longer than the maxlength"
  too-short-message="Apply when the value is shorter than the minlength"
  range-overflow-message="Apply when the field is a number and its value is greater than the max"
  range-underflow-message="Apply when the field is a number and its value is less than the min"
  type-mismatch-message="Apply when the field has a type, but the value doesnt match the format for that type"
  pattern-mismatch-message="Apply when the field has a pattern and the value doesnt match the pattern"
>
  <label for="fname">First Name</label>
  <input type="text" id="fname" name="first_name" required />
</form-group>
```

#### Multiple errors

Natively speaking an input can have multiple invalid cases. For example, the field value could be both too short and not match the specified pattern from an applied `pattern` attribute. But having multiple errors isn't practical for users who can only really fix one error at a time. Likewise, showing field level errors next to the field to which they pertain is a common UX. It is very hard to show multiple errors next to a single field in a form. Therefore, the `<form-group>` component will only show the first invalid state the field has. If there are multiple errors, the user can fix them one at a time.

## Slots

The "default" slot is the only available slot for `<form-group>`. That means that by default, any direct children elements of a `<form-group>` component will be considered "slotted". The `<form-group>` component does not attempt to style any slotted elements, but will add event listeners to slotted input elements.

## Events

The `<form-group>` component handles showing errors by default and showing errors is driven by native events that are emitted when the user is typing. To try to create the best user experience possible:

- Invalid event: The default validity tooltip message is disabled in favor of the commonly used error message beneath the field
- Blur event: Error messages are only shown when the `blur` event is emitted. Users must tab away from a field to see an error
- Input event: Error messages are cleared when the `input` event is emitted to avoid showing users an error message while they are still typing

Event listeners for `invalid`, `input`, and `blur` events will be automatically added to slotted input elements when the component loads. If the component is unloaded from the DOM, these listeners will be removed automatically as well.

## Styling

Since the component only creates a single error message span, there isn't a large stying API necessary. However there are 2 configuration options available to style the error message according to your application needs

### CSS Variables

Use the `--error-message-color` CSS variable to control the `color` of the error message. The default color is `hsl(0, 66%, 54%)` but will be overridden by the value of `--error-message-color` if it is set.

```html
<!-- inline styles are for demo purposes only -->
<form-group style="--error-message-color: blue;">
  <label for="fname">First Name</label>
  <input type="text" id="fname" name="first_name" required />
</form-group>
```

### CSS Part

If you need more stylistic control over the error message element, a CSS part called `error-message` is also provided. Using the CSS part will enable you to style the entire error message element with any CSS properties you wish. Below is an example of using the CSS part

```html
<style>
  form-group::part(error-message) {
    padding: 6px;
    background-color: pink;
    color: black;
  }
</style>
<form-group>
  <label for="fname">First Name</label>
  <input type="text" id="fname" name="first_name" required />
</form-group>
```
*/

const formGroupStyles = new CSSStyleSheet();

formGroupStyles.replaceSync(`

  .error-message {
    color: var(--error-message-color, red);
  }

  .error-message:empty {
    display: none;
  }

`);

class FormGroup extends HTMLElement {
    #input;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [formGroupStyles];
        this.shadowRoot.innerHTML = `
      <slot></slot>
      <span class="error-message" 
            aria-live="polite"
            part="error-message">
      </span>
    `
    }

    #handleInvalid(e) {
        e.preventDefault();
    }

    #handleInput() {
        if (this.#input) {
            console.log('hello')
            this.#errorMessage.textContent = '';
        }
    }

    #handleBlur() {
        // if input is NOT valid, show an error message
        if (this.#input && !this.#input.validity.valid) {
            this.#errorMessage.textContent = this.#customErrorMessage[this.#getFirstInvalid(this.#input.validity)];
        }
    }

    connectedCallback() {
        this.#input = this.querySelector("input, textarea");

        if (this.#input) {
            // turn off the browser validation popup
            this.#input.addEventListener('invalid', this.#handleInvalid.bind(this))

            // hide error messages while user is typing
            this.#input.addEventListener('input', this.#handleInput.bind(this))

            // validate and show error messages when a user leaves a field
            this.#input.addEventListener('blur', this.#handleBlur.bind(this))
        }
    }

    disconnectedCallback() {
        // clean up all event listeners
        if (this.#input) {
            this.#input.removeEventListener('invalid', this.#handleInvalid)
            this.#input.removeEventListener('input', this.#handleInput)
            this.#input.removeEventListener('blur', this.#handleBlur)
        }
    }

    get #errorMessage() {
        return this.shadowRoot.querySelector('.error-message');
    }

    #getFirstInvalid(validityState) {
        for (const key in validityState) {
            if (validityState[key]) {
                return key;
            }
        }
    }

    get #customErrorMessage() {
        return {
            valueMissing: this.getAttribute('value-missing-message') || 'This field is required',
            tooLong: this.getAttribute('too-long-message') || 'This field is too long',
            tooShort: this.getAttribute('too-short-message') || 'This field is too short',
            rangeOverflow: this.getAttribute('range-overflow-message') || 'This field has a number that is too big',
            rangeUnderflow: this.getAttribute('range-underflow-message') || 'This field has a number that is too small',
            typeMismatch: this.getAttribute('type-mismatch-message') || 'This field is the wrong type',
            patternMismatch: this.getAttribute('pattern-mismatch-message') || 'This fields value does not match the pattern',
        }
    }
}




customElements.define("form-group", FormGroup);

// or import code using:
// fetch('https://raw.githubusercontent.com/kevin-powell/form-groups-wc/refs/heads/main/form-group.js')
//   .then(response => response.text())
//   .then(code => {
//     const script = document.createElement('script');
//     script.textContent = code;
//     document.head.appendChild(script);
//   })
//   .catch(error => console.error('Error loading form-group component:', error));