import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, notification, Typography, Flex, Space } from 'antd';
interface IImportNowProps {
  nodes: any;
  handleSubmit(value: { repeat: string; schedule: string }): void;
}
const { Text } = Typography;
const ImportNow: React.FunctionComponent<IImportNowProps> = props => {
  const { nodes, handleSubmit } = props;
  const { label, filelocation } = nodes;

  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    handleSubmit({ schedule: 'now', repeat: 'once' });
    api.open({
      message: '数据导入',
      description: (
        <>
          {/** 这里的值应该都是变量： */}
          <Text>
            {label}
            <FormattedMessage id="importing, for more information, see Tasks" /> {}
          </Text>
          <Flex justify="flex-end">
            <Space>
              <Button onClick={() => api.destroy()}>Close</Button>
              <Button type="primary">Go to view</Button>
            </Space>
          </Flex>
        </>
      ),
      style: {
        width: 600,
      },
      duration: null,
    });
  };
  return (
    <>
      <Button onClick={openNotification} size="small" disabled={!filelocation}>
        <FormattedMessage id="Import now" />
      </Button>
      {contextHolder}
    </>
  );
};

export default ImportNow;
