import React, { useState } from 'react';
import { Flex, Select, DatePicker, Typography } from 'antd';
import { SearchOutlined, DownOutlined } from '@ant-design/icons';
import useStore from './useStore';
import type { IState } from './job-list';
import CircleAnimation from './circle-animation';

const { RangePicker } = DatePicker;
const { Text } = Typography;

interface IJobHeaderProps extends Partial<IState> {
  onChange: (val: any, type: string) => void;
}

const JobHeader: React.FC<IJobHeaderProps> = ({ typeOptions, searchOptions, onChange }) => {
  const [statusValue, setStatusValue] = useState<string[]>([]);
  const { STATUSOPTIONS } = useStore();

  const handleStatusChange = (evt: string[]) => {
    onChange(evt, 'status');
    setStatusValue(evt);
  };

  return (
    <Flex gap={12}>
      <Select
        placeholder="Select JobId"
        prefix={<SearchOutlined />}
        suffixIcon={<DownOutlined />}
        mode="tags"
        maxTagCount={1}
        style={{ flex: 4 }}
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
        labelRender={props =>
          `${String(props.value).charAt(0).toUpperCase()}${String(props.value).slice(1).toLowerCase()}`
        }
        maxTagCount={1}
        onChange={handleStatusChange}
        options={STATUSOPTIONS}
      />
    </Flex>
  );
};

export default JobHeader;
