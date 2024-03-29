import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import { FormattedMessage } from 'react-intl';

const { Dragger } = Upload;
type IUploadFile = {
  handleChange(val: any): void;
};
const UploadFiles: React.FC<IUploadFile> = ({ handleChange }) => {
  const [uploadName, setUploadName] = useState('');
  const props: UploadProps = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    // showUploadList: false,
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    async onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        const content = await readFile(info.file.originFileObj);
        handleChange(content);
        setUploadName(info.file.name);
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };
  /** 转换上传文件 */
  const readFile = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };
  let Content;
  // if (uploadName) {
  //   Content = <p>{uploadName}</p>;
  // } else {
  Content = (
    <>
      <p className="ant-upload-text">
        <FormattedMessage id="Click or drag file to this area to upload" />
      </p>
      <p className="ant-upload-hint">
        <FormattedMessage id="Your data may be passed to a third party (e.g., OpenAI) for AI processing. Consider the risks carefully when handling sensitive data." />
      </p>
    </>
  );
  // }

  return <Dragger {...props}>{Content}</Dragger>;
};

export default UploadFiles;
