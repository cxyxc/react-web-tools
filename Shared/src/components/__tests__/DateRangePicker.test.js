import React from 'react';
import { shallow } from 'enzyme';
import { DateRangePicker } from '../DateRangePicker';
import moment from 'moment';

describe("DateRangePicker", () => {
    const props = {
        name: "createTime",
        onChange: jest.fn(),
        intl: {
            formatMessage: jest.fn()
        }
    }
    const wrapper = shallow(<DateRangePicker {...props} />);
    const tmpProps = wrapper.props();
    test("default props", () => {
        expect(tmpProps.showTime).toBeFalsy();
        expect(tmpProps.format).toBe('L');
    })

    test("onChange shoud receive date start and end Of  day by default", () => {
        const date1 = moment("2018-07-22 08:32:36");
        const date2 = moment("2018-07-25 16:32:36");
        tmpProps.onChange([date1, date2]);
        const args = props.onChange.mock.calls[0][0];
        expect(args[0]).toEqual(date1.startOf('day').toDate());
        expect(args[1]).toEqual(date2.endOf('day').toDate());
    })
})