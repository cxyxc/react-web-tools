import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Button, Alert, Divider} from 'antd';
import WrappedTag from './WrappedTag';
import {formatMessage, FormattedMessage} from './localize';

const marginTop = {
    marginTop: '8px'
};
const confirmBtnStyle = {
    textAlign: 'right'
};
const alertStyle = {
    marginBottom: '8px'
};
const lengthLinkStyle = {
    userSelect: 'none'
};
const clearLinkStyle = {
    color: '#ff4d4f',
    userSelect: 'none'
};

class MultiSelectAlert extends Component {
  static propTypes = {
      onConfirm: PropTypes.func.isRequired,
      onDelete: PropTypes.func.isRequired,
      onDeleteAll: PropTypes.func.isRequired,
      data: PropTypes.arrayOf(
          PropTypes.shape({
              value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
              text: PropTypes.string
          })
      ),
      type: PropTypes.string
  };
  static defaultProps = {
      type: 'info'
  };
  state = {
      showTags: false
  };
  toggleShowTags = () => {
      this.setState({
          showTags: !this.state.showTags
      });
  };
  render() {
      const {data, onConfirm, onDelete, onDeleteAll, type} = this.props;
      const lengthInfo = (
          formatMessage({
              id: 'alertMessage.multi.selectedInfo',
              defaultMessage: '已选择{length}项'
          }, {
              length: data ? data.length : 0
          })
      );
      const message = (
          <div>
              <Row>
                  <Col span={18}>
                      <a style={lengthLinkStyle} onClick={this.toggleShowTags}>{lengthInfo}</a>
                      <Divider type="vertical"/>
                      <a style={clearLinkStyle} onClick={onDeleteAll}>
                          {formatMessage({
                              id: 'selectAlert.operate.clear',
                              defaultMessage: '清除选择'
                          })}
                      </a>
                  </Col>
                  <Col span={6} style={confirmBtnStyle}>
                      <Button size="small" type="primary" onClick={onConfirm}>
                          {formatMessage({
                              id: 'btn.confirm',
                              defaultMessage: '确认'
                          })}
                      </Button>
                  </Col>
              </Row>
              {this.state.showTags && data && data.length > 0 && (
                  <div style={marginTop}>
                      {data.map(r => (
                          <WrappedTag
                              key={r.value}
                              closable
                              id={r.value}
                              onClose={onDelete}>
                              {r.text}
                          </WrappedTag>
                      ))}
                  </div>
              )}
          </div>
      );
      return <Alert style={alertStyle} showIcon type={type} message={message} />;
  }
}

// eslint-disable-next-line react/prefer-stateless-function
class SelectAlert extends Component {
  static propTypes = {
      onConfirm: PropTypes.func.isRequired,
      onDelete: PropTypes.func.isRequired,
      data: PropTypes.arrayOf(
          PropTypes.shape({
              value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
              text: PropTypes.string
          })
      ),
      type: PropTypes.string
  };
  static defaultProps = {
      type: 'info'
  };
  render() {
      const {data, onConfirm, onDelete, type} = this.props;
      const selectedTag =
      data && data.length > 0 ? (
          <WrappedTag
              key={data[0].value}
              id={data[0].value}
              closable
              onClose={onDelete}>
              {data[0].text}
          </WrappedTag>
      ) : null;
      const singleTemplatePart1 = formatMessage({
          id: 'alertMessage.single',
          defaultMessage: '可以双击行选择'
      });
      const singleTemplatePart2 = (
          <FormattedMessage
              id="alertMessage.selectedData"
              defaultMessage="，已选择 {tag}"
              values={{
                  tag: selectedTag
              }}/>
      );
      const content = (
          <div>
              {singleTemplatePart1}
              {data && data.length > 0 && singleTemplatePart2}
          </div>
      );
      const message = (
          <Row>
              <Col span={18}>{content}</Col>
              <Col span={6} style={confirmBtnStyle}>
                  <Button size="small" type="primary" onClick={onConfirm}>
                      {formatMessage({
                          id: 'btn.confirm',
                          defaultMessage: '确认'
                      })}
                  </Button>
              </Col>
          </Row>
      );
      return <Alert style={alertStyle} message={message} showIcon type={type} />;
  }
}

SelectAlert.Multi = MultiSelectAlert;

export default SelectAlert;
