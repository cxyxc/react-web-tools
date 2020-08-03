import React from 'react';
import { shallow } from 'enzyme';
import {TagSelect} from "../TagSelect";
import { Tag } from 'antd';

const CheckableTag = Tag.CheckableTag;

describe("TagSelect", () => {
    test("default not show selectAll Tag and expand icon", () => {
        const props = {
            name: "status",
            options: [{
                text: "新建",
                value: 1
            }],
            value: [],
            onChange: jest.fn(),
            intl: {
                formatMessage: jest.fn()
            }
        }
        const wrapper = shallow(<TagSelect {...props} />);
        expect(wrapper.props().showSelectAll).toBeFalsy();
        expect(wrapper.props().expandable).toBeFalsy();
        expect(wrapper.find(CheckableTag)).toHaveLength(0);
        expect(wrapper.find('TagSelectOption')).toHaveLength(1);
    })
    test("show selectAll Tag when [showSelectAll=true]", () => {
        const props = {
            name: "status",
            options: [{
                text: "新建",
                value: 1
            }],
            value: [],
            showSelectAll: true,
            onChange: jest.fn(),
            intl: {
                formatMessage: jest.fn()
            }
        }
        const wrapper = shallow(<TagSelect {...props} />)
        expect(wrapper.props().showSelectAll).toBeFalsy();
        expect(wrapper.props().expandable).toBeFalsy();
        expect(wrapper.find(CheckableTag)).toHaveLength(1);
        expect(wrapper.find('TagSelectOption')).toHaveLength(1);
    })
    test("should transfer right args to props.onChange", () => {
        const props = {
            name: "status",
            options: [{
                text: "新建",
                value: 1
            }],
            value: [],
            showSelectAll: true,
            onChange: jest.fn(),
            intl: {
                formatMessage: jest.fn()
            }
        }
        const wrapper = shallow(<TagSelect {...props} />)
        const firstTagOption = wrapper.find('TagSelectOption');
        const firstTagOptionProps = firstTagOption.props();
        firstTagOptionProps.onChange(1, true);
        expect(props.onChange).toBeCalled();
        expect(props.onChange.mock.calls[0][0]).toEqual([1]);
    })
})