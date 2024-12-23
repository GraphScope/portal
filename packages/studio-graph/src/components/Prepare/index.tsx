import React, { memo } from 'react';
import { useContext, getDataMap, getStyleConfig, NodeStyle, EdgeStyle } from '../../index';

interface IPrepareProps {
  data: any;
  schema: any;
  graphId: string;
  setNodeStyle?: (defaultNodeStyle: Record<string, NodeStyle>) => any;
  setEdgeStyle?: (defaultEdgeStyle: Record<string, EdgeStyle>) => any;
}
const defaultStyleFunction = style => {
  return style;
};

const Prepare: React.FunctionComponent<IPrepareProps> = props => {
  const { data, schema, graphId, setNodeStyle = defaultStyleFunction, setEdgeStyle = defaultStyleFunction } = props;

  const { updateStore } = useContext();
  React.useEffect(() => {
    if (data) {
      const defaultStyle = getStyleConfig(schema, graphId);
      const nodeStyle = setNodeStyle(defaultStyle.nodeStyle);
      const edgeStyle = setEdgeStyle(defaultStyle.edgeStyle);
      updateStore(draft => {
        draft.data = data;
        draft.source = data;
        draft.schema = schema;
        draft.graphId = graphId;
        draft.nodeStyle = nodeStyle;
        draft.edgeStyle = edgeStyle;
        //@ts-ignore
        draft.dataMap = getDataMap(data);
      });
    }
  }, [data, schema, graphId]);
  return null;
};

export default memo(Prepare);
