import AbstractView from "./abstract-view.js";

const createHistoryBodyTemplate = () => {
  return `
  <div class="currency__middle js-body-container">
    <div data-index="0" class="draggable currency__first-component"></div>
    <div data-index="1" class="draggable currency__second-component"></div>
    <div data-index="2"  class="draggable currency__third-component"></div>
  </div>`;
};

export default class CurrencyBody extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createHistoryBodyTemplate();
  }

  _changeHandler = (dndItems) => {
    const mappedOrder = [];

    for (const item of dndItems) {
      const index = item.getAttribute("data-index");
      const element = item
        .querySelector(".draggable__item")
        .getAttribute("data-item");

      const orderCouple = { [index]: element };

      mappedOrder.push(orderCouple);
    }

    this._handler.change(mappedOrder);
  };

  setChangeHandler(handler) {
    this._handler.change = handler;
  }

  get0Container() {
    return this.getElement().querySelector(`[data-index="0"]`);
  }

  get1Container() {
    return this.getElement().querySelector(`[data-index="1"]`);
  }

  get2Container() {
    return this.getElement().querySelector(`[data-index="2"]`);
  }

  init = () => {
    let dndItems = this.getElement().querySelectorAll(".draggable");
    let dragStartIndex;

    this.getElement().addEventListener("dragstart", (e) => {
      //console.log("dragstart");

      dragStartIndex = +e.target
        .closest(".draggable")
        .getAttribute("data-index");
    });

    this.getElement().addEventListener("dragover", (e) => {
      const zone = getCurrentZone(e.target);

      if (zone) {
        e.preventDefault();
      }
    });

    function swapItems(fromIndex, toIndex) {
      const itemOne = dndItems[fromIndex].querySelector(".draggable__item");
      const itemTwo = dndItems[toIndex].querySelector(".draggable__item");

      dndItems[fromIndex].appendChild(itemTwo);
      dndItems[toIndex].appendChild(itemOne);
    }

    this.getElement().addEventListener("drop", (e) => {
      // console.log("drop");
      e.preventDefault();

      const dragEndIndex = +e.target
        .closest(".draggable")
        .getAttribute("data-index");

      if (dragStartIndex === dragEndIndex) {
        return;
      }

      swapItems(dragStartIndex, dragEndIndex);

      this._changeHandler(dndItems);
    });

    function getCurrentZone(from) {
      while ((from = from.parentElement)) {
        if (from.classList.contains("draggable")) {
          return from;
        }
      }

      return null;
    }
  };
}
