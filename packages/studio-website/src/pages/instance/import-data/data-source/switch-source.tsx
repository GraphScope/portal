import React from 'react';
import { Input, Space } from 'antd';
import UploadFiles from './upload-file';
import { useIntl } from 'react-intl';
interface ISwitchSourceProps {
  filelocation?: string;
  currentType?: string;
  onChangeType: (e: any) => void;
  onChangeValue: (e: string, isUpload: boolean) => void;
  onChangeFocus: (e: any) => void;
  onChangeDataFields: (header?: { dataFields: string[]; delimiter: string }) => void;
}
const SwitchSource: React.FunctionComponent<ISwitchSourceProps> = props => {
  const { filelocation, onChangeFocus, onChangeValue, onChangeDataFields } = props;
  const intl = useIntl();
  return (
    <Space.Compact size="small">
      <>
        <UploadFiles value={filelocation} onChange={onChangeValue} onChangeHeader={onChangeDataFields} />
        {!filelocation && (
          <Input
            style={{ width: '400px' }}
            defaultValue={filelocation}
            placeholder={intl.formatMessage({ id: 'Please manually input the odps file location' })}
            onBlur={e => {
              onChangeValue(e.target.value, false);
            }}
            onFocus={onChangeFocus}
          />
        )}
      </>
    </Space.Compact>
  );
};

export default SwitchSource;
