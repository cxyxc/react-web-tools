import React from 'react';
import {separator} from './localize';
import WrappedInputNumber from './WrappedInputNumber';

/*eslint-disable react/prop-types*/
const LocalizeInputNumber = ({decimalSeparator, ...rest}) =>
    <WrappedInputNumber decimalSeparator={separator.decimalSeparator} {...rest}/>;

export default LocalizeInputNumber;
