import React from 'react';
import {
  FieldNumberOutlined,
  FieldStringOutlined,
  FieldTimeOutlined,
  BoldOutlined,
  FileUnknownOutlined,
} from '@ant-design/icons';
import { Tag, Typography, Space } from 'antd';
import { type GraphSchema } from '@graphscope/studio-graph';
export const getIconByType = (type: string) => {
  const _type = String(type).toUpperCase();
  if (_type === 'STRING' || _type === 'TEXT' || _type === 'DT_STRING' || _type === 'STR') {
    return { icon: <FieldStringOutlined />, color: 'default' };
  }
  if (
    _type === 'INT32' ||
    _type === 'INT64' ||
    _type === 'FLOAT' ||
    _type === 'DOUBLE' ||
    _type === 'NUMBER' ||
    _type === 'NUM'
  ) {
    return { icon: <FieldNumberOutlined />, color: 'cyan' };
  }
  if (_type === 'BOOL' || _type === 'BOOLEAN') {
    return { icon: <BoldOutlined />, color: 'blue' };
  }
  if (_type === 'DATE' || _type === 'TIMESTAMP' || _type === 'TIME' || _type === 'DATETIME') {
    return { icon: <FieldTimeOutlined />, color: 'lime' };
  }
  return {
    icon: <FileUnknownOutlined />,
    color: '#ddd',
  };
};

export const getOptionsBySchema = (params: {
  schema: GraphSchema;
  statements: { name: string; script: string }[];
  nodeStyle: any;
  edgeStyle: any;
}) => {
  const { schema, statements, nodeStyle, edgeStyle } = params;
  const nodeOptions = schema.nodes.map(item => {
    const { color = '#fafafa' } = nodeStyle[item.label] || {};
    return {
      type: 'label',
      value: item.label,
      meta: {
        color,
      },
      label: (
        <Space>
          <Tag color={color}>{item.label}</Tag>
          <Typography.Text type="secondary" style={{ fontSize: 11 }} italic>
            Search for nodes that have the {item.label} label...
          </Typography.Text>
        </Space>
      ),
      children: item.properties.map(item => {
        const { icon, color } = getIconByType(item.type);
        return {
          type: 'property',
          value: item.name,
          label: (
            <Space>
              <Tag color={color} icon={icon}>
                {item.name}
              </Tag>
              <Typography.Text type="secondary" style={{ fontSize: 11 }} italic>
                Search for nodes that the property {item.name} contains...
              </Typography.Text>
            </Space>
          ),
          meta: {
            color,
            icon,
          },
        };
      }),
    };
  });
  const edgeOptions = schema.edges.map(item => {
    const { color } = edgeStyle[item.label];
    return {
      type: 'label',
      value: item.label,
      meta: {
        color,
      },
      label: (
        <Space>
          <Tag color={color}>{item.label}</Tag>
          <Typography.Text type="secondary" style={{ fontSize: 11 }} italic>
            Search for edges that have the {item.label} label...
          </Typography.Text>
        </Space>
      ),
      children: item.properties.map(item => {
        const { icon, color } = getIconByType(item.type);
        return {
          type: 'property',
          value: item.name,
          label: (
            <Space>
              <Tag color={color} icon={icon}>
                {item.name}
              </Tag>
              <Typography.Text type="secondary" style={{ fontSize: 11 }} italic>
                Search for edges that the property {item.name} contains...
              </Typography.Text>
            </Space>
          ),
          meta: {
            color,
            icon,
          },
        };
      }),
    };
  });
  const statementOptions = statements.map(item => {
    return { value: item.script, label: item.name };
  });
  return [
    {
      value: 'Vertex',
      type: 'type',
      label: (
        <Space>
          Vertex
          <Typography.Text type="secondary" style={{ fontSize: 11 }} italic>
            Search from nodes...
          </Typography.Text>
        </Space>
      ),
      children: nodeOptions,
    },
    {
      value: 'Edge',
      type: 'type',

      label: (
        <Space>
          Edge
          <Typography.Text type="secondary" style={{ fontSize: 11 }} italic>
            Search from edges...
          </Typography.Text>
        </Space>
      ),
      children: edgeOptions,
    },

    {
      value: 'Saved',
      type: 'type',

      label: (
        <Space>
          Saved Statements
          <Typography.Text type="secondary" style={{ fontSize: 12 }} italic>
            Search from saved statements...
          </Typography.Text>
        </Space>
      ),
      children: statementOptions,
    },
  ];
};

export const getOptionsByPath = (options, path) => {
  if (path.length === 0) {
    return options;
  }
  const currentKey = path[0];

  const matchedOption = options.find(option => option.value === currentKey);

  if (matchedOption && matchedOption.children) {
    return getOptionsByPath(matchedOption.children, path.slice(1));
  } else {
    return [];
  }
};
