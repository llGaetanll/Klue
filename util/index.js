/**
 * Returns whether an object {} is empty (has no keys and values)
 * @param {Object} obj
 * @returns {boolean}
 */
export const isEmptyObj = obj =>
  Object.keys(obj).length === 0 && obj.constructor === Object;

export const randFromInterval = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

/**
 * getDate returns the current date as unixTimestamp
 */
export const getDate = () => new Date().getTime();

/**
 * Formats a unix timestamp for use in session displays
 * @param {*} dateTime unix timestamp
 * @param {bool} useAmericanDate whether to format as mm/dd/yyyy or dd/mm/yyyy
 */
export const formatDate = (dateTime, useAmericanDate = false) => {
  dateTime = new Date(parseInt(dateTime)); // parse timestamp as date

  const d = dateTime.getDate();
  const m = dateTime.getMonth();
  const y = dateTime.getFullYear();

  const formatTime = t => `0${t}`.slice(-2); // allows for 01/04/2020 instead of 1/4/2020. consistency

  let date = useAmericanDate
    ? `${formatTime(m)}-${formatTime(d)}`
    : `${formatTime(d)}-${formatTime(m)}`;

  return date + `-${y}`;
};

/**
 * Rounds a number to n decimal places
 */
export const round = (number, decimalCount) => 
  Math.round(number * Math.pow(10, decimalCount)) / Math.pow(10, decimalCount);
