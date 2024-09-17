import * as React from 'react';
import { Button, Flex, Table, TableProps, Typography, Progress } from 'antd';
import { useContext, getDataMap, getStyleConfig } from '@graphscope/studio-graph';
import { Utils } from '@graphscope/studio-components';
import { getExtractResultByEntity } from '../../pages/dataset/service';
interface IUploadProps {}

const FetchGraph: React.FunctionComponent<IUploadProps> = props => {
  const { updateStore } = useContext();
  const [state, setState] = React.useState<{
    progress: number;
  }>({
    progress: 0,
  });
  const { progress } = state;

  React.useEffect(() => {
    const entityId = Utils.getSearchParams('entityId') || 'Challenge';
    getExtractResultByEntity({
      workflow_node_names: entityId,
      dataset_id: Utils.getSearchParams('datasetId'),
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
      setState(preState => {
        return {
          ...preState,
          progress: res.progress,
        };
      });
    });
  }, []);

  return (
    <Flex vertical gap={12}>
      <Progress percent={progress} />
    </Flex>
  );
};

export default FetchGraph;
