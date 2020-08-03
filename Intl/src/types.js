import PropTypes from 'prop-types';

const {
    bool,
    number,
    string,
    oneOf,
} = PropTypes;

const localeMatcher = oneOf(['best fit', 'lookup']);
const narrowShortLong = oneOf(['narrow', 'short', 'long']);
const numeric2digit = oneOf(['numeric', '2-digit']);

export const dateTimeFormatPropTypes = {
    localeMatcher,
    formatMatcher: oneOf(['basic', 'best fit']),
  
    timeZone: string,
    hour12: bool,
  
    weekday: narrowShortLong,
    era: narrowShortLong,
    year: numeric2digit,
    month: oneOf(['numeric', '2-digit', 'narrow', 'short', 'long']),
    day: numeric2digit,
    hour: numeric2digit,
    minute: numeric2digit,
    second: numeric2digit,
    timeZoneName: oneOf(['short', 'long']),
};
  
export const numberFormatPropTypes = {
    localeMatcher,

    style: oneOf(['decimal', 'currency', 'percent']),
    currency: string,
    currencyDisplay: oneOf(['symbol', 'code', 'name']),
    useGrouping: bool,

    minimumIntegerDigits: number,
    minimumFractionDigits: number,
    maximumFractionDigits: number,
    minimumSignificantDigits: number,
    maximumSignificantDigits: number,
};
