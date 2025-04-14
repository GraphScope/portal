import React, { useMemo } from 'react';
import { Table, Button, Space, Skeleton, Popconfirm } from 'antd';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPenToSquare } from '@fortawesome/free-regular-svg-icons';

import { usePlugins } from '../hooks/usePlugins';
import { useHistory } from '../../../hooks';

// 定义插件项的类型
export interface PluginItem {
  id: string;
  name: string;
  type: string;
  bound_graph: string;
}

const Plugins: React.FC = () => {
  const history = useHistory();
  const { isReady, pluginList, deleteExtension } = usePlugins();

  // 定义表格列
  const columns = useMemo(
    () => [
      {
        title: <FormattedMessage id="Name" defaultMessage="Name" />,
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: <FormattedMessage id="Plugin Type" defaultMessage="Plugin Type" />,
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: <FormattedMessage id="Binding graph" defaultMessage="Binding Graph" />,
        dataIndex: 'bound_graph',
        key: 'bound_graph',
      },
      {
        title: <FormattedMessage id="Action" defaultMessage="Action" />,
        key: 'actions',
        width: 60,
        render: (_: any, plugin: PluginItem) => (
          <Space>
            {/* 编辑按钮 */}
            <Button
              size="small"
              type="text"
              onClick={() => {
                history.push(`/extension/edit#?graph_id=${plugin.bound_graph}&procedure_id=${plugin.id}`);
              }}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </Button>
            {/* 删除按钮 */}
            <Popconfirm
              placement="bottomRight"
              title={
                <FormattedMessage
                  id="Are you sure to delete this task?"
                  defaultMessage="Are you sure to delete this task?"
                />
              }
              onConfirm={() => deleteExtension(plugin)}
              okText={<FormattedMessage id="Yes" defaultMessage="Yes" />}
              cancelText={<FormattedMessage id="No" defaultMessage="No" />}
            >
              <Button type="text" size="small" danger ghost>
                <FontAwesomeIcon icon={faTrashCan} />
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [history, deleteExtension],
  );

  return (
    <div style={{ position: 'relative' }}>
      {/* 创建插件按钮 */}
      <Button
        style={{ position: 'absolute', top: '-45px', right: '0px' }}
        type="primary"
        onClick={() => {
          history.push('/extension/create');
        }}
      >
        <FormattedMessage id="Create Plugin" defaultMessage="Create Plugin" />
      </Button>
      {/* 表格或加载状态 */}
      {!isReady ? (
        <Skeleton />
      ) : (
        <Table<PluginItem> dataSource={pluginList} columns={columns} size="middle" rowKey="id" />
      )}
    </div>
  );
};

export default Plugins;
