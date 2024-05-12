// import html from './dist/index.html';

const reactProjectPath = 'react-project/dist_with_web-component';
// need to get the HTML file to know what script to inject to load web-component from React app
fetch(`${reactProjectPath}/index.html`)
  .then(function (response) {
    if (response.ok) {
      return response.text();
    }
    throw response;
  }).then(function (html) {
    html = html.replaceAll('"/assets', `"${reactProjectPath}/assets`);
    console.log('====html====', html);

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const rootNode = doc.documentElement;

    const scripts = rootNode.querySelectorAll('script');
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
      document.head.append(script);
    });
  });
