import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Skeleton } from 'antd';
import { FormattedMessage } from 'react-intl';
import { listProcedures } from '../service';
import { log } from 'console';
export interface Item {
  key: string;
  name: string;
  type: string;
  instance: string;
}

type IPluginsProps = {
  handelChange(val: boolean): void;
};
const Plugins: React.FC<IPluginsProps> = props => {
  const { handelChange } = props;
  const [state, updateState] = useState<{
    /** 插件列表数据 */
    pluginList: Item[];
    /** 控制骨架屏 */
    isReady: boolean;
  }>({
    pluginList: [],
    isReady: true,
  });
  const { isReady, pluginList } = state;
  useEffect(() => {
    getPlugins();
  }, []);
  /** 获取插件列表数据 */
  const getPlugins = async () => {
    const res = await listProcedures();
    updateState(preset => {
      return {
        ...preset,
        pluginList: res || [],
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
    },
    {
      title: <FormattedMessage id="Binding Graph" />,
      dataIndex: 'bound_graph',
      key: 'bound_graph',
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

  return (
    <>
      <Button
        style={{ position: 'absolute', top: '-55px', right: '0px' }}
        type="primary"
        onClick={() => handelChange(true)}
      >
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
