import * as React from 'react';
import { Space, Tooltip, Upload, Button, message, notification } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { parseCSV, parseJSON } from '../Utils';
import type { IImportFromFileProps } from './index';
import { ParsedFile } from '../Utils/parseCSV';
const { Dragger } = Upload;

export type IProps = {
  onChange?: (value: ParsedFile[], csvFiles?: File[]) => void;
  isSaveFiles?: boolean;
  onAllCompleted?: () => void; // 新增：所有文件上传完成后的回调
} & Pick<IImportFromFileProps['upload'], 'accept' | 'description' | 'title'>;

const UploadFile = ({ onChange, accept, title, description, isSaveFiles, onAllCompleted }: IProps) => {
  const activePromises = React.useRef<Promise<void>[]>([]);
  const customRequest: UploadProps['customRequest'] = async options => {
    const { file } = options;
    const { type } = file as File;

    const uploadPromise = (async () => {
      try {
        if (type === 'application/json') {
          const files = await parseJSON(file as File);
          onChange?.(files);
        }
        if (type === 'text/csv') {
          const csvFiles = isSaveFiles ? [file] : [];
          const files = await parseCSV(file as File);
          onChange?.([files], csvFiles as File[]);
        }
      } catch (error) {
        console.error('解析文件失败:', error);
      }
    })();
    activePromises.current.push(uploadPromise);

    uploadPromise.finally(() => {
      activePromises.current = activePromises.current.filter(p => p !== uploadPromise);
      if (activePromises.current.length === 0 && onAllCompleted) {
        onAllCompleted();
      }
    });
    return uploadPromise;
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
