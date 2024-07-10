import React from 'react';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import { FormattedMessage } from 'react-intl';
import { InboxOutlined } from '@ant-design/icons';
import { Utils } from '@graphscope/studio-components';

const { Dragger } = Upload;
type IUploadFile = {
  disabled: boolean;
  handleChange(val: any): void;
};
const UploadFiles: React.FC<IUploadFile> = ({ disabled, handleChange }) => {
  const customRequest: UploadProps['customRequest'] = async options => {
    const { file } = options;
    const { name } = file as File;
    try {
      const content = await Utils.parseFile(file as File);
      handleChange(content);
      message.success(`${name} file uploaded successfully.`);
    } catch (error) {
      message.error(`${name} file upload failed.`);
    }
  };
  const onDrop = (e: { dataTransfer: { files: any } }) => {
    console.log('Dropped files', e.dataTransfer.files);
  };
  return (
    <Dragger disabled={disabled} showUploadList={false} multiple={true} onDrop={onDrop} customRequest={customRequest}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        <FormattedMessage id="Click or drag file to this area to upload" />
      </p>
      <p className="ant-upload-hint">
        <FormattedMessage id="Your can upload or simply drag and drop files pertinent to creating plugin statements." />
      </p>
    </Dragger>
  );
};

export default UploadFiles;
