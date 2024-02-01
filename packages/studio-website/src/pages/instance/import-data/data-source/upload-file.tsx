import React, { useState } from 'react';
import { DeleteOutlined, PaperClipOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { Button, Upload, Typography, Flex, theme } from 'antd';
const { Text } = Typography;
const { useToken } = theme;
type UploadFilesProps = {
  onChange: (val:boolean) => void;
};
const UploadFiles: React.FC<UploadFilesProps> = props => {
  const { token } = useToken();
  const { onChange } = props;
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const handleChange: UploadProps['onChange'] = info => {
    let newFileList = [...info.fileList];
    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    newFileList = newFileList.slice(-2);
    // 2. Read from response and show file link
    newFileList = newFileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });
    setFileList(newFileList);
  };

  const prop = {
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    onChange: handleChange,
  };

  return (
    <Flex justify="flex-start" align="center">
      <Upload {...prop} showUploadList={false}>
        <Button icon={<UploadOutlined />} onClick={()=>onChange(true)}>Upload</Button>
      </Upload>
      {fileList.length > 0 && (
        <Text style={{ cursor: 'pointer', marginLeft: '12px', color: token.colorPrimary }}>
          <PaperClipOutlined />
          {fileList[0].name} <DeleteOutlined onClick={() => setFileList([])} />
        </Text>
      )}
    </Flex>
  );
};

export default UploadFiles;
