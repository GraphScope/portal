import React, { useState } from 'react';
import { DeleteOutlined, PaperClipOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { Button, Upload, Typography, Flex, theme, Input, Tooltip } from 'antd';
const { Text } = Typography;
const { useToken } = theme;
import { uploadFile } from '../service';
type UploadFilesProps = {
  onChange: (filelocation: string) => void;
  value?: string;
};
const UploadFiles: React.FC<UploadFilesProps> = props => {
  const { token } = useToken();
  const { onChange, value } = props;

  const [state, updateState] = useState({
    isLoading: false,
    filelocation: value || '',
  });
  const { isLoading, filelocation } = state;

  const customRequest: UploadProps['customRequest'] = async options => {
    const { file } = options;

    console.log(file);
    updateState(preState => {
      return {
        ...preState,
        isLoading: true,
      };
    });
    const filelocation = (await uploadFile(file as File)) || '';
    updateState(preState => {
      return {
        ...preState,
        isLoading: false,
        filelocation,
      };
    });
    onChange && onChange(filelocation);
  };
  const deleteFile = () => {
    updateState(preState => {
      return {
        ...preState,
        isLoading: false,
        filelocation: '',
      };
    });
    onChange && onChange('');
  };

  return (
    <Flex justify="flex-start" align="center">
      {!filelocation && (
        <Upload showUploadList={false} customRequest={customRequest}>
          <Button icon={<UploadOutlined />}>please upload the local file to the server side</Button>
        </Upload>
      )}
      {isLoading && <LoadingOutlined />}
      {filelocation && <Input style={{ width: '400px' }} disabled value={filelocation} />}
      {filelocation && (
        <Tooltip title="delete and re-upload">
          <DeleteOutlined onClick={deleteFile} style={{ marginLeft: '12px' }} />
        </Tooltip>
      )}
    </Flex>
  );
};

export default UploadFiles;
