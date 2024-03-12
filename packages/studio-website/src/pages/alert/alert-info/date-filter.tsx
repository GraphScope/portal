import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { Button, Typography, Form, Space, DatePicker, Segmented, Flex, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { listAlertMessages, IAlertMessages, updateAlertMessages } from '../service';
const { Text } = Typography;
const { RangePicker } = DatePicker;
type IInquireMessageProps = {
  selectedRowKeys: string[];
  searchChange(val: IAlertMessages): void;
  resetChange(): void;
};
const DateFilter = (props: IInquireMessageProps) => {
  const [form] = Form.useForm();
  const { selectedRowKeys, searchChange, resetChange } = props;
  const [state, updateState] = useState({
    //@ts-ignore
    timePeriod: [dayjs().subtract('1', 'Hour'), dayjs()],
    segmentedValue: '1 Hour',
  });
  const { timePeriod, segmentedValue } = state;
  /** 批量设置选中告警信息状态 */
  const allDealingSolved = async (val: 'dealing' | 'solved') => {
    const params = {
      messages: selectedRowKeys,
      batch_status: val,
      batch_delete: false,
    };
    await updateAlertMessages(params);
  };
  /** 查询操作 */
  const handleSubmit = async () => {
    const { severity, type, status } = form.getFieldsValue();
    const params: IAlertMessages = {
      type,
      status,
      severity,
      startTime: dayjs(timePeriod[0]).format('YYYY-MM-DD HH:mm'),
      endTime: dayjs(timePeriod[1]).format('YYYY-MM-DD HH:mm'),
    };
    const res = await listAlertMessages(params);
    searchChange(res);
  };

  /** 选择固定时间值 */
  const handleChange = (value: any) => {
    const time = value.split(' ');
    const rangePicker = [dayjs().subtract(time[0], time[1]), dayjs()];
    updateState(preset => {
      return {
        ...preset,
        timePeriod: rangePicker,
        segmentedValue: value,
      };
    });
  };
  /** 日期选择 */
  const rangePickerChange = (value: any, dateString: [string, string] | string) => {
    updateState(preset => {
      return {
        ...preset,
        timePeriod: value,
      };
    });
  };

  return (
    <>
      <Flex justify="space-between" align="center">
        <Space>
          {selectedRowKeys.length > 0 && (
            <>
              <Tooltip title="Dealing">
                <Button
                  type="text"
                  disabled={selectedRowKeys.length === 0}
                  icon={<FontAwesomeIcon icon={faFlag} />}
                  onClick={() => allDealingSolved('dealing')}
                ></Button>
              </Tooltip>
              <Tooltip title="Solved">
                <Button
                  type="text"
                  disabled={selectedRowKeys.length === 0}
                  icon={<FontAwesomeIcon icon={faCircleCheck} />}
                  onClick={() => allDealingSolved('solved')}
                ></Button>
              </Tooltip>
            </>
          )}
          <Text>
            <FormattedMessage id="Time" />:
          </Text>
          <Segmented
            value={segmentedValue}
            options={['1 Hour', '6 Hour', '12 Hour', '1 Day', '3 Day', '7 Day', '14 Day']}
            onChange={value => handleChange(value)}
          />
          <RangePicker
            //@ts-ignore
            value={timePeriod}
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            onCalendarChange={rangePickerChange}
          />
        </Space>
        <Space>
          <Button
            onClick={() => {
              resetChange();
              handleChange('1 Hour');
            }}
          >
            <FormattedMessage id="Reset" />
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            <FormattedMessage id="Search" />
          </Button>
        </Space>
      </Flex>
    </>
  );
};
export default DateFilter;
