import React, { useState } from 'react';

import { Space, Button, theme, Tooltip } from 'antd';

import type { IDataset } from '../typing';

import { downloadDataset, runExtract, deleteDataset, useKuzuGraph } from '../service';

import { FileZipOutlined, DeleteOutlined, GlobalOutlined } from '@ant-design/icons';

const Action: React.FunctionComponent<IDataset> = props => {
  const { id, refreshList } = props;
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    await deleteDataset(id);
    refreshList && refreshList();
  };

  return (
    <Space>
      <Tooltip title="Import into GraphScope for graph analysis">
        <Button
          icon={<GlobalOutlined />}
          loading={loading}
          onClick={async () => {
            // const rest = await runInteractive(id);
            setLoading(true);
            const rest = await useKuzuGraph(id);
            setLoading(false);
            window.open(`#/paper-reading?graph_id=${id}`, '_blank');
          }}
        >
          Graph Analysis
        </Button>
      </Tooltip>
      <Tooltip title="Download extracted graph dataset">
        <Button
          icon={<FileZipOutlined />}
          onClick={() => {
            downloadDataset(id);
          }}
        ></Button>
      </Tooltip>
      <Tooltip title="Delete dataset">
        <Button onClick={handleDelete} icon={<DeleteOutlined />}></Button>
      </Tooltip>
    </Space>
  );
};

export default Action;
