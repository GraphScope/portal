import React, { useEffect, useState } from 'react';
import { Slider, Button, Typography } from 'antd';
import { useContext } from '../../hooks/useContext';
import * as d3 from 'd3-force-3d';
import { Utils } from '@graphscope/studio-components';

interface ILayoutSettingProps {}

const LayoutSetting: React.FunctionComponent<ILayoutSettingProps> = props => {
  const { store } = useContext();
  const { graph, data } = store;
  const [state, setState] = useState({
    linkStrength: 1,
    linkDistance: 100,
  });

  const { linkStrength } = state;

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

  return (
    <div>
      <Typography.Text>Force Link</Typography.Text>
      <Slider defaultValue={0.5} max={1} min={0} step={0.01} onChangeComplete={onChangeForcelink} />
      <Button onClick={onReset}>reset</Button>
    </div>
  );
};

export default LayoutSetting;
