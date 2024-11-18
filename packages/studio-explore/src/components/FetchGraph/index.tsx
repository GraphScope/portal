import * as React from 'react';
import { useContext, getStyleConfig } from '@graphscope/studio-graph';

export interface IQueryGraphData {
  id: 'queryGraphData';
  query: () => Promise<{ nodes: []; edges: [] }>;
}
export interface IQueryGraphSchema {
  id: 'queryGraphSchema';
  query: () => Promise<{ nodes: []; edges: [] }>;
}
const FetchGraph = props => {
  const { updateStore, store } = useContext();
  const { graphId, getService } = store;

  const initGraph = async () => {
    updateStore(draft => {
      draft.isLoading = true;
    });

    const data = await getService<IQueryGraphData>('queryGraphData')();
    const schema = await getService<IQueryGraphSchema>('queryGraphSchema')();
    const style = getStyleConfig(schema, graphId);
    const nodeStyles = Object.keys(style.nodeStyle).reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: {
          ...style.nodeStyle[curr],
          caption: 'title',
        },
      };
    }, {});
    console.log('data', data, schema);
    updateStore(draft => {
      draft.data = data;
      draft.source = data;
      draft.schema = schema;
      draft.nodeStyle = nodeStyles;
      draft.edgeStyle = style.edgeStyle;
      draft.isLoading = false;
    });
  };
  React.useEffect(() => {
    initGraph();
  }, []);

  return null;
};

export default FetchGraph;
