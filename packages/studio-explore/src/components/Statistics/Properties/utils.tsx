import { getIconByType } from '../../Searchbar/utils';
import { Tag, Space } from 'antd';
import React from 'react';
import type { GraphSchema } from '@graphscope/studio-graph';
export function getPropertyOptions(schema: GraphSchema) {
  const nodeProperties = new Map();
  const edgeProperties = new Map();
  schema.nodes.forEach(node => {
    node.properties.forEach(property => {
      const { name, type } = property;
      const { icon, color } = getIconByType(type);
      nodeProperties.set(name, {
        value: name,
        label: (
          <Space color={color}>
            {icon}
            {name}
          </Space>
        ),
      });
    });
  });
  schema.edges.forEach(edge => {
    edge.properties.forEach(property => {
      const { name, type } = property;
      const { icon, color } = getIconByType(type);
      edgeProperties.set(name, {
        value: name,
        label: (
          <>
            {icon}
            {name}
          </>
        ),
      });
    });
  });

  return [
    {
      label: 'Vertex',
      title: 'Vertex Properties',
      options: [
        {
          value: 'NODE_LABEL',
          label: '#label',
        },
        ...Array.from(nodeProperties.values()),
      ],
    },
    {
      label: 'Edge',
      title: 'Edge Properties',
      options: [
        {
          value: 'EDGE_LABEL',
          label: '#label',
        },
        ...Array.from(edgeProperties.values()),
      ],
    },
  ];
}
