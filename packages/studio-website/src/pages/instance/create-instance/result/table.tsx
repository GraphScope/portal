import React from 'react';
import { Table, theme, Typography } from 'antd';

import type { NodeSchema, EdgeSchema } from '../useContext';
const { useToken } = theme;
interface IImportDataProps {
  data: { nodes: NodeSchema[]; edges: EdgeSchema[] };
}
/**
 * 首次创建边 undefined
 * @param edge
 * @returns
 */
function dataMapEages(edge: { label: string }): string {
  let label = '';
  if (edge) {
    label = edge.label;
  }
  return label;
}
export function getItems(data: IImportDataProps['data']) {
  const { nodes, edges } = data;
  const dataMap = new Map();
  nodes.forEach(item => {
    const { label, key, properties } = item;
    dataMap.set(key, {
      type: 'vertex',
      key,
      label,
      properties: properties,
    });
  });
  edges.forEach(item => {
    const { label, key, properties, source, target } = item;
    const source_label = dataMapEages(dataMap.get(source));
    const target_label = dataMapEages(dataMap.get(target));
    console.log(source_label, target_label);
    const edge_label = `(${source_label})-[${label}]-(${target_label})`;
    dataMap.set(key, {
      type: 'edge',
      key,
      label: edge_label,
      properties: properties,
    });
  });
  const items = [...dataMap.values()];
  return items;
}

const TableList: React.FunctionComponent<IImportDataProps> = props => {
  const { data } = props;
  const items = getItems(data);
  const { token } = useToken();

  return (
    <>
      {items.map(item => {
        const { label, properties } = item;
        return (
          <div
            key={item.key}
            style={{
              border: `1px solid ${token.colorBorder}`,
              padding: '16px 16px',
              marginBottom: '16px',
              borderRadius: '8px',
            }}
          >
            <div style={{ padding: '0px 8px 12px 8px' }}>
              <Typography.Text strong style={{ fontSize: '20px' }}>
                {label}
              </Typography.Text>
            </div>
            <Table
              // bordered
              pagination={false}
              columns={[
                {
                  title: 'property_name',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: 'property_type',
                  dataIndex: 'type',
                  key: 'type',
                },
              ]}
              dataSource={properties}
            ></Table>
          </div>
        );
      })}
    </>
  );
};

export default TableList;
