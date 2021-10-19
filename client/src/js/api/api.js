const RequestMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`,
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  constructor(endPoint, wsEndPoint) {
    this._endPoint = endPoint;
    this._wsEndPoint = wsEndPoint;
  }

  _load({
    url,
    method = RequestMethod.GET,
    body = null,
    headers = new Headers(),
    token,
  }) {
    headers.append(`authorization`, `Basic ${token}`);

    return fetch(`${this._endPoint}/${url}`, { method, body, headers })
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static catchError(err) {
    throw err;
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  getWebSocketConnectionTransfer() {
    return new WebSocket(`${this._wsEndPoint}/currency-feed`);
  }

  login(authData) {
    return this._load({
      url: `login`,
      method: RequestMethod.POST,
      body: JSON.stringify(authData),
      headers: new Headers({ "Content-Type": `application/json` }),
    })
      .then(Api.toJSON)
      .then((token) => token);
  }

  addAccount(token) {
    return this._load({
      url: `create-account`,
      method: RequestMethod.POST,
      token,
    })
      .then(Api.toJSON)
      .then(({ payload: account }) => {
        return account;
      });
  }

  getAccounts(token) {
    return this._load({ url: `accounts`, token })
      .then(Api.toJSON)
      .then((accounts) => accounts);
  }

  getAccount({ token, accountId }) {
    if (!accountId) Promise.reject(new Error(`Account id is required`));

    return this._load({ url: `account/${accountId}`, token })
      .then(Api.toJSON)
      .then((account) => {
        return account;
      });
  }

  getBanks(token) {
    return this._load({ url: `banks`, token })
      .then(Api.toJSON)
      .then((banks) => banks);
  }

  newTransaction(transactionData, token) {
    return this._load({
      url: `transfer-funds`,
      method: RequestMethod.POST,
      body: JSON.stringify(transactionData),
      headers: new Headers({ "Content-Type": `application/json` }),
      token,
    })
      .then(Api.toJSON)
      .then((response) => {
        return response;
      });
  }

  newCurrency(currencyData, token) {
    return this._load({
      url: `currency-buy`,
      method: RequestMethod.POST,
      body: JSON.stringify(currencyData),
      headers: new Headers({ "Content-Type": `application/json` }),
      token,
    })
      .then(Api.toJSON)
      .then((response) => {
        return response;
      });
  }

  getAllCurrencies() {
    return this._load({
      url: `all-currencies`,
    })
      .then(Api.toJSON)
      .then(({ payload }) => {
        return payload;
      });
  }

  getMyCurrencies(token) {
    return this._load({
      url: `currencies`,
      token,
    })
      .then(Api.toJSON)
      .then(({ payload }) => {
        return payload;
      });
  }

  getCurrencies(token) {
    return Promise.all([this.getAllCurrencies(), this.getMyCurrencies(token)]);
  }
}
