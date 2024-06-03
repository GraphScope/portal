import React, { useState } from 'react';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, Upload, Flex, Input, Space } from 'antd';
import { FormattedMessage } from 'react-intl';
import { getDataFields } from '../utils/getDataFields';
type UploadFilesProps = {
  onChange: (filelocation: string, isUpload: boolean) => void;
  value?: string;
  onChangeHeader: (header?: { dataFields: string[]; delimiter: string }) => void;
  handleChange?: (val: boolean) => void;
  uploadFile(file): { file_path: string };
};
const UploadFiles: React.FC<UploadFilesProps> = props => {
  const { onChange, value, onChangeHeader, uploadFile } = props;
  const [state, updateState] = useState({
    isLoading: false,
  });
  const { isLoading } = state;

  const customRequest: UploadProps['customRequest'] = async options => {
    const { file } = options;
    updateState(preState => {
      return {
        ...preState,
        isLoading: true,
      };
    });
    const { file_path } = (await uploadFile(file as File)) || '';
    const headers = await getDataFields(file as File);
    updateState(preState => {
      return {
        ...preState,
        isLoading: false,
      };
    });
    onChange(file_path, true);
    onChangeHeader(headers);
  };
  return (
    <Flex justify="flex-start" align="center">
      {isLoading && <LoadingOutlined />}
      <Space.Compact size="small">
        <Upload showUploadList={false} customRequest={customRequest}>
          <Button icon={<UploadOutlined style={{ marginRight: '2px' }} />}>
            <span style={{ fontSize: '12px' }}>
              <FormattedMessage id="Upload" />
            </span>
          </Button>
        </Upload>
        {value && <Input style={{ width: '100%' }} disabled value={value} />}
      </Space.Compact>
    </Flex>
  );
};

export default UploadFiles;
