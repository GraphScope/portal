import * as React from 'react';
import { Table, Flex, Typography, theme } from 'antd';
import { GraphData, NodeData } from '../../index';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { getTable } from './utils';
interface IPropertiesTableProps {
  data: GraphData['edges'] | GraphData['nodes'];
  style?: React.CSSProperties;
  title?: string;
}
import { width } from './index';
const PropertiesTable: React.FunctionComponent<IPropertiesTableProps> = props => {
  const { data, style = {}, title } = props;
  const { dataSource, columns } = getTable(data);
  const { token } = theme.useToken();

  // const rootStyle: React.CSSProperties = {
  //   display: 'flex',
  //   position: 'absolute',
  //   bottom: '12px',
  //   left: '12px',
  //   right: '12px',
  //   boxSizing: 'border-box',
  //   maxHeight: width,
  //   boxShadow: token.boxShadow,
  //   zIndex: 1999,
  //   background: token.colorBgContainer,
  //   borderRadius: token.borderRadius,
  //   overflowY: 'scroll',
  //   padding: token.padding,
  // };

  return (
    <Flex style={{ overflowY: 'scroll', ...style }} vertical gap={0}>
      {title && (
        <Typography.Title level={5} style={{ margin: '0px' }}>
          {title}
        </Typography.Title>
      )}

      {/* <Flex justify="space-between">
        <Typography.Title level={5}>Inspect Infos</Typography.Title>
        <Button icon={<DownloadOutlined />} type="text"></Button>
      </Flex> */}
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
