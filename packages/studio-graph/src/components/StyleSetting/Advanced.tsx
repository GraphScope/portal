import React, { useState } from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse, theme, Flex, Typography, Select, Space } from 'antd';
import { useContext } from '../../hooks/useContext';
interface IAdvancedSettingProps {}

import { scaleLinear, scaleLog, scalePow } from 'd3-scale';

function createScale(type = 'log', domain, range, exponent = 1) {
  switch (type) {
    case 'linear':
      return scaleLinear().domain(domain).range(range);
    case 'log':
      if (domain[0] === 0) {
        domain[0] = domain[0] + 0.00001;
      }
      if (range[0] === 0) {
        range[0] = range[0] + 0.00001;
      }
      return scaleLog(domain, range);
    case 'pow':
      return scalePow().exponent(exponent).domain(domain).range(range);
    default:
      throw new Error(`Unknown scale type: ${type}`);
  }
}
const getType = value => {
  return Object.prototype.toString.call(value);
};
const isArray = value => getType(value) === '[object Array]';
const isObject = value => getType(value) === '[object Object]';

const getOptions = elementSchema => {
  const options = new Set();
  elementSchema.forEach(item => {
    const { properties } = item;
    if (properties && isArray(properties)) {
      properties.forEach(property => {
        if (property.type === 'number') {
          options.add(property.name);
        }
      });
    }
    if (properties && isObject(properties)) {
      Object.keys(properties).forEach(key => {
        if (properties[key] === 'number') {
          options.add(key);
        }
      });
    }
  });
  return [...options.values()].map(item => {
    return {
      label: item,
      value: item,
    };
  });
};

const getRangeByOptions = (data, options) => {
  const { nodes } = data;
  const range = {};
  const keys = options.map(item => {
    const { value } = item;
    range[value] = {
      min: Infinity,
      max: -Infinity,
    };
    return value;
  });

  nodes.forEach(item => {
    const { properties, id } = item;
    if (properties) {
      Object.keys(properties).forEach(key => {
        const match = range[key];
        if (match) {
          const value = properties[key];
          match.min = Math.min(match.min, value);
          match.max = Math.max(match.max, value);
        }
      });
    }
  });
  return range;
};

const SizeScaler = () => {
  const { store, updateStore } = useContext();
  const { schema, data } = store;
  const { nodes, edges } = schema;
  const [scaleType, setScaleType] = useState('linear');

  const nodes_options = getOptions(nodes);
  //   const edges_options = getOptions(edges);
  const range = getRangeByOptions(data, nodes_options);

  const handleChange = property => {
    const { nodes, edges } = data;
    const { min, max } = range[property];
    const nodeViewSize = [0.01, 20];
    // 创建比例尺
    const nodeSizeScaler = createScale(scaleType, [min, max], nodeViewSize);

    const _nodeSizeStyle = {};
    console.log(min, max, range, nodeViewSize);

    nodes.forEach(item => {
      const { properties, id, label } = item;
      if (properties) {
        const value = Number(properties[property]);
        const _value = nodeSizeScaler(value);
        _nodeSizeStyle[id] = {
          label,
          color: isNaN(_value) ? min : _value,
        };
      }
    });
    updateStore(draft => {
      Object.keys(_nodeSizeStyle).forEach(id => {
        const { color, label } = _nodeSizeStyle[id];
        draft.nodeStyle[id] = {
          ...draft.nodeStyle[label],
          ...draft.nodeStyle[id],
          size: color,
        };
      });
    });
  };

  return (
    <Flex vertical gap={8}>
      <Typography.Text type="secondary">
        The size of nodes or width of edges is linearly scaled based on the range of values in the selected property
        field.
      </Typography.Text>
      <Flex justify="space-between" align="center" gap={12}>
        <Typography.Text type="secondary">Choose Scaler:</Typography.Text>
        <Select
          defaultValue="linear"
          style={{ flex: 1 }}
          options={[
            { label: 'Linear', value: 'linear' },
            { label: 'Log', value: 'log' },
            { label: 'Pow', value: 'pow' },
          ]}
          onChange={value => {
            setScaleType(value);
          }}
        />
      </Flex>
      <Flex justify="space-between" align="center" gap={12}>
        <Typography.Text type="secondary">Choose Property:</Typography.Text>
        <Select defaultValue="" style={{ flex: 1 }} options={nodes_options} onChange={handleChange} />
      </Flex>
    </Flex>
  );
};

const AdvancedSetting: React.FunctionComponent<IAdvancedSettingProps> = props => {
  return (
    <Collapse
      expandIconPosition="end"
      defaultActiveKey={['advanced']}
      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      items={[
        {
          key: 'advanced',
          label: 'Advanced Setting',
          children: <SizeScaler />,
        },
      ]}
    />
  );
};

export default AdvancedSetting;
