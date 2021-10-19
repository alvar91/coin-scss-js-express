import AbstractView from "./abstract-view.js";

const createLoadingTemplate = () => {
  return `
        <div class="loader"></div>
  `;
};

export default class LoadingView extends AbstractView {
  getTemplate() {
    return createLoadingTemplate();
  }
}
