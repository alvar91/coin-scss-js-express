import AbstractView from "./abstract-view.js";
import { debounce } from "../utils/debounce.js";

const dropDownItemTemplate = (item, field) => {
  return `<li>
    <a data-fieldid=${field.id} class="account-dropdown-item" href="#">${item}</a>
  </li>`;
};

const isValidTemplate = (isTouched, isValid) => {
  if (!isTouched) {
    return ``;
  } else if (!isValid) {
    return `login__label--error`;
  }

  return `login__label--success`;
};

const renderDropdown = (field, verifiedAccounts) => {
  return `<div class="account-dropdown-menu">
    <ul class="account-dropdown-group">
      ${verifiedAccounts
        .map((item) => {
          return dropDownItemTemplate(item, field);
        })
        .join("")}
    </ul>
  </div>`;
};

const inputDropdownFieldTemplate = (field, verifiedAccounts) => {
  return `<div class="account-dropdown">
      <div class="account-dropdown-container">
        <label class="login__label js-label pr-20 ${isValidTemplate(
          field.isTouched,
          field.isValid
        )}">
          <span class="login__span">${field.title}</span>
          <input data-fieldid=${field.id} type="number" value="${
    field.value
  }" class="login__input account-dropdown-toggle js-click-dropdown js-input" placeholder="Введите ${
    field.title
  }" required data-testid="test-transaction-dropdown" />
        </label>
        ${renderDropdown(field, verifiedAccounts)}
      </div>
  </div>`;
};

export default class InputDropdown extends AbstractView {
  constructor(field, verifiedAccounts) {
    super();

    this._field = field;
    this._verifiedAccounts = verifiedAccounts;

    this.timer = { timerId: null };

    this.init();
  }

  getTemplate() {
    return inputDropdownFieldTemplate(this._field, this._verifiedAccounts);
  }

  _setValid(evt) {
    evt.target.closest(`.js-label`).classList.remove(`account__label--error`);
  }

  _changeHandler = (evt) => {
    evt.preventDefault();
    this._handler.change(evt.target.dataset.fieldid, evt.target.value);
  };

  setChangeHandlerInput(handler) {
    this._handler.change = handler;

    this.getElement()
      .querySelector(".js-input")
      .addEventListener(`input`, (evt) =>
        debounce(this._changeHandler, evt, 600, this.timer)
      );

    this.getElement()
      .querySelector(".js-input")
      .addEventListener(`focus`, (evt) => this._setValid(evt));
  }

  _changeHandlerDropdown = (evt) => {
    evt.preventDefault();

    this._handler.changeDropdown(
      evt.target.dataset.fieldid,
      evt.target.innerText
    );
  };

  setChangeHandlerDropdown = (handler) => {
    this._handler.changeDropdown = handler;
  };

  _closeDropdown = () => {
    // remove the open and active class from other opened Dropdown (Closing the opend DropDown)
    this.getElement()
      .querySelectorAll(".account-dropdown-container")
      .forEach((container) => {
        container.classList.remove("account-dropdown-open");
      });

    this.getElement()
      .querySelectorAll(".account-dropdown-menu")
      .forEach((menu) => {
        menu.classList.remove("account-dropdown-active");
      });
  };

  _preventScroll(e) {
    if (e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault();
    }
  }

  _dropDownFunc = (dropDown) => {
    const innerText = (e) => {
      if (e.target.classList.contains("account-dropdown-item")) {
        dropDown.value = e.target.innerText;

        this._changeHandlerDropdown(e);
      }
    };

    if (dropDown.classList.contains("js-click-dropdown")) {
      dropDown.addEventListener("click", (e) => {
        e.preventDefault();

        if (
          dropDown.parentElement.nextElementSibling.classList.contains(
            "account-dropdown-active"
          )
        ) {
          // Close the clicked dropdown
          dropDown.parentElement.classList.remove("account-dropdown-open");
          dropDown.parentElement.nextElementSibling.classList.remove(
            "account-dropdown-active"
          );
          dropDown.parentElement.nextElementSibling.removeEventListener(
            "click",
            innerText
          );
        } else {
          // Close the opend dropdown
          this._closeDropdown();

          // add the open and active class(Opening the DropDown)
          dropDown.parentElement.parentElement.classList.add(
            "account-dropdown-open"
          );
          dropDown.parentElement.nextElementSibling.classList.add(
            "account-dropdown-active"
          );

          dropDown.parentElement.nextElementSibling.addEventListener(
            "click",
            innerText
          );
        }
      });
    }
  };

  init() {
    // Get all the dropdown from current dropdown
    this.getElement()
      .querySelectorAll(".account-dropdown-toggle")
      .forEach((dropDown) => this._dropDownFunc(dropDown));

    // Listen to the doc click
    window.addEventListener("click", (e) => {
      // Close the menu if click happen outside menu
      if (e.target.closest(".account-dropdown-container") === null) {
        // Close the opend dropdown
        this._closeDropdown();
      }
    });
    window.addEventListener("keydown", this._preventScroll);
  }
}
