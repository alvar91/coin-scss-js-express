import AbstractView from "./abstract-view.js";

const checkRender = (isCurrentSortType) => {
  if (isCurrentSortType) {
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.00003 16.17L4.83003 12L3.41003 13.41L9.00003 19L21 7.00003L19.59 5.59003L9.00003 16.17Z" fill="#182233"/>
    </svg>`;
  }

  return ``;
};

const dropDownItemTemplate = (item, currentSortType) => {
  return `<li>
    <a class="dropdown-item" href="#">${item} ${checkRender(
    item === currentSortType
  )}</a>
  </li>`;
};

export default class Dropdown extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;
    this._sortList = ["По номеру", "По балансу", "По последней транзакции"];

    this.init();
  }

  getTemplate() {
    const isExistcurrentSortType = !!this._currentSortType;

    return `<div class="dropdown">
    <div class="dropdown-container">
      <div class="dropdown-toggle click-dropdown js-contact-field">${
        isExistcurrentSortType ? this._currentSortType : `Сортировка`
      }</div>
      <div class="dropdown-menu">
        <ul class="dropdown-group">
          ${this._sortList
            .map((item) => {
              return dropDownItemTemplate(item, this._currentSortType);
            })
            .join("")}
        </ul>
      </div>
    </div>
  </div>`;
  }

  _changeHandlerDropdown = (evt) => {
    evt.preventDefault();

    this._handler.changeDropdown(evt.target.innerText);
  };

  setChangeHandlerDropdown = (handler) => {
    this._handler.changeDropdown = handler;
  };

  _closeDropdown = () => {
    // remove the open and active class from other opened Dropdown (Closing the opend DropDown)
    this.getElement()
      .querySelectorAll(".dropdown-container")
      .forEach((container) => {
        container.classList.remove("dropdown-open");
      });

    this.getElement()
      .querySelectorAll(".dropdown-menu")
      .forEach((menu) => {
        menu.classList.remove("dropdown-active");
      });
  };

  _preventScroll(e) {
    if (e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault();
    }
  }

  _keyNavigation(e) {
    const previousLink =
      e.target.parentElement.previousElementSibling?.firstElementChild;
    const nextLink =
      e.target.parentElement.nextElementSibling?.firstElementChild;

    if (e.keyCode === 38 && previousLink) {
      previousLink.focus();
    } else if (e.keyCode === 40 && nextLink) {
      nextLink.focus();
    }
  }

  _dropDownFunc = (dropDown) => {
    const innerText = (e) => {
      if (e.target.classList.contains("dropdown-item")) {
        dropDown.innerText = e.target.innerText;

        this._changeHandlerDropdown(e);
      }
    };

    if (dropDown.classList.contains("click-dropdown")) {
      dropDown.addEventListener("click", (e) => {
        e.preventDefault();

        if (dropDown.nextElementSibling.classList.contains("dropdown-active")) {
          // Close the clicked dropdown
          dropDown.parentElement.classList.remove("dropdown-open");
          dropDown.nextElementSibling.classList.remove("dropdown-active");
          dropDown.nextElementSibling.removeEventListener("click", innerText);
        } else {
          // Close the opend dropdown
          this._closeDropdown();

          // add the open and active class(Opening the DropDown)
          dropDown.parentElement.classList.add("dropdown-open");
          dropDown.nextElementSibling.classList.add("dropdown-active");

          dropDown.nextElementSibling.addEventListener("click", innerText);

          dropDown.nextElementSibling.addEventListener(
            "keydown",
            this._keyNavigation
          );

          dropDown.nextElementSibling.querySelector(".dropdown-item").focus();
        }
      });
    }
  };

  init() {
    // Get all the dropdown from current dropdown
    this.getElement()
      .querySelectorAll(".dropdown-toggle")
      .forEach((dropDown) => this._dropDownFunc(dropDown));

    // Listen to the doc click
    window.addEventListener("click", (e) => {
      // Close the menu if click happen outside menu
      if (e.target.closest(".dropdown-container") === null) {
        // Close the opend dropdown
        this._closeDropdown();
      }
    });
    window.addEventListener("keydown", this._preventScroll);
  }
}
