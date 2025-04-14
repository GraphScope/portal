import React from 'react';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import { FormattedMessage } from 'react-intl';
import js_yaml from 'js-yaml';
import { Utils } from '@graphscope/studio-components';

const { Dragger } = Upload;

// 常量定义
const FILE_TYPE_YAML = 'application/x-yaml';
const DEFAULT_FILE_DATA = {
  name: '',
  type: 'cypher',
  bound_graph: '',
  query: '',
  instance: '',
  description: '',
};

type IUploadFile = {
  disabled: boolean;
  editCode: string;
  handleChange(val: Record<string, any>): void;
};

const UploadFiles: React.FC<IUploadFile> = ({ disabled, editCode, handleChange }) => {
  // 通用文件解析逻辑
  const parseFileContent = async (file: File, type: string) => {
    const content = await Utils.parseFile(file);
    if (type === FILE_TYPE_YAML) {
      return js_yaml.load(content) as Record<string, any>;
    }
    return { ...DEFAULT_FILE_DATA, query: content };
  };

  const customRequest: UploadProps['customRequest'] = async options => {
    const { file } = options;
    const { type, name } = file as File;

    try {
      const data = await parseFileContent(file as File, type);
      handleChange(data);
      message.success(`${name} file uploaded successfully.`);
    } catch (error) {
      message.error(`${name} file upload failed.`);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('Dropped files', e.dataTransfer.files);
  };

  return (
    <div style={{ height: '150px', marginBottom: '12px' }}>
      <Dragger disabled={disabled} showUploadList={false} multiple={true} onDrop={onDrop} customRequest={customRequest}>
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
