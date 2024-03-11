import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Flex, Button, notification, Typography } from 'antd';
import { useContext, useDataMap, BindingEdge, BindingNode } from './useContext';
import { searchParamOf } from '@/components/utils';
import TabAction from './tab-action';
import { createDataloadingJob } from './service';
import { transformDataMapToOptions, transformImportOptionsToSchemaMapping } from '@/components/utils/import';
type ISourceTitleProps = {};

const SourceTitle: React.FunctionComponent<ISourceTitleProps> = () => {
  const { updateStore } = useContext();
  const dataMap = useDataMap();
  /** 根据引擎的类型，进行部分UI的隐藏和展示 */
  const engineType = searchParamOf('engineType');
  const graph_name = searchParamOf('graph_name') || '';

  const handleImport = async () => {
    //@ts-ignore
    const options = transformDataMapToOptions(dataMap);
    const schema = transformImportOptionsToSchemaMapping(options);
    const params = submitParams(schema, graph_name);
    const jobId = await createDataloadingJob(params as any);
    if (jobId) {
      notification.success({
        message: 'Create DataImport Job Success',
        description: (
          <>
            Now navigate to the Job page to view the &nbsp;
            <Typography.Link href={`/job#?jobId=${jobId}`}>details</Typography.Link>
          </>
        ),
      });
    } else {
      notification.error({
        message: 'Create DataImport Job Failed',
      });
    }
  };
  //@ts-ignore
  const { nodeBind, nodeCount, edgeBind, edgeCount } = count(dataMap);

  const isBind = nodeBind === nodeCount && nodeCount > 0 && edgeBind === edgeCount && edgeCount > 0;

  const handleChangeTabs = (val: string) => {
    updateStore(draft => {
      draft.currentType = val;
    });
  };
  return (
    <>
      <Flex gap="middle" justify="space-between">
        <TabAction
          items={[
            { label: `Vertexs（${nodeBind}/${nodeCount}）`, value: 'node' },
            { label: `Edges (${edgeBind}/${edgeCount})`, value: 'edge' },
          ]}
          tabChange={handleChangeTabs}
        />
        {engineType !== 'groot' && (
          <Button type={isBind ? 'primary' : 'default'} onClick={handleImport} disabled={!isBind}>
            <FormattedMessage id="Import Data" />
          </Button>
        )}
      </Flex>
    </>
  );
};

export default SourceTitle;
export function submitParams(schema: any, graph_name: string) {
  const FIRST_DATA = schema.vertex_mappings[0];
  //@ts-ignore
  const { delimiter, datatype } = FIRST_DATA;
  return {
    graph: graph_name,
    loading_config: {
      data_source: {
        scheme: datatype === 'odps' ? 'odps' : 'file',
      },
      import_option: 'init',
      format: {
        type: datatype === 'odps' ? 'odps' : 'csv',
        metadata: {
          delimiter,
        },
      },
    },
    ...schema,
  };
}

function count(dataMap: BindingEdge | BindingNode) {
  let nodeCount: number = 0;
  let nodeBind: number = 0;
  let edgeCount: number = 0;
  let edgeBind: number = 0;

  Object.values(dataMap).forEach(item => {
    if (item.source && item.target) {
      edgeCount = edgeCount + 1;
      if (item.isBind) {
        edgeBind = edgeBind + 1;
      }
    } else {
      nodeCount = nodeCount + 1;
      if (item.isBind) {
        nodeBind = nodeBind + 1;
      }
    }
  });

  return {
    nodeCount,
    nodeBind,
    edgeBind,
    edgeCount,
  };
}
