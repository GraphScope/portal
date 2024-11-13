import React from 'react';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import { FormattedMessage } from 'react-intl';
import js_yaml from 'js-yaml';
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
    const { type, name } = file as File;
    if (type === 'application/x-yaml') {
      try {
        const content = await Utils.parseFile(file as File);
        const data = js_yaml.load(content);
        handleChange(data);
        message.success(`${name} file uploaded successfully.`);
      } catch (error) {
        message.error(`${name} file upload failed.`);
      }
    }
    if (type === '') {
      try {
        const content = await Utils.parseFile(file as File);
        const data = {
          name: '',
          type: 'cypher',
          bound_graph: '',
          query: content,
          instance: '',
          description: '',
        };
        handleChange(data);
        message.success(`${name} file uploaded successfully.`);
      } catch (error) {
        message.error(`${name} file upload failed.`);
      }
    }
  };
  const onDrop = (e: { dataTransfer: { files: any } }) => {
    console.log('Dropped files', e.dataTransfer.files);
  };
  return (
    <div style={{ height: '150px', marginBottom: '12px' }}>
      <Dragger
        disabled={disabled}
        accept={'.yaml,.cypher'}
        showUploadList={false}
        onDrop={onDrop}
        customRequest={customRequest}
      >
        <p className="ant-upload-text">
          <FormattedMessage id="Click or drag file to this area to upload" />
        </p>
        <p className="ant-upload-hint">
          <FormattedMessage id="Your can upload or simply drag and drop files pertinent to creating plugin statements." />
        </p>
      </Dragger>
    </div>
  );
};

export default UploadFiles;
