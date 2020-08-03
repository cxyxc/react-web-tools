import React from 'react';
import { shallow } from 'enzyme';
import { CopyWrapper } from '../CopyWrapper';

describe("CopyWrapper 展示组件", () => {
    const props = {
        text: "编号",
        copiedTip: "成功",
        tooltip: {
            title: "点击复制"
        }
    }
    const wrapper = shallow(<CopyWrapper {...props} />);
    test('should have right struct ', () => {
        const Tooltip = wrapper.find('Tooltip');
        expect(Tooltip).toHaveLength(1);
        expect(Tooltip.props().title).toBe(props.tooltip.title);
        const Icon = wrapper.find('Icon');
        expect(Icon).toHaveLength(1);
        expect(Icon.props().type).toBe("copy");
    })
    test('when Click copy Icon state`s tip should change', () => {
        // mock document.execCommand
        document.execCommand = jest.fn();
        
        const Icon = wrapper.find('Icon');
        const iconProps = Icon.props();
        expect(iconProps).toHaveProperty("onClick");
        iconProps.onClick();
        expect(wrapper.state().tip).toBe(props.copiedTip);
    })
})