import App from "./core/App";

document.addEventListener("DOMContentLoaded", () => {
  const formContainer = document.querySelector("#app-embed");

  const observer = new MutationObserver((mutationsList, observer) => {
    const form = document.querySelector("form-embed");

    if (form) {
      observer.disconnect();
      const shadow = form.shadowRoot;

      // Clear existing adopted stylesheets
      shadow.adoptedStyleSheets = [];

      const sheet = new CSSStyleSheet();

      // CSS Reset for form elements
      sheet.insertRule(`
        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
      `);

      sheet.insertRule(`
        input, button, textarea, select {
          font-family: inherit;
          font-size: 100%;
          line-height: 1.15;
          margin: 0;
        }
      `);

      sheet.insertRule(`
        div[class*='_formFieldContainer'] {
          position: relative !important;
          margin-bottom: 1rem !important;
          width: 100% !important;
        }
      `);

      // Base input styles
      sheet.insertRule(`
        input:not([type="radio"]) {
          outline: none;
          appearance: none;
          width: 100%;
          background-color: transparent;
          padding: 1rem 0;
          border: none !important;
          border-bottom: 1px solid rgba(36, 25, 23, 0.1) !important;
          transition: all 0.5s ease-in-out !important;
        }
      `);

      // Add position relative to input container
      sheet.insertRule(`
        div[class*='_inputField'] {
          position: relative !important;
          margin-top: 1rem !important;
        }
      `);

      // Floating label styles
      sheet.insertRule(`
        label {
          font-family: sans-serif !important;
          text-transform: uppercase !important;
          font-size: 0.75rem !important;
          color: rgba(36, 25, 23, 0.6) !important;
        }
      `);

      // Floating label styles
      sheet.insertRule(`
        label:not([class*='_radioField']) {
          position: absolute !important;
          left: 0;
          top: 1rem ;
          transition: all 0.2s ease-out !important;
          pointer-events: none !important;
          color: rgba(36, 25, 23, 0.6) !important;
        }
      `);

      // Label float on input focus or when input has value
      sheet.insertRule(`
        label[class*='_inputFilled'] {
           top: 0rem !important;
          font-size: 0.75rem !important;
          color: rgba(36, 25, 23, 1) !important;
        }
      `);

      // Add placeholder to ensure label moves when there's content
      sheet.insertRule(`
        input::placeholder {
          color: transparent !important;
        }
      `);

      // Number input styles for Chrome/Safari/Edge
      sheet.insertRule(`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none !important;
          background: #fff !important;
        }
      `);

      // Number input styles for Firefox
      sheet.insertRule(`
        input[type=number] {
          -moz-appearance: textfield !important;
        }
      `);

      // Textarea styles
      sheet.insertRule(`
        textarea {
          outline: none !important;
          background-color: transparent !important;
          border: none !important;
          border-bottom: 1px solid rgba(36, 25, 23, 0.1) !important;
          padding: 1rem 0 !important;
          width: 100% !important;
          appearance: none !important;
        }
      `);

      // Radio input styles
      sheet.insertRule(`
        input[type="radio"] {
          display: block !important;
          appearance: none !important;
          width: 0.5rem !important;
          height: 0.5rem !important;
          border-radius: 0 !important;
          border: 1px solid rgba(36, 25, 23, 0.1) !important;
        }
      `);

      // Add radio input checked state
      sheet.insertRule(`
        input[type="radio"]:checked {
          background-color: #241917 !important;
          border-color: #241917 !important;
        }
      `);

      sheet.insertRule(`
        button:not([class*='_selectToggle']) {
          margin-top: 3rem !important;
          appearance: none !important;
          background-color: transparent !important;
          color: #241917 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 1rem !important;
          width: 100% !important;
          border: 1px solid rgba(36, 25, 23, 0.1) !important;
          border-radius: 0 !important;
          cursor: pointer !important;
          transition: all 0.5s ease-in-out !important;
        }
        `);
      sheet.insertRule(`
          button:not([class*='_selectToggle']):hover {
            border: 1px solid rgba(36, 25, 23, 1) !important;
          }
          `);

      sheet.insertRule(`
        fieldset {
          appearance: none !important;
          border: none !important;
          margin-bottom: 1rem !important;
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 0.5rem !important;
        }
      `);

      sheet.insertRule(`
        legend {
          font-family: sans-serif !important;
          text-transform: uppercase !important;
          font-size: 0.75rem !important;
          color: rgba(36, 25, 23, 0.6) !important;
          margin-bottom: 1rem !important;
        }
      `);

      sheet.insertRule(`
        label[class*='_radioField'] {
          appearance: none !important;
          border: none !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
        }
      `);

      sheet.insertRule(`
        div[class*='_horizontalLayout'] {
          display: flex !important;
          flex-wrap: wrap !important;
          align-items: center !important;
          gap: 0.5rem !important;
        }
      `);

      sheet.insertRule(`
        div[class*='_formPhoneInputContainer'] {
          display: flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
        }
      `);

      sheet.insertRule(`
        button[class*='_selectToggle'] {
          position: relative !important;
          appearance: none !important;
          background-color: transparent !important;
          color: #241917 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 1rem !important;
          width: 100% !important;
          border: none !important;
          border-bottom: 1px solid rgba(36, 25, 23, 0.1) !important;
          border-radius: 0 !important;
          cursor: pointer !important;
          transition: all 0.5s ease-in-out !important;
          min-width: 50px !important;
          gap: 0.5rem !important;
        }
        `);
      sheet.insertRule(`
          button:hover {
            border: 1px solid rgba(36, 25, 23, 1) !important;
          }
          `);

      sheet.insertRule(`
            span[class*='_selectToggleText'] {
              width: 16px !important;
            }
          `);

      sheet.insertRule(`
        div[class*='_selectContainer'] {
          display: flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          margin-bottom: 1rem !important;
        }
      `);

      sheet.insertRule(`
        div[class*='_dropdownContainer'] {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          background-color: #fff !important;
          overflow: scroll !important;
        }
      `);

      // Errors
      sheet.insertRule(`
        output[role=alert] {
          color: red !important;
          font-size: 0.8rem !important;
          margin-top: 0.5rem !important;
        }
      `);

      shadow.adoptedStyleSheets.push(sheet);

      formContainer.classList.add("loaded");
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  const app = new App();
  app.init();
});
