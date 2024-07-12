import React, { useEffect, useState } from 'react';
import Graphin, { GraphinData, GraphinContext, Behaviors } from '@antv/graphin';
import Panel from './panel';
import { processData, calcOverview, storage, getConfig } from './utils';
import type { ISchema } from './typing';
import { theme } from 'antd';
const { ZoomCanvas, ActivateRelations } = Behaviors;

interface GraphViewProps {
  data: GraphinData;
  schemaData: ISchema;
  schemaId: string;
}
let timer;
const FitView = () => {
  const { graph } = React.useContext(GraphinContext);
  useEffect(() => {
    const handleFit = () => {
      graph.fitView([10, 10], {}, true);
    };
    graph.on('afterlayout', handleFit);
    return () => {
      graph.off('afterlayout', handleFit);
    };
  }, [graph]);
  return null;
};
/**
 *
 * @returns 点击Canvas的交互逻辑
 */
const CanvasDoubleClick = () => {
  const { graph } = React.useContext(GraphinContext);

  React.useEffect(() => {
    const handleCenter = () => {
      graph.fitView([10, 10], {}, true);
    };
    graph.on('canvas:dblclick', handleCenter);
    return () => {
      graph.off('canvas:dblclick', handleCenter);
    };
  }, [graph]);
  return null;
};
const ForceSimulation = () => {
  const { graph } = React.useContext(GraphinContext);

  React.useEffect(() => {
    const stopForceSimulation = () => {
      const layoutController = graph.get('layoutController');
      const layoutMethod = layoutController.layoutMethods?.[0];
      if (layoutMethod?.type === 'force2') {
        layoutMethod.stop();
      }
    };
    const restartForceSimulation = () => {
      const layoutController = graph.get('layoutController');
      const layoutMethod = layoutController.layoutMethods?.[0];
      if (layoutMethod?.type === 'force2') {
        graph.updateLayout({ animate: true, disableTriggerLayout: false });
      }
    };

    const handleNodeDragStart = () => {
      stopForceSimulation();
    };
    const handleNodeDragEnd = (e: any) => {
      if (e.item) {
        graph.updateItem(e.item, {
          pinned: true,
          mass: 1000000,
        });
      }

      restartForceSimulation();
    };

    graph.on('node:dragstart', handleNodeDragStart);
    graph.on('node:dragend', handleNodeDragEnd);
    // graph.on('canvas:click', handleNodeDragStart);
    return () => {
      graph.off('node:dragstart', handleNodeDragStart);
      graph.off('node:dragend', handleNodeDragEnd);
      // graph.off('canvas:click', handleNodeDragStart);
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
      <FitView />
      <CanvasDoubleClick />
      <ActivateRelations />
      <ForceSimulation />
      <ZoomCanvas enableOptimize={true} sensitivity={2} />
    </Graphin>
  );
};

export default GraphView;
