import React from 'react';
import { shallow } from 'enzyme';
import TextArea from "../TextArea";

describe("TextArea", () => {
    const props = {
        name: "vin",
        onChange: jest.fn(),
        onBlur: jest.fn()
    }
    const wrapper = shallow(<TextArea {...props} />);
    const div = wrapper.find('div');
    const Input = wrapper.find("Input");
    test("default props", () => {
        expect(div).toHaveLength(1);
        expect(div.props()).toHaveProperty("className");
        expect(Input).toHaveLength(1);
        expect(Input.props()).toHaveProperty('className');
        expect(Input.props().name).toBe(props.name);
    })
    test("props.onBlur should receive array", () => {
        const event = {
            target: {
                value: "a\nb\nc"
            }
        };

        Input.props().onChange(event);
        expect(wrapper.state().value).toHaveLength(3);
        expect(wrapper.state().value).toContain("a");
        Input.props().onBlur();
        expect(props.onBlur).toHaveBeenCalled();
        const args = props.onBlur.mock.calls[0];
        expect(args[0]).toHaveLength(3);
        expect(args[0]).toContain("a");
    })
});