import React, { useState } from 'react';
import { DeleteOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, Upload, Flex, theme, Input, Tooltip } from 'antd';
const { useToken } = theme;
import { uploadFile } from '../service';
import { getDataFields } from '@/components/utils/getDataFields';
type UploadFilesProps = {
  onChange: (filelocation: string) => void;
  value?: string;
  onChangeHeader: (header?: { dataFields: string[]; delimiter: string }) => void;
};
const UploadFiles: React.FC<UploadFilesProps> = props => {
  const { token } = useToken();
  const { onChange, value, onChangeHeader } = props;

  const [state, updateState] = useState({
    isLoading: false,
    filelocation: value || '',
  });
  const { isLoading, filelocation } = state;

  const customRequest: UploadProps['customRequest'] = async options => {
    const { file } = options;
    updateState(preState => {
      return {
        ...preState,
        isLoading: true,
      };
    });
    const filelocation = (await uploadFile(file as File)) || '';
    const headers = await getDataFields(file as File);
    updateState(preState => {
      return {
        ...preState,
        isLoading: false,
        filelocation,
      };
    });

    onChange && onChange(filelocation);
    onChangeHeader && onChangeHeader(headers);
  };
  /** 删除文件 */
  const deleteFile = () => {
    updateState(preState => {
      return {
        ...preState,
        isLoading: false,
        filelocation: '',
      };
    });
    onChange && onChange('');
    onChangeHeader && onChangeHeader();
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
