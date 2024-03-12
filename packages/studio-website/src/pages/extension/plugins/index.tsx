import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Skeleton, Popconfirm, message } from 'antd';
import { FormattedMessage } from 'react-intl';
import { listProcedures, deleteProcedure } from '../service';
import { getSearchParams } from '@/pages/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
export interface Item {
  key: string;
  name: string;
  type: string;
  bound_graph: string;
}
type TableColumns = {
  title: React.ReactNode;
  dataIndex?: string;
  key: string;
  render?: (_: any, all: Item) => React.ReactNode;
};
type IPluginsProps = {
  handelChange(val: boolean): void;
};
const Plugins: React.FC<IPluginsProps> = props => {
  const { handelChange } = props;
  const { path, searchParams } = getSearchParams(window.location);
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
  /** 获取插件列表数据 */
  useEffect(() => {
    getPlugins();
  }, []);
  /** 获取插件列表数据 */
  const getPlugins = async () => {
    const res = await listProcedures();
    //@ts-ignore
    updateState(preset => {
      return {
        ...preset,
        pluginList: res || [],
      };
    });
  };

  const columns: TableColumns[] = [
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
        const { bound_graph } = all;
        return (
          <Space>
            <Button size="small" type="primary" ghost>
              Notebook
            </Button>
            <Button type="primary" ghost size="small">
              立即查看
            </Button>
            <Button
              size="small"
              type="primary"
              onClick={() => {
                handelChange(true);
                searchParams.set('bound_graph', bound_graph);
                window.location.hash = `${path}?${searchParams.toString()}`;
              }}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </Button>
            <Popconfirm
              placement="bottomRight"
              title={<FormattedMessage id="Are you sure to delete this task?" />}
              onConfirm={() => deleteExtension(all)}
              okText={<FormattedMessage id="Yes" />}
              cancelText={<FormattedMessage id="No" />}
            >
              <Button size="small" danger ghost>
                <FontAwesomeIcon icon={faTrashCan} />
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  /** 删除插件 */
  const deleteExtension = async (all: { name: string; bound_graph: string }) => {
    const { bound_graph, name } = all;
    const res = await deleteProcedure(bound_graph, name);
    message.success(res);
  };
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
