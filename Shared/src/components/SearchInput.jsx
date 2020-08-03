import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Input, Button, Icon} from 'antd';
import styles from './SearchInput.css';

const InputGroup = Input.Group;
/*eslint-disable  react/prefer-stateless-function*/
//  使用场景：只能弹框选择单条数据，选择完后，回填到输入框的场景
class SearchInput extends PureComponent {
    render() {
        const allowClear = this.props.value &&  this.props.onClear;

        const inputClassName = allowClear 
            ? styles.input2
            :styles.input;
        return (
            <InputGroup compact key={allowClear} >
                <Input
                    className={inputClassName}
                    value={this.props.value}
                    disabled/>
                    {
                        allowClear &&
                        <Button
                            className={styles.btn}
                            onClick={this.props.onClear}>
                            <Icon type="close" />
                        </Button>
                    }
                <Button
                    className={styles.btn}
                    onClick={this.props.onClickSearchBtn}>
                    <Icon type="search" />
                </Button>
            </InputGroup>
        );
    }
}

SearchInput.propTypes = {
    value: PropTypes.string,
    // 当提供该函数 ，并且有值时显示 清除按钮
    onClear: PropTypes.func,
    onClickSearchBtn: PropTypes.func.isRequired
};
export default SearchInput;
