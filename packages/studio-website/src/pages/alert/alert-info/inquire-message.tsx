import React, { useState } from 'react';
import { Button, Typography, Form, Space, DatePicker, Segmented, Flex, Tooltip } from 'antd';
import moment from 'moment';
import { CheckSquareOutlined, CloseSquareOutlined } from '@ant-design/icons';
import type { UpdateAlertMessagesRequest } from '@graphscope/studio-server';
import { FormattedMessage } from 'react-intl';
import { useContext } from '../useContext';
import { listAlertMessages, IAlertMessages, updateAlertMessages } from '../service';
const { Text } = Typography;
const { RangePicker } = DatePicker;
type IInquireMessageProps = {};
const InquireMessage = (props: IInquireMessageProps) => {
  const [form] = Form.useForm();
  const { store, updateStore } = useContext();
  const { selectedRowKeys } = store;
  const [state, updateState] = useState({
    //@ts-ignore
    timePeriod: [moment().subtract(1, 'Day'), moment()],
    segmentedValue: '1 Hour',
  });
  const { timePeriod, segmentedValue } = state;
  const allDealingSolved = async (val: string) => {
    const params = {
      messages: selectedRowKeys,
      batch_status: val,
      batch_delete: false,
    };
    await updateAlertMessages(params);
  };
  const handleSubmit = async () => {
    const { severity, type, status } = form.getFieldsValue();
    const params: IAlertMessages = {
      type,
      status,
      severity,
      startTime: moment(timePeriod[0]).format('YYYY-MM-DD HH:mm'),
      endTime: moment(timePeriod[1]).format('YYYY-MM-DD HH:mm'),
    };
    const res = await listAlertMessages(params);
    updateStore(draft => {
      draft.alertInfo = res || [];
    });
  };
  const resetChange = () => {
    updateStore(draft => {
      draft.defaultFilteredValue = 'All';
      draft.selectedRowKeys = [];
    });
    handleChange('1 Hour');
  };
  const handleChange = (value: any) => {
    const time = value.split(' ');
    updateState(preset => {
      return {
        ...preset,
        timePeriod: [moment().subtract(time[0], time[1]), moment()],
        segmentedValue: value,
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
                  icon={<CheckSquareOutlined />}
                  onClick={() => allDealingSolved('dealing')}
                ></Button>
              </Tooltip>
              <Tooltip title="Solved">
                <Button
                  type="text"
                  disabled={selectedRowKeys.length === 0}
                  icon={<CloseSquareOutlined />}
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
          />
        </Space>
        <Space>
          <Button
            onClick={() => {
              resetChange();
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
export default InquireMessage;
