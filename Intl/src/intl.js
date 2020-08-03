import React, {Component} from 'react';
import {formatMessage, formatNumber, formatDateTime} from './format';
import createFormattedMessage from './components/message';
import {getLanguage, getRtl} from './language';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {getDisplayName} from './utils';

const getLocalization = (fn, language) => {
    try {
        return fn(language);
    } catch(e) {
        return null;
    }
};

export class Intl {
    constructor(fn) {
        this.language = getLanguage();
        this.rtl = getRtl();
        this.localization = getLocalization(fn, this.language);
        if(!this.localization) {
            console.warn(
                `[Intl] Error: Not ${this.language} localization found`);
            this.localization = {};
        }
        this.formatMessage = this.formatMessage.bind(this);
        this.FormattedMessage = createFormattedMessage(this.formatMessage);
        this.inject = this.inject.bind(this);
        this.formatNumber = formatNumber;
        this.formatDateTime = formatDateTime;
    }

    formatMessage(
        messageDescriptor = {},
        values = {}
    ) {
        return formatMessage(this.localization, messageDescriptor, values);
    }

    inject(WrappedComponent) {
        const language = this.language;
        const rtl = this.rtl;
        const formatMessage = this.formatMessage;
        class InjectIntl extends Component {
            static displayName = `InjectIntl(${getDisplayName(WrappedComponent)})`;
            render() {
                const intl = {
                    language,
                    rtl,
                    formatMessage,
                    formatNumber,
                    formatDateTime
                };
                return <WrappedComponent intl={intl} {...this.props} />; 
            }
        };
        return hoistNonReactStatics(InjectIntl, WrappedComponent);
    }
}
