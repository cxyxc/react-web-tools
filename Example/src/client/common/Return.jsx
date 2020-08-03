import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Popconfirm, Button} from 'antd';
import {formatMessage} from './localize';

class Return extends PureComponent {
  state = {
      showWarningPopconfim: false
  };
  onClickReturnBtn = () => {
      if(this.props.disabled)
          return;
      if(this.props.showWarning)
          this.setState({showWarningPopconfim: true});
      else this.props.onConfirm();
  };
  onClickCancelOnPopConfirm = () => {
      this.setState({showWarningPopconfim: false});
  };
  onClickOkOnPopconfirm = () => {
      this.setState({showWarningPopconfim: false});
      this.props.onConfirm();
  };
  onPopconfirmVisibleChange = visible => {
      if(this.props.disabled || !this.props.showWarning)
          this.setState({showWarningPopconfim: false});
      else
          this.setState({showWarningPopconfim: visible});
  };
  render() {
      const {popconfirm, children, disabled} = this.props;
      const {
          onConfirm,
          onCancel,
          visible,
          onVisibleChange,
          ...rest
      } = popconfirm;
      return (
          <Popconfirm
              onConfirm={this.onClickOkOnPopconfirm}
              onCancel={this.onClickCancelOnPopConfirm}
              visible={this.state.showWarningPopconfim}
              onVisibleChange={this.onPopconfirmVisibleChange}
              {...rest}>
              <Button
                  type="primary"
                  disabled={disabled}
                  onClick={this.onClickReturnBtn}>
                  {children}
              </Button>
          </Popconfirm>
      );
  }
}

Return.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    children: PropTypes.node,
    disabled: PropTypes.bool,
    popconfirm: PropTypes.object,
    showWarning: PropTypes.bool
};

Return.defaultProps = {
    disabled: false,
    showWarning: false,
    children: formatMessage({
        id: 'return.children',
        defaultMessage: '返回'
    }),
    popconfirm: {
        placement: 'left',
        title: formatMessage({
            id: 'return.popconfirm.title',
            defaultMessage: '当前页面有尚未提交的改动，是否确认离开？'
        })
    }
};

export default Return;
