import * as React from 'react';
import { useContext, getStyleConfig } from '@graphscope/studio-graph';
import { IQueryServices } from '../../service';

const FetchGraph: React.FunctionComponent<IQueryServices> = props => {
  const { updateStore, store } = useContext();
  const { graphId } = store;
  const { queryCypher, queryCypherSchema } = props;

  const initGraph = async () => {
    updateStore(draft => {
      draft.isLoading = true;
    });
    const data = await queryCypher({
      script: '',
    });
    const schema = await queryCypherSchema();
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
