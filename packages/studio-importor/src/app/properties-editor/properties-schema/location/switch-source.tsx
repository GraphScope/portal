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
  /** 上传接口 */
  uploadFile(file): { file_path: string };
}
const SwitchSource: React.FunctionComponent<ISwitchSourceProps> = props => {
  const { filelocation, onChangeFocus, onChangeValue, onChangeDataFields } = props;
  const intl = useIntl();
  return (
    <Space.Compact size="small">
      <>
        <UploadFiles
          value={filelocation}
          onChange={onChangeValue}
          onChangeHeader={onChangeDataFields}
          uploadFile={props.uploadFile}
        />
        {!filelocation && (
          <Input
            style={{ width: '100%' }}
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
