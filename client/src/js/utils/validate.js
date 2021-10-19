import {
  ValidationType,
  MIN_PASSWORD_LENGTH,
  MIN_ACCOUNT_NUMBER_LENGTH,
} from "../const.js";

const isNotEmpty = ({ value }) => {
  return !!value.trim();
};

const isLengthMoreThan6 = ({ value }) => {
  return value.trim().length >= MIN_PASSWORD_LENGTH;
};

const isLengthIs26 = ({ value }) => {
  return value.trim().length === MIN_ACCOUNT_NUMBER_LENGTH;
};

const isValueMoreThanAccountHave = ({ value }, currentAccount) => {
  return value.trim() <= currentAccount.balance && currentAccount.balance > 0;
};

const notEqualFromAndTo = ({ value }, currentAccount) => {
  return value.trim() !== currentAccount.account;
};

export const validationMethods = ({ method, field, currentAccount }) => {
  switch (method) {
    case ValidationType.notEmpty:
      return isNotEmpty(field);
    case ValidationType.isLengthMoreThan6:
      return isLengthMoreThan6(field);
    case ValidationType.isLengthIs26:
      return isLengthIs26(field);
    case ValidationType.isValueMoreThanAccountHave:
      return isValueMoreThanAccountHave(field, currentAccount);
    case ValidationType.notEqualFromAndTo:
      return notEqualFromAndTo(field, currentAccount);
    default:
      break;
  }
};

const allowSymbols = /^[а-яА-ЯёЁa-zA-Z0-9-]+$/g;

export const formatInput = (field) => {
  field = field
    .split("")
    .filter((char) => char.match(allowSymbols) !== null)
    .join("")
    .trim()
    .toLowerCase()
    .replace(/^-+/g, "")
    .replace(/-+$/g, "")
    .replace(/ +(?= )/g, "")
    .replace(/-+/g, "-");

  return field;
};

const allowTransactionSymbols = /^[0-9]+$/g;

export const formatTransactionInput = (field) => {
  field = field
    .split("")
    .filter((char) => char.match(allowTransactionSymbols) !== null)
    .join("")
    .trim()
    .toLowerCase()
    .replace(/\b0+/g, "");

  return field;
};
