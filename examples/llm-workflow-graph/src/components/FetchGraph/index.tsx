import * as React from 'react';
import { Button, Table, TableProps } from 'antd';
import { useContext, getDataMap, getStyleConfig } from '@graphscope/studio-graph';
import { Utils } from '@graphscope/studio-components';
import { query } from './service';
interface IUploadProps {}

const FetchGraph: React.FunctionComponent<IUploadProps> = props => {
  const { updateStore } = useContext();
  const [state, setState] = React.useState<{
    lists: any[];
    isReady: boolean;
    columns: any[];
  }>({
    lists: [],
    isReady: false,
    columns: [],
  });
  const handleClick = async () => {
    const res = await query({
      name: 'Paper',
      type: 'nodes',
    });

    updateStore(draft => {
      draft.graphId = 'workflow';
      draft.data = res;
      draft.source = res;
      draft.dataMap = getDataMap(res);
      draft.schema = Utils.generatorSchemaByGraphData(res);
    });
  };

  React.useEffect(() => {
    const id = Utils.getSearchParams('id') || 'Paper';
    console.log('id', id);
    query({
      name: id,
    }).then(res => {
      updateStore(draft => {
        const schema = Utils.generatorSchemaByGraphData(res);
        //@ts-ignore
        const style = getStyleConfig(schema, draft.graphId);
        draft.data = res;
        draft.source = res;
        draft.dataMap = getDataMap(res);
        draft.schema = schema;
        draft.nodeStyle = style.nodeStyle;
        draft.edgeStyle = style.edgeStyle;
      });
    });
  }, []);

  return null;
};

export default FetchGraph;
