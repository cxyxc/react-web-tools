import {Intl} from '@shsdt/web-intl';

const intl = new Intl(language => require(`./localizations/${language}.json`));

export const localize = intl.inject;

export const formatMessage = intl.formatMessage;
export const FormattedMessage = intl.FormattedMessage;

export const language = intl.language;

export const formatNumber = intl.formatNumber;

const number = formatNumber(1234.56).trim().replace(/[0-9]/g, '');
export const separator = Object.freeze({
    thousandsSeparator: number.slice(-2, -1),
    decimalSeparator: number.slice(-1)
});
