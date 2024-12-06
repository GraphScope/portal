import * as React from 'react';
import { Table, Flex, Typography, theme } from 'antd';
import { GraphData, NodeData } from '../../index';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { getTable } from './utils';
interface IPropertiesTableProps {
  data: GraphData['edges'] | GraphData['nodes'];
}

const PropertiesTable: React.FunctionComponent<IPropertiesTableProps> = props => {
  const { data } = props;
  const { dataSource, columns } = getTable(data);
  const { token } = theme.useToken();

  const rootStyle: React.CSSProperties = {
    display: 'flex',
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    right: '12px',
    maxHeight: '50%',
    boxShadow: token.boxShadow,
    zIndex: 1999,
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
    overflowY: 'scroll',
    padding: token.padding,
  };

  return (
    <Flex style={{ overflowY: 'scroll', ...rootStyle }} vertical gap={12}>
      <Flex justify="space-between">
        <Typography.Title level={5}>Inspect Infos</Typography.Title>
        <Button icon={<DownloadOutlined />} type="text"></Button>
      </Flex>
      <Table
        size="large"
        pagination={false}
        dataSource={dataSource}
        columns={columns}
        bordered
        scroll={{ x: 'max-content' }}
      />
    </Flex>
  );
};

export default PropertiesTable;
