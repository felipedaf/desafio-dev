import TransactionType from '../../enums/transaction.enum';

export default (registration) => {
  const formattersKeys = Object.keys(formatters);

  let result = {};
  formattersKeys.forEach((key) => {
    const formatter: () => any = formatters[key];
    const args = [result, registration];

    result = formatter.apply(this, args);

    return result;
  });

  return result;
};

const formatters = {
  type: (transaction, registration: string) => {
    const registrationType = registration[0];

    const transactionTypes = {
      '1': TransactionType.DEBIT,
      '2': TransactionType.BANK_SLIP,
      '3': TransactionType.FINANCING,
      '4': TransactionType.CREDIT,
      '5': TransactionType.LOAN,
      '6': TransactionType.SALE,
      '7': TransactionType.TED,
      '8': TransactionType.DOC,
      '9': TransactionType.RENT,
    };

    const selectedType = transactionTypes[registrationType];

    return { ...transaction, type: selectedType };
  },
  value: (transaction, registration: string) => {
    const registrationValue = registration.substring(9, 19);

    const parsedValue = Number(registrationValue) / 100;

    return { ...transaction, value: parsedValue };
  },
  cpf: (transaction, registration: string) => {
    const registrationCpf = registration.substring(19, 30);

    return { ...transaction, cpf: registrationCpf };
  },
  creditCard: (transaction, registration: string) => {
    const registrationCreditCard = registration.substring(30, 42);

    return { ...transaction, creditCard: registrationCreditCard };
  },
  timestamp: (transaction, registration: string) => {
    const registrationDate = registration.substring(1, 9);
    const registrationHour = registration.substring(42, 48);

    const year = registrationDate.substring(0, 4);
    const month = registrationDate.substring(4, 6);
    const day = registrationDate.substring(6, 8);

    const hour = registrationHour.substring(0, 2);
    const minute = registrationHour.substring(2, 4);
    const seconds = registrationHour.substring(4, 6);

    const date = new Date();

    date.setFullYear(Number(year), Number(month), Number(day));
    date.setHours(Number(hour), Number(minute), Number(seconds));

    return { ...transaction, timestamp: date };
  },
  store: (transaction, registration: string) => {
    const registrationStoreOwner = registration.substring(48, 62).trim();
    const registrationStoreName = registration.substring(62, 81).trim();

    const store = {
      owner: registrationStoreOwner,
      name: registrationStoreName,
    };

    return { ...transaction, store };
  },
};
