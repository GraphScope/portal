import React, { useEffect, useState } from 'react';
import { Slider, Button, Typography, Flex, Select, Input, InputNumber } from 'antd';
import { useContext } from '../../';

interface ILayoutParamsProps {}

const LayoutParams: React.FunctionComponent<ILayoutParamsProps> = props => {
  const { store, updateStore } = useContext();
  const { graph, data, layout } = store;
  const { type, options } = layout;
  const handleChange = (key, value) => {
    updateStore(draft => {
      if (draft.layout.options[key] !== value) {
        draft.layout.options = { ...draft.layout.options, [key]: value };
      }
    });
  };
  if (type === 'force') {
    const { linkDistance = 35, centerStrength = 1 } = options;
    return (
      <Flex vertical gap={12}>
        <Typography.Text strong>Link distance</Typography.Text>
        <Input
          defaultValue={linkDistance}
          onBlur={e => {
            console.log(e.target.value);
            handleChange('linkDistance', e.target.value);
          }}
        ></Input>
        <Typography.Text strong>Center Strength</Typography.Text>
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          max={1}
          defaultValue={centerStrength}
          onBlur={e => {
            console.log(e.target.value);
            handleChange('centerStrength', e.target.value);
          }}
        ></InputNumber>
      </Flex>
    );
  }
  if (type === 'force-dagre') {
    const { direction = 'lr' } = options;
    return (
      <Flex vertical gap={12}>
        <Typography.Text strong>Direction</Typography.Text>
        <Select
          options={[
            {
              label: 'top-down',
              value: 'td',
            },
            {
              label: 'left-right',
              value: 'lr',
            },
            {
              label: 'bottom-up',
              value: 'bu',
            },
            {
              label: 'right-left',
              value: 'rl',
            },
            {
              label: 'inwards-radially',
              value: 'radialin',
            },
            {
              label: 'outwards-radially',
              value: 'radialout',
            },
          ]}
          value={direction}
          onChange={value => {
            handleChange('direction', value);
          }}
        ></Select>
      </Flex>
    );
  }

  return <div></div>;
};

export default LayoutParams;
