import * as React from 'react';
import { Space, Tooltip, Upload, Button, message, notification } from 'antd';
import type { UploadProps } from 'antd';
import { FormattedMessage } from 'react-intl';

export interface IProps {
  onChange?: (value: any) => void;
}

const UploadFile = ({ onChange }: IProps) => {
  const [api, contextHolder] = notification.useNotification();
  const readFile = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  /** 提示框 */
  const openNotification = () => {
    api.error({
      message: `Import`,
      description: '解析文件失败，请确保上传的文件是有效的 YAML 格式',
    });
  };
  const handleUpload = async (file: any) => {
    try {
      const content = (await readFile(file)) as string;
      onChange && onChange(content);
    } catch (error) {
      console.error('解析 YAML 文件失败:', error);
      openNotification();
    }
  };

  const customRequest: UploadProps['customRequest'] = async options => {
    const { file } = options;
    handleUpload(file);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {contextHolder}
      <Space>
        <Upload customRequest={customRequest} showUploadList={false}>
          <Tooltip title={<FormattedMessage id="Import" />}>
            <Button type="text">upload</Button>
          </Tooltip>
        </Upload>
      </Space>
    </div>
  );
};

export default UploadFile;
