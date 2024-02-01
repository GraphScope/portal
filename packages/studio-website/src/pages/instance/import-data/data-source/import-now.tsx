import React from 'react';
import { Button, notification, Typography, Flex, Space } from 'antd';
interface IImportNowProps {
  label: string;
}
const { Text } = Typography;
const ImportNow: React.FunctionComponent<IImportNowProps> = props => {
  const { label } = props;
  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    api.open({
      message: '数据导入',
      description: (
        <>
          {/** 这里的值应该都是变量： */}
          <Text>
            {label}类型的节点正在导入中，详情查看任务 {}
          </Text>
          <Flex justify="flex-end">
            <Space>
              <Button onClick={() => api.destroy()}>关闭</Button>
              <Button type="primary">前往查看</Button>
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
      <Button onClick={openNotification} size="small">
        立即导入
      </Button>
      {contextHolder}
    </>
  );
};

export default ImportNow;
