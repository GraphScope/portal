import React, { useEffect, useState } from 'react';
import { Slider, Button, Typography, Flex, Select } from 'antd';
import { useContext } from '../../';
import * as d3 from 'd3-force-3d';
import { Utils } from '@graphscope/studio-components';
import LayoutParams from './Params';
interface ILayoutSettingProps {}

const layouts = [
  {
    type: 'force',
    options: {},
  },
  {
    type: 'force-combo',
    options: {},
  },
  {
    type: 'force-dagre',
    options: {},
  },
  {
    type: 'dagre',
    options: {},
  },
  {
    type: 'circle-pack',
    options: {},
  },
  {
    type: 'preset',
    options: {},
  },
];
const layoutOptions = layouts.map(item => {
  return {
    label: item.type,
    value: item.type,
  };
});
const LayoutSetting: React.FunctionComponent<ILayoutSettingProps> = props => {
  const { store, updateStore } = useContext();
  const { graph, data, layout } = store;
  const { type, options } = layout;

  const onChangeForcelink = strength => {
    if (graph) {
      // 创建一个新的 link 力并设置其强度
      const linkForce = d3
        .forceLink()
        .links(Utils.fakeSnapshot(data.edges))
        .id(d => d.id)
        .strength((link, a, b) => {
          console.log((Math.abs(link.properties.weight - 0.7) || 0.1) * strength);
          return (Math.abs(link.properties.weight) || 0.1) * strength;
        })
        .distance(link => 30);

      graph.d3Force('link', linkForce);
      /** 立即启动力导 */
      graph.d3ReheatSimulation();
    }
  };
  const onReset = () => {
    if (graph) {
      // 创建一个新的 link 力并设置其强度
      const linkForce = d3
        .forceLink()
        .links(Utils.fakeSnapshot(data.edges))
        .id(d => d.id);

      graph.d3Force('link', linkForce);
      /** 立即启动力导 */
      graph.d3ReheatSimulation();
    }
  };
  const onChangeType = value => {
    updateStore(draft => {
      draft.layout = {
        type: value,
        options: {},
      };
    });
  };

  return (
    <Flex vertical gap={12}>
      <Typography.Text type="secondary" italic>
        you can fine-tune the layout parameters here to optimize the graph display.
      </Typography.Text>

      <Typography.Text strong>Layout Algorithm</Typography.Text>
      <Select options={layoutOptions} value={type} onChange={onChangeType} />

      <LayoutParams />
    </Flex>
  );
};

export default LayoutSetting;
