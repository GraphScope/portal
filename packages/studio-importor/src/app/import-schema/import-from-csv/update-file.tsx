import * as React from 'react';
import { Space, Tooltip, Upload, Button, message, notification } from 'antd';
import type { UploadProps } from 'antd';
import { FormattedMessage } from 'react-intl';
import { InboxOutlined } from '@ant-design/icons';

import { parseCSV } from './parseCSV';
import { useContext } from '../../useContext';

const { Dragger } = Upload;

export interface IProps {
  onChange?: (value: any) => void;
}

const UploadFile = ({ onChange }: IProps) => {
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
    <div style={{ display: 'flex', justifyContent: 'space-between', height: '100%' }}>
      <Dragger
        accept=".csv,.xlsx" // 限制文件类型
        customRequest={customRequest}
        showUploadList={false}
        multiple={true}
        onDrop={onDrop}
        style={{ height: '100%' }}
      >
        <Tooltip title={<FormattedMessage id="Import" />}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            If you already have CSV data, feel free to upload it here, and the system will automatically infer possible
            graph models for you.
          </p>
        </Tooltip>
      </Dragger>
    </div>
  );
};

export default UploadFile;
