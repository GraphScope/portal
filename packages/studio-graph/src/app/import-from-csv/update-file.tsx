import * as React from 'react';
import { Space, Tooltip, Upload, Button, message, notification } from 'antd';
import type { UploadProps } from 'antd';

import { InboxOutlined } from '@ant-design/icons';

import { parseCSV } from './parseCSV';

const { Dragger } = Upload;

export interface IProps {
  onChange?: (value: any) => void;
}

const UploadFile = ({ onChange }: IProps) => {
  const [api, contextHolder] = notification.useNotification();

  const customRequest: UploadProps['customRequest'] = async options => {
    const { file } = options;
    console.log('options', options);
    try {
      const res = await parseCSV(file as File);
      onChange && onChange(res);
    } catch (error) {
      console.error('解析 YAML 文件失败:', error);
    }
  };
  const onDrop = e => {
    console.log('Dropped files', e.dataTransfer.files);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {contextHolder}
      <Space>
        <Dragger
          accept=".csv,.xlsx" // 限制文件类型
          customRequest={customRequest}
          showUploadList={false}
          multiple={true}
          onDrop={onDrop}
        >
          <Tooltip title={'Import'}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned
              files.
            </p>
          </Tooltip>
        </Dragger>
      </Space>
    </div>
  );
};

export default UploadFile;
