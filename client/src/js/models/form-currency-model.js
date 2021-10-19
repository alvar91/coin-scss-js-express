import Observer from "../utils/observer.js";
import { InitiateCurrencyFields } from "../const.js";

export default class FormCurrencyModel extends Observer {
  constructor() {
    super();

    this._formCurrencyFields = InitiateCurrencyFields();
    this._errorCurrencyMessages = [];
  }

  mapFieldsForServer() {
    const data = {};

    this.getFields().forEach((field) => (data[field.name] = field.value));

    return data;
  }

  resetFields() {
    this._formCurrencyFields = InitiateCurrencyFields();
  }

  getField(id) {
    return this._formCurrencyFields.find((item) => item.id === id);
  }

  getFields() {
    return this._formCurrencyFields;
  }

  setFields(newFields) {
    return (this._formCurrencyFields = newFields);
  }

  getFieldsCount() {
    return this._formCurrencyFields.length;
  }

  getErrorMessages() {
    return this._errorCurrencyMessages;
  }

  resetErrorMessages() {
    return (this._errorCurrencyMessages = []);
  }

  setError(error) {
    if (this._errorCurrencyMessages.includes(error)) return;

    this._errorCurrencyMessages.push(error);
  }

  deleteError(newError) {
    this._errorCurrencyMessages = this._errorCurrencyMessages.filter(
      (error) => newError !== error
    );
  }

  resetError() {
    this._errorCurrencyMessages = [];
  }

  setField(updateType, newField) {
    this._formCurrencyFields = this._formCurrencyFields
      .slice()
      .concat([newField]);

    this._notify(updateType);
  }

  setCurrency(updateType, accountId) {
    this._notify(updateType, { isLoading: false, accountId });
  }

  updateField(updateType, update) {
    const index = this._formCurrencyFields.findIndex(
      (field) => field.id === update.id
    );

    if (index === -1) {
      throw new Error(`Can't update nonexistent field`);
    }

    this._formCurrencyFields = [
      ...this._formCurrencyFields.slice(0, index),
      update,
      ...this._formCurrencyFields.slice(index + 1),
    ];

    const field = update;

    this._notify(updateType, { field, currentCurrencyTypeChange: true });
  }

  deleteField(updateType, updateId) {
    const index = this._formCurrencyFields.findIndex(
      (field) => field.id === updateId
    );
    if (index === -1) {
      throw new Error(`Can't delete nonexistent field`);
    }

    this._formCurrencyFields = [
      ...this._formCurrencyFields.slice(0, index),
      ...this._formCurrencyFields.slice(index + 1),
    ];

    this._notify(updateType, updateId);
  }

  isFormValid() {
    return this._formCurrencyFields.some((field) => !field.isValid);
  }
}
