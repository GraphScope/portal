import { useCallback, useState } from 'react';
import { Button, Typography, Form, Space, DatePicker, Segmented, Flex, Tooltip } from 'antd';
import { CheckSquareOutlined, CloseSquareOutlined } from '@ant-design/icons';

import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';

import { listAlertMessages, IAlertMessages, updateAlertMessages } from '../service';
const { Text } = Typography;
const { RangePicker } = DatePicker;
type IInquireMessageProps = {
  selectedRowKeys: string[];
  selectedRows: string[];
  searchChange(val: IAlertMessages): void;
  resetChange(): void;
};
/** 处理时间格式 */
const getTimeRange = (value: string): [dayjs.Dayjs, dayjs.Dayjs] => {
  const [duration, unit] = value.split(' ');
  return [dayjs().subtract(Number(duration), unit), dayjs()];
};

const DateFilter = (props: IInquireMessageProps) => {
  const [form] = Form.useForm();
  const { selectedRowKeys, selectedRows, searchChange, resetChange } = props;
  const [state, updateState] = useState<{
    timePeriod: [dayjs.Dayjs, dayjs.Dayjs];
    segmentedValue: string;
  }>({
    //@ts-ignore
    timePeriod: [dayjs().subtract('1', 'Hour'), dayjs()],
    segmentedValue: '1 Hour',
  });
  const { timePeriod, segmentedValue } = state;
  /** 全选 Dealing ｜ Solved */
  const handleAllDealingSolved = useCallback(
    async (status: string) => {
      const params = {
        messages: selectedRows,
        batch_status: status,
        batch_delete: false,
      };
      await updateAlertMessages(params);
      resetChange();
    },
    [resetChange, selectedRows],
  );
  /** 保存 */
  const handleSubmit = useCallback(async () => {
    const values = form.getFieldsValue();
    const params: IAlertMessages = {
      ...values,
      startTime: dayjs(timePeriod[0]).format('YYYY-MM-DD HH:mm'),
      endTime: dayjs(timePeriod[1]).format('YYYY-MM-DD HH:mm'),
    };
    const res = await listAlertMessages(params);
    searchChange(res);
  }, [form, searchChange, timePeriod]);

  /** 选择固定时间值 */
  const handleChangeSegmented = useCallback((value: any) => {
    const timeRange = getTimeRange(value);
    updateState(preset => ({
      ...preset,
      timePeriod: timeRange,
      segmentedValue: value,
    }));
  }, []);
  /** 日期选择 */
  const onRangePickerChange = useCallback((value: [dayjs.Dayjs, dayjs.Dayjs] | [] | null) => {
    //@ts-ignore
    updateState(prevState => ({
      ...prevState,
      timePeriod: value || prevState.timePeriod,
    }));
  }, []);

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
                  icon={<CheckSquareOutlined />}
                  onClick={() => handleAllDealingSolved('dealing')}
                ></Button>
              </Tooltip>
              <Tooltip title="Solved">
                <Button
                  type="text"
                  disabled={selectedRowKeys.length === 0}
                  icon={<CloseSquareOutlined />}
                  onClick={() => handleAllDealingSolved('solved')}
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
            onChange={handleChangeSegmented}
          />
          <RangePicker
            value={timePeriod}
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            //@ts-ignore
            onCalendarChange={onRangePickerChange}
          />
        </Space>
        <Space>
          <Button
            onClick={() => {
              resetChange();
              handleChangeSegmented('1 Hour');
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
