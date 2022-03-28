import moment from "moment";

import { MY_BOOKS_QUERY } from "@/lib/apollo/queries";
import { createExpirationDate } from "@/lib/helpers/index";

const getBookById = (book, bookId) => book?.id === bookId;
const addTransaction = (transactions, transaction, bookId) =>
  transactions.some((transaction) => getBookById(transaction?.book, bookId))
    ? transactions
    : [transaction, ...transactions];
const removeTransaction = (transactions, bookId) =>
  transactions.filter((transaction) => !getBookById(transaction?.book, bookId));
const handleTransactions = (condition, transactions, transaction, bookId) =>
  condition
    ? removeTransaction(transactions, bookId)
    : addTransaction(transactions, transaction, bookId);

export const updateTransactionsCache = (
  cache,
  mutationResult,
  params,
  userId,
  isReturn
) => {
  const { data } = { ...mutationResult };
  const { backBook, takeBook } = { ...data };
  const { book_id, book } = { ...(isReturn ? backBook : takeBook) };

  const checkCacheData = cache.readQuery(params, true);
  const { checkBook } = { ...checkCacheData };

  cache.writeQuery({
    ...params,
    data: {
      ...checkCacheData,
      checkBook: {
        ...checkBook,
        is_free: isReturn,
        is_belongs: !isReturn,
      },
    },
  });

  const myBooksParams = {
    query: MY_BOOKS_QUERY,
    variables: { userId },
  };
  const myBooksCacheData = cache.readQuery(myBooksParams);
  const { taken = [], returned = [] } = { ...myBooksCacheData };

  const transactionsIds = [...taken, ...returned]
    .filter(({ id }) => Number.isInteger(id))
    .map(({ id }) => id);
  const newTransactionId =
    Math.max(...(transactionsIds.length > 0 ? transactionsIds : [0])) + 1;
  const newTransaction = {
    __typename: "own_transaction",
    id: newTransactionId,
    cr: moment().utc().toISOString(true),
    book,
  };
  const defaultOptions = [newTransaction, book_id];

  myBooksCacheData &&
    cache.writeQuery({
      ...myBooksParams,
      data: {
        taken: handleTransactions(isReturn, taken, ...defaultOptions),
        returned: handleTransactions(!isReturn, returned, ...defaultOptions),
      },
    });
};

export const createTransactionResponse = (isReturn, book, userId) => {
  const { id } = { ...book };

  return {
    [isReturn ? "backBook" : "takeBook"]: {
      __typename: isReturn ? "BackedBookModel" : "TakenBookModel",
      book_id: id,
      ...(isReturn
        ? { is_expired: false }
        : {
            expires: createExpirationDate(),
          }),
      book: {
        __typename: "book_hub",
        ...book,
        state: {
          __typename: "book_state_view",
          book_id: id,
          op_code: isReturn ? 0 : 1,
          user: {
            __typename: "user_hub",
            id: userId,
          },
        },
      },
    },
  };
};
