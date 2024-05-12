// import html from './dist/index.html';

const reactProjectPath = 'react-project/dist';
// need to get the HTML file to use it as a template and to know what script to inject to run the React app render
fetch(`${reactProjectPath}/index.html`)
  .then(function (response) {
    if (response.ok) {
      return response.text();
    }
    throw response;
  }).then(function (html) {
    const reactProjectTemplate = document.createElement('template');

    reactProjectTemplate.innerHTML = html.replaceAll('"/assets', `"${reactProjectPath}/assets`);
    console.log(reactProjectTemplate);

    class ReactProject extends HTMLElement {
      #shadowRoot;

      constructor() {
        super();

        this.#shadowRoot = this.attachShadow({ mode: 'open' });

        this.#shadowRoot.append(reactProjectTemplate.content.cloneNode(true));

        const scripts = this.#shadowRoot.querySelectorAll('script');
        console.log('====scripts====', scripts);
        scripts.forEach((s) => {
          const script = document.createElement('script');
          // script.src = s.src.replace('/assets/', `${reactProjectPath}/assets/`);
          script.src = s.src;
          script.defer = true;

          script.onload = function() {
            // Script is loaded and ready to execute
            console.log('Script loaded!');
          };
          this.#shadowRoot.append(script);
        });
      }

      // get #scripts() {
      //   return this.#shadowRoot.querySelectorAll('script');
      // }
      //
      // #scopedEval = (script) =>
      //   Function(script).bind(this.#shadowRoot)();
      //
      // #processScripts() {
      //   console.log(this.#scripts[0].innerHTML)
      //   this.#scripts.forEach(
      //     (s) => this.#scopedEval(s.innerHTML)
      //   );
      // }
      //
      // connectedCallback() {
      //   this.#processScripts();
      // }
      connectedCallback() {
        console.log('React Web-Component connected');
      }

      disconnectedCallback() {
        console.log('React Web-Component disconnected');
      }
    }

    customElements.define('react-project', ReactProject);
  });

