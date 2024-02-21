import React from 'react';
import { Flex, Select, Input, Space } from 'antd';
import UploadFiles from './upload-file';
interface ISwitchSourceProps {
  filelocation?: string;
  currentType?: string;
  onChangeType: (e: any) => void;
  onChangeValue: (e: any) => void;
  onFocus: (e: any) => void;
}
const SOURCEOPTIONS = [
  { label: 'local file', value: 'file' },
  { label: 'location', value: 'location' },
  { label: 'odps', value: 'odps', disabled: true },
];
const SwitchSource: React.FunctionComponent<ISwitchSourceProps> = props => {
  const { filelocation, currentType, onChangeType, onChangeValue, onFocus } = props;

  return (
    <Space.Compact size="small">
      <Select defaultValue={currentType} options={SOURCEOPTIONS} onChange={onChangeType} style={{ width: '94px' }} />
      <>
        {currentType === 'odps' && (
          <Input
            style={{ width: '400px' }}
            defaultValue={filelocation}
            placeholder="/graphscope/modern_graph/user.csv"
            onChange={onChangeValue}
            onFocus={onFocus}
          />
        )}
        {currentType === 'location' && (
          <Input
            style={{ width: '400px' }}
            defaultValue={filelocation}
            placeholder="/graphscope/modern_graph/user.csv"
            onChange={onChangeValue}
            onFocus={onFocus}
          />
        )}
        {currentType === 'file' && <UploadFiles onChange={onChangeValue} />}
      </>
    </Space.Compact>
  );
};

export default SwitchSource;
