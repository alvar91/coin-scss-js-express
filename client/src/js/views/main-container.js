import AbstractView from "./abstract-view.js";

const createMainContainerTemplate = () => {
  return `<main class="main">
    <section class="container js-main-container"></section>
    </main>
  `;
};

export default class MainContainer extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createMainContainerTemplate();
  }

  getMainSectionContainer() {
    return document.querySelector(`.js-main-container`);
  }
}
