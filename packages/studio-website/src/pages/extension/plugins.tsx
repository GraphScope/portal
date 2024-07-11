import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Table, Button, Space, Skeleton, Popconfirm, message } from 'antd';
import { FormattedMessage } from 'react-intl';
import { history } from 'umi';
import { listProcedures, deleteProcedure } from './service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import CreatePlugins from './create-plugins';
export interface Item {
  key: string;
  name: string;
  type: string;
  bound_graph: string;
}

const Plugins: React.FC = () => {
  const [state, updateState] = useState<{
    /** 插件列表数据 */
    pluginList: Item[];
    /** 控制骨架屏 */
    isReady: boolean;
    open: boolean;
  }>({
    pluginList: [],
    isReady: true,
    open: false,
  });
  const { isReady, pluginList } = state;
  /** 获取插件列表数据 */
  const getPlugins = useCallback(async () => {
    const res = await listProcedures();
    //@ts-ignore
    updateState(preset => {
      return {
        ...preset,
        pluginList: res || [],
      };
    });
  }, []);
  /** 删除插件 */
  const deleteExtension = useCallback(async (all: { id: string; bound_graph: string }) => {
    const { bound_graph: graph_id, id } = all;
    const res = await deleteProcedure(graph_id, id);
    message.success(res);
    await getPlugins();
  }, []);

  useEffect(() => {
    getPlugins();
  }, []);

  const columns = useMemo(
    () => [
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
        title: <FormattedMessage id="Binding graph" />,
        dataIndex: 'bound_graph',
        key: 'bound_graph',
      },
      {
        title: <FormattedMessage id="Action" />,
        key: 'actions',
        width: 60,
        render: (_: any, all: Item) => {
          const { bound_graph, id } = all;
          return (
            <Space>
              <Button
                size="small"
                type="text"
                onClick={() => {
                  history.push(`/extension/edit#?graph_id=${bound_graph}&procedure_id=${id}`);
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
                <Button type="text" size="small" danger ghost>
                  <FontAwesomeIcon icon={faTrashCan} />
                </Button>
              </Popconfirm>
            </Space>
          );
        },
      },
    ],
    [],
  );

  return (
    <>
      <Button
        style={{ position: 'absolute', top: '-55px', right: '0px' }}
        type="primary"
        onClick={() => {
          history.push('/extension/create');
        }}
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
