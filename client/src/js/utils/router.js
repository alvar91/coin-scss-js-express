export default class Router {
  constructor(presenter) {
    this._presenter = presenter;
  }

  navigateTo = (url) => {
    if (url === location.pathname) return;

    history.pushState(null, null, url);
    this._router();
  };

  getCurrentRoute = () => {
    const arrPathname = location.pathname.split(`/`);

    return arrPathname[1];
  };

  _isValidParam = (arrPathname) => {
    return arrPathname.length === 2 && Number.isInteger(+arrPathname[1]);
  };

  _router = () => {
    const isAuth = this._presenter.getIsAuth();

    if (!isAuth) {
      this._presenter.resetRoute();
      return;
    }

    this._presenter.resetWebSocketTransfer();
    const arrPathname = location.pathname.split(`/`).slice(1);

    if (arrPathname[0] === `logout`) {
      this._presenter.resetRoute();

      return;
    }

    if (arrPathname[0] === `accounts`) {
      this._presenter.accountsRoute();
      return;
    }

    if (arrPathname[0] === `currency`) {
      this._presenter.currencyRoute();
      return;
    }

    if (arrPathname[0] === `banks`) {
      this._presenter.banksRoute();
      return;
    }

    if (arrPathname[0] === `account` && this._isValidParam(arrPathname)) {
      this._presenter.accountIdRoute(arrPathname[1]);
      return;
    }

    if (arrPathname[0] === `history` && this._isValidParam(arrPathname)) {
      this._presenter.accountIdHistory(arrPathname[1]);
      return;
    }

    this.navigateTo(`/accounts`);
  };

  init() {
    window.addEventListener("popstate", this._router);
    this._router();
  }
}
