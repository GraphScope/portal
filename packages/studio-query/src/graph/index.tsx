import React, { useEffect, useState } from 'react';
import Graphin, { GraphinData, GraphinContext } from '@antv/graphin';
import Panel from './panel';
import { processData, calcOverview, storage, getConfig } from './utils';
import type { ISchema } from './typing';
import { theme } from 'antd';

interface GraphViewProps {
  data: GraphinData;
  schemaData: ISchema;
  schemaId: string;
}
let timer;
const FitView = () => {
  const { graph } = React.useContext(GraphinContext);
  useEffect(() => {
    timer = setTimeout(() => {
      graph.fitView();
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  }, [graph]);
  return null;
};

const GraphView: React.FunctionComponent<GraphViewProps> = props => {
  const { data, schemaData: schema, schemaId } = props;
  const [state, updateState] = useState(() => {
    const configMap = getConfig(schema, schemaId);
    return {
      configMap,
    };
  });
  const { token } = theme.useToken();

  const { configMap } = state;
  const newData = processData(data, configMap);
  const overview = calcOverview(schema, configMap, data);
  const onChange = params => {
    const { label } = params;
    configMap.set(label, params);
    updateState(preState => {
      return {
        ...preState,
        configMap,
      };
    });
    storage.set(schemaId, [...configMap.values()]);
  };
  return (
    <Graphin
      data={newData}
      layout={{
        type: 'force2',
        animate: true,
        preset: {
          type: 'concentric',
          width: 800,
          height: 400,
          minNodeSpacing: 2,
          nodeSize: 10,
        },
        clusterNodeStrength: 35,
        minMovement: 5,
        damping: 0.8,
        maxSpeed: 1000,
        distanceThresholdMode: 'max',
      }}
      style={{ height: '480px', minHeight: '480px', background: token.colorBgLayout }}
    >
      {/** @ts-ignore */}
      <Panel overview={overview} onChange={onChange}></Panel>
      <FitView></FitView>
    </Graphin>
  );
};

export default GraphView;
