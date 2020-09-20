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

const formatSubsecond = number => ("00" + number).slice(-2 - 1, -1);
const format = number => ("0" + number).slice(-2);

/**
 * Format times from number of ms to hours:minutes:seconds:ms
 * @param {int} time number to be formatted
 * @returns an array of arrays containing hours, minutes, seconds, and milliseconds
 */
export const formatTime = (time, hasMS = true) => {
  if (time === undefined) return;

  const milliseconds = time;
  const seconds = Math.trunc(time / 1000);
  const minutes = Math.trunc(seconds / 60);
  const hours = Math.trunc(minutes / 60);

  const hrStr = (() => {
    if (hours === 0) 
      return;

    if (hours < 10) return `${hours % 60}`;

    return `${format(hours)}`;
  })();

  const minStr = (() => {
    if (minutes === 0)
      return;

    if (minutes < 10) return `${minutes % 60}`;

    return `${format(minutes % 60)}`;
  })();

  const secStr = seconds < 10 ? `${seconds % 60}` : `${format(seconds % 60)}`;
  const msStr = `${formatSubsecond(milliseconds % 1000)}`;

  return {
    h: hrStr,
    m: minStr,
    s: secStr,
    ms: hasMS ? msStr : null
  }
};


/**
 * Rounds a number to n decimal places
 */
export const round = (number, decimalCount) => 
  Math.round(number * Math.pow(10, decimalCount)) / Math.pow(10, decimalCount);

export const linInterpolation = (val, min, max) => 
  (val - min) / (max - min);

/**
 *
 * (min, 0)
 * (DEF_WEIGHT, 0.5)
 * (max, 1)
 *
 */
export const quadInterpolation = (index, min, max) => {
  const DEF_WEIGHT = 1;

  const a = Math.pow(min, 2);
  const b = min;
  const c = 1;
  const d = 0;

  const e = Math.pow(DEF_WEIGHT, 2);
  const f = DEF_WEIGHT;
  const g = 1;
  const h = 0.5;
  
  const i = Math.pow(max, 2);
  const j = max;
  const k = 1;
  const l = 1;

  const denom= (a * f * k) + (b * g * i) + (c * e * j) - (c * f * i) - (a * g * j) - (b * e * k);
  const aNum = (d * f * k) + (b * g * l) + (c * h * j) - (c * f * l) - (d * g * j) - (b * h * k);
  const bNum = (a * h * k) + (d * g * i) + (c * e * l) - (c * h * i) - (a * g * l) - (d * e * k);
  const cNum = (a * f * l) + (b * h * i) + (d * e * j) - (d * f * i) - (a * h * j) - (b * e * l);

  const x = aNum / denom;
  const y = bNum / denom;
  const z = cNum / denom;

  return x * Math.pow(index, 2) + y * index + z;
}
