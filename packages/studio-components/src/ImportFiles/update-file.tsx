import * as React from 'react';
import { Space, Tooltip, Upload, Button, message, notification } from 'antd';
import type { UploadProps } from 'antd';
import { FormattedMessage } from 'react-intl';
import { InboxOutlined } from '@ant-design/icons';
import { parseCSV, parseJSON, parseSQL } from '../Utils';
import type { IImportFromFileProps } from './index';
const { Dragger } = Upload;

export type IProps = {
  onChange?: (value: any) => void;
} & Pick<IImportFromFileProps['upload'], 'accept' | 'description' | 'title'>;

const UploadFile = ({ onChange, accept, title, description }: IProps) => {
  const customRequest: UploadProps['customRequest'] = async options => {
    const { file } = options;
    const { type } = file as File;
    console.log('options', options);
    try {
      if (type === 'application/json') {
        const files = await parseJSON(file as File);
        onChange && onChange(files);
      }
      if (type === 'text/csv') {
        const files = await parseCSV(file as File);
        onChange && onChange([files]);
      }
      if (type === '') {
        const files = await parseSQL(file as File);
        onChange && onChange(files);
      }
    } catch (error) {
      console.error('解析文件失败:', error);
    }
  };
  const onDrop = e => {
    console.log('Dropped files', e.dataTransfer.files);
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Dragger
        accept={accept}
        customRequest={customRequest}
        showUploadList={false}
        multiple={true}
        onDrop={onDrop}
        style={{ height: '100%', width: '100%' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">{title}</p>
          <p className="ant-upload-hint">{description}</p>
        </div>
      </Dragger>
    </div>
  );
};

export default UploadFile;
