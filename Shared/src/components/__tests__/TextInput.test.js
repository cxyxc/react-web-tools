import React from 'react';
import { shallow } from 'enzyme';
import TextInput from '../TextInput';
import { Input } from 'antd';

const Textarea = Input.TextArea;

describe("TextInput", () => {
    test("default should render Input", () => {
        const wrapper = shallow(<TextInput />);
        expect(wrapper.find(Input)).toHaveLength(1);
        expect(wrapper.find(Textarea)).toHaveLength(0)
    })
    test("should render Textarea when [type=textarea]", () => {
        const props = {
            type: "textarea"
        }
        const wrapper = shallow(<TextInput {...props} />);
        expect(wrapper.find(Input)).toHaveLength(0);
        expect(wrapper.find(Textarea)).toHaveLength(1);
    })
})