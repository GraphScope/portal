import React from 'react';
import { Select, Input, Space } from 'antd';
import UploadFiles from './upload-file';
interface ISwitchSourceProps {
  filelocation?: string;
  currentType?: string;
  onChangeType: (e: any) => void;
  onChangeValue: (e: any) => void;
  onFocus: (e: any) => void;
  onChangeDataFields: (header?: { dataFields: string[]; delimiter: string }) => void;
}
const SOURCEOPTIONS = [
  { label: 'csv', value: 'csv' },
  { label: 'location', value: 'location' },
  { label: 'odps', value: 'odps', disabled: true },
];
const SwitchSource: React.FunctionComponent<ISwitchSourceProps> = props => {
  const { filelocation, currentType, onChangeType, onChangeValue, onFocus, onChangeDataFields } = props;

  return (
    <Space.Compact size="small">
      <Select defaultValue={currentType} options={SOURCEOPTIONS} onChange={onChangeType} style={{ width: '94px' }} />
      <>
        {currentType === 'odps' && (
          <Input
            style={{ width: '400px' }}
            defaultValue={filelocation}
            placeholder="Please manually input the odps file location"
            onChange={e => {
              onChangeValue(e.target.value);
            }}
            onFocus={onFocus}
          />
        )}
        {currentType === 'location' && (
          <Input
            style={{ width: '400px' }}
            defaultValue={filelocation}
            placeholder="Please manually input the server-side file location"
            onChange={e => {
              onChangeValue(e.target.value);
            }}
            onFocus={onFocus}
          />
        )}
        {currentType === 'csv' && (
          <UploadFiles value={filelocation} onChange={onChangeValue} onChangeHeader={onChangeDataFields} />
        )}
      </>
    </Space.Compact>
  );
};

export default SwitchSource;
