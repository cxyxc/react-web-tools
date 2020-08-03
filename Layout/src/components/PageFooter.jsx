import React from 'react';
import PropTypes from 'prop-types';
import './page-footer.css';

/*eslint-disable react/prefer-stateless-function */
class PageFooter extends React.PureComponent {
    render() {
        return (
            <div className="page-footer">
                <div className="page-footer-inner">
                    {this.props.copyright}
                </div>
            </div>
        );
    }
}

PageFooter.propTypes = {
    copyright: PropTypes.string,
};

export default PageFooter;
