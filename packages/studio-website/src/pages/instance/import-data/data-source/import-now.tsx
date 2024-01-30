import React, { useState } from 'react';
import { Button, notification, Typography, Flex, Space } from 'antd';
interface IImportNowProps {}
const { Text } = Typography;
const ImportNow: React.FunctionComponent<IImportNowProps> = props => {
  const [visible, setVisible] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    api.open({
      message: '数据导入',
      description: (
        <>
          <Text>'「User」类型的节点正在导入中，详情查看任务 JOB-xxx'</Text>
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
    });
  };
  return (
    <>
      <Button type="primary" onClick={openNotification}>
        立即导入
      </Button>
      {contextHolder}
    </>
  );
};

export default ImportNow;
