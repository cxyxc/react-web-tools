import {getLanguage} from './language';
import IntlMessageFormat from 'intl-messageformat';
import memoizeIntlConstructor from 'intl-format-cache';
import {filterProps} from './utils';
import {
    dateTimeFormatPropTypes,
    numberFormatPropTypes,
} from './types';

const language = getLanguage();
const DATE_TIME_FORMAT_OPTIONS = Object.keys(dateTimeFormatPropTypes);
const NUMBER_FORMAT_OPTIONS = Object.keys(numberFormatPropTypes);

export function formatMessage(
    localization,
    messageDescriptor = {},
    values = {}
) {
    const {id, defaultMessage} = messageDescriptor;

    let message = localization[id];
    if(!message) {
        console.warn(
            `[Intl] Error formatting message: "${id}" for language: "${language}"${
                defaultMessage ? ', using default message as fallback.' : ''}\n`);
        message = defaultMessage || '';
    }

    let formattedMessage = message;
    try {
        const formatter = memoizeIntlConstructor(IntlMessageFormat)(message, language);
        formattedMessage = formatter.format(values);
    } catch(e) {
        console.error(e);
    }
    return formattedMessage;
}

const defaultNumberFormat = {};
export function formatNumber(value, format = {}) {
    if(value === undefined || value === null) return '';
    try {
        const filteredOptions = filterProps(format, NUMBER_FORMAT_OPTIONS, defaultNumberFormat);
        const formatter = memoizeIntlConstructor(Intl.NumberFormat)(language, filteredOptions);
        return formatter.format(value);
    } catch(e) {
        console.error(e);
    }
    return String(value);
}


const defaultsDateTimeFormat = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
};

export function formatDateTime(value, format = {}) {
    if(value === undefined || value === null) return '';
    try {
        const filteredOptions = filterProps(format, DATE_TIME_FORMAT_OPTIONS, defaultsDateTimeFormat);
        const formatter = memoizeIntlConstructor(Intl.DateTimeFormat)(language, filteredOptions);
        return formatter.format(new Date(value));
    } catch(e) {
        console.error(e);
    }
    return String(value);
}
