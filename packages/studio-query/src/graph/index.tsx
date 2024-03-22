import React, { useState } from 'react';
import Graphin, { GraphinData } from '@antv/graphin';
import Panel from './panel';
import { processData, calcOverview, storage, getConfig } from './utils';
import type { ISchema } from './typing';
import { theme } from 'antd';

interface GraphViewProps {
  data: GraphinData;
  schemaData: ISchema;
  schemaId: string;
}

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
        type: 'graphin-force',
        preset: {
          type: 'concentric',
        },
      }}
      style={{ height: '480px', minHeight: '480px', background: token.colorBgLayout }}
    >
      {/** @ts-ignore */}
      <Panel overview={overview} onChange={onChange}></Panel>
    </Graphin>
  );
};

export default GraphView;
