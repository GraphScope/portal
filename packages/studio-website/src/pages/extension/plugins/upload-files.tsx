import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';

const { Dragger } = Upload;
type IUploadFile = {
  handleChange(val: { name: string }): void;
};
const UploadFiles: React.FC<IUploadFile> = ({ handleChange }) => {
  const [uploadName, setUploadName] = useState('');
  const props: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        handleChange(info);
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
  let Content;
  if (uploadName) {
    Content = <p>{uploadName}</p>;
  } else {
    Content = (
      <>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.
        </p>
      </>
    );
  }

  return <Dragger {...props}>{Content}</Dragger>;
};

export default UploadFiles;
