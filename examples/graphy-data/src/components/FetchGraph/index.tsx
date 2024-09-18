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
  const timerId = React.useRef<any>(null);
  const currentProgress = React.useRef<number>(0);

  const queryGraph = async () => {
    const entityId = Utils.getSearchParams('entityId') || 'Challenge';
    const res = await getExtractResultByEntity({
      workflow_node_names: entityId,
      dataset_id: Utils.getSearchParams('datasetId'),
    });

    if (res.progress !== currentProgress.current) {
      currentProgress.current = res.progress;
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
        };
      });
    }

    const isComplete = res.progress === 100;
    clearTimeout(timerId.current);
    if (!isComplete) {
      const tid = setTimeout(() => {
        queryGraph();
      }, 1000);
      timerId.current = tid;
    }
  };

  React.useEffect(() => {
    queryGraph();
    return () => {
      clearTimeout(timerId.current);
    };
  }, []);

  return (
    <Flex vertical gap={12}>
      <Progress percent={currentProgress.current} status="active" />
    </Flex>
  );
};

export default FetchGraph;
