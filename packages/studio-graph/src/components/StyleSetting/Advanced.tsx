import React, { useState } from 'react';
import { CaretRightOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Collapse, theme, Flex, Typography, Select, Space, Tooltip, Button } from 'antd';
import { useContext } from '../../';
import { CollapseCard } from '@graphscope/studio-components';
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
        if (property.type === 'number' || property.type === 'DT_SIGNED_INT64') {
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
  const { nodes } = schema;

  const [state, setState] = useState({
    scaleType: 'linear',
    property: '',
  });
  const { scaleType, property } = state;

  const nodes_options = getOptions(nodes);
  const range = getRangeByOptions(data, nodes_options);

  const applyNodeStyle = () => {
    const { nodes } = data;
    const { min, max } = range[property];
    const nodeViewSize = [0.5, 10];

    // 创建比例尺
    const nodeSizeScaler = createScale(scaleType, [min, max], nodeViewSize);
    const _nodeSizeStyle = {};

    nodes.forEach(item => {
      const { properties, id, label } = item;
      if (properties) {
        const value = Number(properties[property]);
        const _value = nodeSizeScaler(value);
        _nodeSizeStyle[id] = {
          label,
          size: isNaN(_value) ? min : _value,
        };
      }
    });
    updateStore(draft => {
      Object.keys(_nodeSizeStyle).forEach(id => {
        const { size, label } = _nodeSizeStyle[id];
        draft.nodeStyle[id] = {
          ...draft.nodeStyle[label],
          ...draft.nodeStyle[id],
          size: size,
        };
      });
    });
  };

  return (
    <Flex vertical gap={12}>
      <Typography.Text>Choose Scaler:</Typography.Text>
      <Select
        defaultValue="linear"
        style={{ flex: 1 }}
        options={[
          { label: 'Linear', value: 'linear' },
          { label: 'Log', value: 'log' },
          { label: 'Pow', value: 'pow' },
        ]}
        onChange={value => {
          setState(preState => {
            return {
              ...preState,
              scaleType: value,
            };
          });
        }}
      />

      <Typography.Text>Choose Property:</Typography.Text>
      <Select
        defaultValue=""
        style={{ flex: 1 }}
        options={nodes_options}
        onChange={value => {
          setState(preState => {
            return {
              ...preState,
              property: value,
            };
          });
        }}
      />
      <Button
        onClick={() => {
          applyNodeStyle();
        }}
      >
        Apply
      </Button>
    </Flex>
  );
};

const AdvancedSetting: React.FunctionComponent<IAdvancedSettingProps> = props => {
  return (
    <CollapseCard
      title="Advanced Setting"
      tooltip="The size of nodes or width of edges is linearly scaled based on the range of values in the selected property
            field."
      defaultCollapse
    >
      <SizeScaler />
    </CollapseCard>
  );
};

export default AdvancedSetting;
