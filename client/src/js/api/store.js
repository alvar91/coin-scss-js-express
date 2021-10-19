import { InitialStoreStructure, StoreTitle, EXPIRE_DAY_GAP } from "../const.js";

export default class Store {
  constructor(storeKey, storage) {
    this._storage = storage;
    this._storeKey = storeKey;

    this._initiateStoreStructure();
  }

  _initiateStoreStructure = () => {
    const isStorageExist = !!this._storage[this._storeKey];

    if (!isStorageExist) {
      this.setItems(InitialStoreStructure);
    }
  };

  getItems = () => {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  };

  getItem = ({ key, subKey }) => {
    const store = this.getItems();

    if (store[key] && store[key][subKey]) {
      return store[key][subKey];
    }

    if (store[key]) {
      return store[key];
    }

    throw new Error(`Key storage non exist`);
  };

  setItem = ({ key, subKey, subKey2, value }) => {
    const store = this.getItems();

    if (store[key] && subKey && subKey2) {
      store[key][subKey][subKey2] = value;
    } else if (store[key] && subKey) {
      store[key][subKey] = value;
    } else {
      store[key] = value;
    }

    const date = new Date();
    store[StoreTitle.expireDate] = date.setDate(
      date.getDate() + EXPIRE_DAY_GAP
    );

    this._storage.setItem(this._storeKey, JSON.stringify(store));
  };

  setItems = (items) => {
    this._storage.setItem(this._storeKey, JSON.stringify(items));
  };

  resetStorage = () => {
    this.setItems(InitialStoreStructure);
  };

  resetMinorStorage = () => {
    const newStore = InitialStoreStructure;

    const auth = this.getItem({ key: "auth" });
    const pageOrders = this.getItem({ key: "pageOrders" });
    const verifiedAccountsByTransactions = this.getItem({
      key: "verifiedAccountsByTransactions",
    });

    newStore.auth = auth;
    newStore.pageOrders = pageOrders;
    newStore.verifiedAccountsByTransactions = verifiedAccountsByTransactions;

    this.setItems(newStore);
  };

  concatItem({ key, value }) {
    const currentData = this.getItem({ key });

    const newData = [].concat(currentData);

    if (newData.includes(value)) {
      return newData;
    }

    newData.push(value);

    return newData;
  }
}
