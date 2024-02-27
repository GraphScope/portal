import React, { useState } from 'react';
import { Table, Button, Space, Skeleton } from 'antd';
import { FormattedMessage } from 'react-intl';
import CreatePlugins from './create-plugins';
export interface Item {
  key: string;
  name: string;
  type: string;
  instance: string;
}

type IPluginsProps = {};
const Plugins: React.FC<IPluginsProps> = props => {
  const [state, updateState] = useState<{
    /** 插件列表数据 */
    pluginList: Item[];
    /** 控制骨架屏 */
    isReady: boolean;
    /** 创建插件控制 */
    isOpenCreatePlugin: boolean;
  }>({
    pluginList: [],
    isReady: true,
    isOpenCreatePlugin: false,
  });
  const { isReady, pluginList, isOpenCreatePlugin } = state;
  /** 获取插件列表数据 */
  const getPlugins = async () => {};

  /** 创建插件控制 */
  const handleChange = () => {
    updateState(preset => {
      return {
        ...preset,
        isOpenCreatePlugin: true,
      };
    });
  };

  const columns = [
    {
      title: <FormattedMessage id="Name" />,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: <FormattedMessage id="Plugin Type" />,
      dataIndex: 'type',
      key: 'type',
      render: (record: string[]) => <span>{record?.join()}</span>,
    },
    {
      title: <FormattedMessage id="Graph Instance" />,
      dataIndex: 'instance',
      key: 'instance',
    },
    {
      title: <FormattedMessage id="Action" />,
      key: 'actions',
      render: (_: any, all: Item) => {
        console.log(all);
        return (
          <Space>
            <Button size="small" type="primary" ghost>
              Notebook
            </Button>
            <Button type="primary" ghost size="small">
              立即查看
            </Button>
          </Space>
        );
      },
    },
  ];
  let Content = (
    <>
      {isOpenCreatePlugin && (
        <CreatePlugins
          isCreateRecep={isOpenCreatePlugin}
          handelChange={(val: boolean) => {
            //@ts-ignore
            updateState(preset => {
              return {
                ...preset,
                isOpenCreatePlugin: val,
              };
            });
          }}
        />
      )}
    </>
  );

  return (
    <>
      {Content}
      <Button style={{ position: 'absolute', top: '-55px', right: '0px' }} type="primary" onClick={handleChange}>
        <FormattedMessage id="Create Plugin" />
      </Button>
      {!isReady ? (
        <Skeleton />
      ) : (
        <Table
          dataSource={pluginList}
          //@ts-ignores
          columns={columns}
          size="middle"
        />
      )}
    </>
  );
};

export default Plugins;
