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

  const queryData = async () => {};
  React.useEffect(() => {
    const entityId = Utils.getSearchParams('entityId') || 'Paper';

    query({
      name: entityId,
    }).then(res => {
      updateStore(draft => {
        const schema = Utils.generatorSchemaByGraphData(res);
        //@ts-ignore
        const style = getStyleConfig(schema, draft.graphId);

        const nodeStyles = Object.keys(style.nodeStyle).reduce((acc, curr) => {
          return {
            ...acc,
            [curr]: {
              ...style.nodeStyle[curr],
              caption: 'title',
            },
          };
        }, {});
        console.log('style', style, nodeStyles);
        draft.data = res;
        draft.source = res;
        draft.dataMap = getDataMap(res);
        draft.schema = schema;
        draft.nodeStyle = nodeStyles;
        draft.edgeStyle = style.edgeStyle;
      });
    });
  }, []);

  return null;
};

export default FetchGraph;
