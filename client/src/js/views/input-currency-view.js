import AbstractView from "./abstract-view.js";

const checkRender = (isCurrentType) => {
  if (isCurrentType) {
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.00003 16.17L4.83003 12L3.41003 13.41L9.00003 19L21 7.00003L19.59 5.59003L9.00003 16.17Z" fill="#182233"/>
    </svg>`;
  }

  return ``;
};

const dropDownItemTemplate = (item, currentCurrencyType, dataType) => {
  return `<li>
      <a data-currencyType=${dataType} class="currency-dropdown-item" href="#">${item} ${checkRender(
    item === currentCurrencyType
  )}</a>
    </li>`;
};

const renderDropDown = (currencies, currentCurrencyType, dataType) => {
  return `<div class="currency-dropdown">
        <div class="currency-dropdown-container">
        <div class="currency-dropdown-toggle click-dropdown js-contact-field">${
          currentCurrencyType ? currentCurrencyType : currencies[0]
        }</div>
        <div class="currency-dropdown-menu">
            <ul class="currency-dropdown-group">
            ${currencies
              .map((item) => {
                return dropDownItemTemplate(
                  item,
                  currentCurrencyType,
                  dataType
                );
              })
              .join("")}
            </ul>
        </div>
        </div>
    </div>`;
};

const createInputCurrencyTemplate = (
  myCurrencies,
  currentFromCurrency,
  allCurrencies,
  currentToCurrency
) => {
  return `<div class="currency__inputs js-form-container">
        <span class="currency__span">Из</span>
        ${renderDropDown(myCurrencies, currentFromCurrency, "from")}
        <span class="currency__span currency__span--second">в</span>
        ${renderDropDown(allCurrencies, currentToCurrency, "to")}
        <br>
    </div>`;
};

export default class InputCurrency extends AbstractView {
  constructor({
    myCurrencies,
    currentFromCurrency,
    allCurrencies,
    currentToCurrency,
  }) {
    super();

    this._myCurrencies = Object.keys(myCurrencies);
    this._currentFromCurrency = currentFromCurrency;

    this._allCurrencies = allCurrencies.filter(
      (item) => item !== currentFromCurrency
    );
    this._currentToCurrency =
      currentToCurrency === currentFromCurrency ? null : currentToCurrency;
  }

  getTemplate() {
    return createInputCurrencyTemplate(
      this._myCurrencies,
      this._currentFromCurrency,
      this._allCurrencies,
      this._currentToCurrency
    );
  }

  getFormContainer() {
    return document.querySelector(`.js-form-container`);
  }

  _changeHandlerDropdown = (evt) => {
    evt.preventDefault();

    this._handler.changeDropdown(
      evt.target.dataset.currencytype,
      evt.target.innerText
    );
  };

  setChangeHandlerDropdown = (handler) => {
    this._handler.changeDropdown = handler;
  };

  _closeDropdown = () => {
    // remove the open and active class from other opened Dropdown (Closing the opend DropDown)
    this.getElement()
      .querySelectorAll(".currency-dropdown-container")
      .forEach((container) => {
        container.classList.remove("currency-dropdown-open");
      });

    this.getElement()
      .querySelectorAll(".currency-dropdown-menu")
      .forEach((menu) => {
        menu.classList.remove("currency-dropdown-active");
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
      if (e.target.classList.contains("currency-dropdown-item")) {
        dropDown.innerText = e.target.innerText;

        this._changeHandlerDropdown(e);
      }
    };

    if (dropDown.classList.contains("click-dropdown")) {
      dropDown.addEventListener("click", (e) => {
        e.preventDefault();

        if (
          dropDown.nextElementSibling.classList.contains(
            "currency-dropdown-active"
          )
        ) {
          // Close the clicked dropdown
          dropDown.parentElement.classList.remove("currency-dropdown-open");
          dropDown.nextElementSibling.classList.remove(
            "currency-dropdown-active"
          );
          dropDown.nextElementSibling.removeEventListener("click", innerText);
        } else {
          // Close the opend dropdown
          this._closeDropdown();

          // add the open and active class(Opening the DropDown)
          dropDown.parentElement.classList.add("currency-dropdown-open");
          dropDown.nextElementSibling.classList.add("currency-dropdown-active");

          dropDown.nextElementSibling.addEventListener("click", innerText);

          dropDown.nextElementSibling.addEventListener(
            "keydown",
            this._keyNavigation
          );

          dropDown.nextElementSibling
            .querySelector(".currency-dropdown-item")
            .focus();
        }
      });
    }
  };

  init() {
    // Get all the dropdown from current dropdown
    this.getElement()
      .querySelectorAll(".currency-dropdown-toggle")
      .forEach((dropDown) => this._dropDownFunc(dropDown));

    // Listen to the doc click
    window.addEventListener("click", (e) => {
      // Close the menu if click happen outside menu
      if (e.target.closest(".currency-dropdown-container") === null) {
        // Close the opend dropdown
        this._closeDropdown();
      }
    });
    window.addEventListener("keydown", this._preventScroll);
  }
}
