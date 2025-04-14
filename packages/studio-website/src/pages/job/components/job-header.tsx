import React, { useState, useCallback } from 'react';
import { Flex, Select, DatePicker, Typography } from 'antd';
import { SearchOutlined, DownOutlined } from '@ant-design/icons';
import useStore from '../hooks/useStore';
import type { IState } from '../types';
import CircleAnimation from './circle-animation';

const { RangePicker } = DatePicker;
const { Text } = Typography;

interface IJobHeaderProps extends Partial<IState> {
  onChange: (val: any, type: string) => void;
}

const JobHeader: React.FC<IJobHeaderProps> = ({ typeOptions, searchOptions, onChange }) => {
  const [statusValue, setStatusValue] = useState<string[]>([]);
  const { STATUSOPTIONS } = useStore();

  /**
   * 处理状态筛选变化
   */
  const handleStatusChange = useCallback(
    (evt: string[]) => {
      onChange(evt, 'status');
      setStatusValue(evt);
    },
    [onChange],
  );

  /**
   * 渲染状态选择器的前缀
   */
  const renderStatusPrefix = useCallback(() => <CircleAnimation statusValue={statusValue} />, [statusValue]);

  /**
   * 渲染状态选择器的后缀
   */
  const renderStatusSuffix = useCallback(
    () => (
      <>
        <Text type="secondary">Status</Text>
        <DownOutlined />
      </>
    ),
    [],
  );

  return (
    <Flex gap={12}>
      {/* Job ID 搜索框 */}
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

      {/* 时间范围选择器 */}
      <RangePicker style={{ flex: 1 }} onChange={evt => onChange(evt, 'picker')} />

      {/* Job 类型选择器 */}
      <Select placeholder="JobType" style={{ flex: 1 }} onChange={evt => onChange(evt, 'type')} options={typeOptions} />

      {/* 状态选择器 */}
      <Select
        prefix={renderStatusPrefix()}
        suffixIcon={renderStatusSuffix()}
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
