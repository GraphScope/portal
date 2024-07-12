import React from 'react';
import type { UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload, Button, Divider } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Utils } from '@graphscope/studio-components';

const { Dragger } = Upload;
type IUploadFile = {
  disabled: boolean;
  editCode: string;
  handleChange(val: any): void;
};
const UploadFiles: React.FC<IUploadFile> = ({ disabled, editCode, handleChange }) => {
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
    <>
      <Upload showUploadList={false} customRequest={customRequest}>
        <Button>
          <FormattedMessage id="Upload" />
        </Button>
      </Upload>
      <Divider />
      {!editCode && (
        <div style={{ height: '320px' }}>
          <Dragger
            disabled={disabled}
            showUploadList={false}
            multiple={true}
            onDrop={onDrop}
            customRequest={customRequest}
          >
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
        </div>
      )}
    </>
  );
};

export default UploadFiles;
