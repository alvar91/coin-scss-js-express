import Observer from "../utils/observer.js";
import { InitiateTransactionFields } from "../const.js";

export default class FormTransactionModel extends Observer {
  constructor() {
    super();

    this._formTransactionFields = InitiateTransactionFields();
    this._errorTransactionMessages = [];
  }

  mapFieldsForServer() {
    const data = {};

    this.getFields().forEach((field) => (data[field.name] = field.value));

    return data;
  }

  resetFields() {
    this._formTransactionFields = InitiateTransactionFields();
  }

  getField(id) {
    return this._formTransactionFields.find((item) => item.id === id);
  }

  getFields() {
    return this._formTransactionFields;
  }

  setFields(newFields) {
    return (this._formTransactionFields = newFields);
  }

  getFieldsCount() {
    return this._formTransactionFields.length;
  }

  getErrorMessages() {
    return this._errorTransactionMessages;
  }

  resetErrorMessages() {
    return (this._errorTransactionMessages = []);
  }

  setError(error) {
    if (this._errorTransactionMessages.includes(error)) return;

    this._errorTransactionMessages.push(error);
  }

  deleteError(newError) {
    this._errorTransactionMessages = this._errorTransactionMessages.filter(
      (error) => newError !== error
    );
  }

  resetError() {
    this._errorTransactionMessages = [];
  }

  setField(updateType, newField) {
    this._formTransactionFields = this._formTransactionFields
      .slice()
      .concat([newField]);

    this._notify(updateType);
  }

  setTransaction(updateType, accountId) {
    this._notify(updateType, { isLoading: false, accountId });
  }

  updateField(updateType, update) {
    const index = this._formTransactionFields.findIndex(
      (field) => field.id === update.id
    );

    if (index === -1) {
      throw new Error(`Can't update nonexistent field`);
    }

    this._formFields = [
      ...this._formTransactionFields.slice(0, index),
      update,
      ...this._formTransactionFields.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  deleteField(updateType, updateId) {
    const index = this._formTransactionFields.findIndex(
      (field) => field.id === updateId
    );
    if (index === -1) {
      throw new Error(`Can't delete nonexistent field`);
    }

    this._formTransactionFields = [
      ...this._formTransactionFields.slice(0, index),
      ...this._formTransactionFields.slice(index + 1),
    ];

    this._notify(updateType, updateId);
  }

  isFormValid() {
    return this._formTransactionFields.some((field) => !field.isValid);
  }
}
