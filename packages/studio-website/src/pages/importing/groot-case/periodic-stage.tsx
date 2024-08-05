import React from 'react';
import { Form, DatePicker, Select } from 'antd';
import type { GetProps } from 'antd';
import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';
const REPEATOPTIONS = [
  {
    value: 'once',
    label: 'No repeat',
  },
  {
    value: 'day',
    label: 'Every day on the same time',
  },
  {
    value: 'week',
    label: 'Every week on the same time',
  },
];
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const disabledDate: RangePickerProps['disabledDate'] = current => {
  // Can not select days before today and today
  return current && current < dayjs().endOf('day').subtract(1, 'day');
};

const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

const disabledDateTime = () => ({
  disabledHours: () => range(0, 24).splice(0, dayjs().hour() - 1),
  disabledMinutes: () => range(0, dayjs().minute()),
  disabledSeconds: () => [0, 60],
});
const PeriodicStage = () => {
  return (
    <div style={{ minHeight: '290px' }}>
      <Form.Item label={<FormattedMessage id="Date" />} name="schedule">
        <DatePicker
          disabledDate={disabledDate}
          disabledTime={disabledDateTime}
          placeholder=" "
          showTime
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item label={<FormattedMessage id="Repeat" />} name="repeat">
        <Select options={REPEATOPTIONS} />
      </Form.Item>
    </div>
  );
};

export default PeriodicStage;
