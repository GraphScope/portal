import React from 'react';
import { Input, Space } from 'antd';
import UploadFiles from './upload-file';
import { useContext } from '@/layouts/useContext';
interface ISwitchSourceProps {
  filelocation?: string;
  currentType?: string;
  onChangeType: (e: any) => void;
  onChangeValue: (e: any) => void;
  onChangeFocus: (e: any) => void;
  onChangeDataFields: (header?: { dataFields: string[]; delimiter: string }) => void;
}
const SwitchSource: React.FunctionComponent<ISwitchSourceProps> = props => {
  const { filelocation, onChangeFocus, onChangeValue, onChangeDataFields } = props;
  const { store } = useContext();
  const { locale } = store;
  let placeholder =
    locale === 'zh-CN'
      ? '请手动输入文件地址，也可直接上传本地 CSV 文件'
      : 'Please manually input the odps file location';
  return (
    <Space.Compact size="small">
      <>
        <UploadFiles value={filelocation} onChange={onChangeValue} onChangeHeader={onChangeDataFields} />
        {!filelocation && (
          <Input
            style={{ width: '400px' }}
            defaultValue={filelocation}
            placeholder={placeholder}
            onBlur={e => {
              onChangeValue(e.target.value);
            }}
            onFocus={onChangeFocus}
          />
        )}
      </>
    </Space.Compact>
  );
};

export default SwitchSource;
