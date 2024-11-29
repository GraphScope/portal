import React, { useState } from 'react';
import { Flex, Select, DatePicker, Typography } from 'antd';
import { SearchOutlined, DownOutlined } from '@ant-design/icons';
import useStore from './useStore';
import type { IState } from './job-list';
import CircleAnimation from './circle-animation';

const { RangePicker } = DatePicker;
interface IJobHeaderProps extends Partial<IState> {
  onChange: (val, type) => void;
}
const { Text } = Typography;
const JobHeader: React.FC<IJobHeaderProps> = ({ typeOptions, searchOptions, onChange }) => {
  const [state, updateState] = useState({
    statusValue: [],
  });
  const { statusValue } = state;
  const { STATUSOPTIONS } = useStore();
  return (
    <Flex gap={12}>
      <Select
        placeholder="Select JobId"
        prefix={<SearchOutlined />}
        suffixIcon={<DownOutlined />}
        mode="tags"
        maxTagCount={1}
        style={{ flex: 2 }}
        onChange={evt => onChange(evt, 'search')}
        tokenSeparators={[',']}
        options={searchOptions}
      />
      <RangePicker style={{ flex: 1 }} onChange={evt => onChange(evt, 'picker')} />
      <Select placeholder="JobType" style={{ flex: 1 }} onChange={evt => onChange(evt, 'type')} options={typeOptions} />
      <Select
        prefix={<CircleAnimation statusValue={statusValue} />}
        suffixIcon={
          <>
            <Text type="secondary">Status</Text>
            <DownOutlined />
          </>
        }
        style={{ flex: 2 }}
        mode="tags"
        value={statusValue}
        maxTagCount={2}
        onChange={evt => {
          onChange(evt, 'status');
          updateState(preset => {
            return {
              ...preset,
              statusValue: evt,
            };
          });
        }}
        options={STATUSOPTIONS}
      />
    </Flex>
  );
};

export default JobHeader;
