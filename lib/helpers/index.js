import moment from "moment";

export const arrToString = (arr, filter, map) =>
  arr
    .filter(filter)
    .map(map || filter)
    .join(", ");

export const handleQueryArr = (query) =>
  Array.isArray(query) ? query?.[0] : query;

export const getPageUrl = () =>
  typeof window !== "undefined" && window.location.href;

export const isNotBlankStr = (str) => !!str?.trim().length;

export const checkIsExpired = (exp) =>
  Date.now() >= (exp * 1000 - 60000 || Date.now()); // Refresh the token a minute early to avoid latency issues

export const createExpirationDate = () =>
  moment().add(14, "d").utc().toISOString(true);
