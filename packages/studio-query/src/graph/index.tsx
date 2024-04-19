import React, { useState } from 'react';
import Graphin, { GraphinData } from '@antv/graphin';
import { Resizable } from 're-resizable';
import Panel from './panel';
import { processData, calcOverview, storage, getConfig } from './utils';
import type { ISchema } from './typing';
import { theme, Flex } from 'antd';

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
      resizableWidth: 320,
    };
  });
  const { token } = theme.useToken();

  const { configMap, resizableWidth } = state;
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
    <Flex>
      <Resizable
        size={{ width: resizableWidth, height: 480 }}
        minWidth={'50%'}
        maxWidth={'70%'}
        onResizeStop={(e, direction, ref, d) => {
          updateState(preState => ({ ...preState, width: resizableWidth + d.width }));
        }}
      >
        <Graphin
          data={newData}
          layout={{
            type: 'graphin-force',
            preset: {
              type: 'concentric',
            },
          }}
          style={{ height: '480px', minHeight: '480px', background: token.colorBgLayout }}
        />
      </Resizable>
      <div style={{ width: `calc(100% - ${resizableWidth}px)` }}>
        {/** @ts-ignore */}
        <Panel overview={overview} onChange={onChange}></Panel>
      </div>
    </Flex>
  );
};

export default GraphView;
