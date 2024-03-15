import React from 'react';
import { Select, Input, Space } from 'antd';
import UploadFiles from './upload-file';
interface ISwitchSourceProps {
  filelocation?: string;
  currentType?: string;
  isEidtInput?: boolean;
  onChangeType: (e: any) => void;
  onChangeValue: (e: any) => void;
  onFocus: (e: any) => void;
  onBlur: (e: any) => void;
  handleIsEdit: (val: boolean) => void;
  onChangeDataFields: (header?: { dataFields: string[]; delimiter: string }) => void;
}
// const SOURCEOPTIONS = [
//   { label: 'csv', value: 'csv' },
//   { label: 'location', value: 'location' },
//   { label: 'odps', value: 'odps', disabled: true },
// ];
const SwitchSource: React.FunctionComponent<ISwitchSourceProps> = props => {
  const {
    filelocation,
    currentType,
    isEidtInput,
    // onChangeType,
    onChangeValue,
    onFocus,
    onBlur,
    onChangeDataFields,
    handleIsEdit,
  } = props;
  return (
    <Space.Compact size="small">
      {/* <Select value={currentType} disabled options={SOURCEOPTIONS} onChange={onChangeType} style={{ width: '94px' }} /> */}
      <>
        <UploadFiles
          value={filelocation}
          isEidtInput={isEidtInput}
          onChange={onChangeValue}
          onChangeHeader={onChangeDataFields}
          handleChange={handleIsEdit}
        />
        {isEidtInput && (
          <Input
            style={{ width: '400px' }}
            defaultValue={filelocation}
            placeholder="Please manually input the odps file location"
            onChange={e => {
              onChangeValue(e.target.value);
            }}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        )}
      </>
    </Space.Compact>
  );
};

export default SwitchSource;
