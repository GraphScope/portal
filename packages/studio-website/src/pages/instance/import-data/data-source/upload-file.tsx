import React, { useState } from 'react';
import { DeleteOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, Upload, Flex, Input, Tooltip, Space } from 'antd';
import { uploadFile } from '../service';
import { getDataFields } from '@/components/utils/getDataFields';
type UploadFilesProps = {
  onChange: (filelocation: string) => void;
  value?: string;
  isEidtInput?: boolean;
  onChangeHeader: (header?: { dataFields: string[]; delimiter: string }) => void;
  handleChange: (val: boolean) => void;
};
const UploadFiles: React.FC<UploadFilesProps> = props => {
  const { onChange, value, isEidtInput, onChangeHeader, handleChange } = props;
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
    handleChange && handleChange(false);
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
    handleChange && handleChange(true);
  };

  return (
    <Flex justify="flex-start" align="center">
      {isLoading && <LoadingOutlined />}
      <Space.Compact size="small">
        <Upload showUploadList={false} customRequest={customRequest}>
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
        {!isEidtInput && <Input style={{ width: '400px' }} disabled value={value} />}
      </Space.Compact>
      {!isEidtInput && (
        <Tooltip title="delete and re-upload">
          <DeleteOutlined onClick={deleteFile} style={{ marginLeft: '12px' }} />
        </Tooltip>
      )}
    </Flex>
  );
};

export default UploadFiles;
