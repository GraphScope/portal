import React, { useState } from 'react';
import Graphin, { GraphinData } from '@antv/graphin';
import Panel from './panel';
import { processData, calcOverview, storage, getConfig } from './utils';
import type { ISchema } from './typing';

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
        preset: {
          type: 'concentric',
        },
      }}
      style={{ height: '480px', minHeight: '480px', background: '#f8fcfe' }}
    >
      {/** @ts-ignore */}
      <Panel overview={overview} onChange={onChange}></Panel>
    </Graphin>
  );
};

export default GraphView;
