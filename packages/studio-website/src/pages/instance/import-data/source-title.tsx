import React from 'react';
import { Segmented, Flex, Button, theme } from 'antd';
import { useContext, useDataMap, updateDataMap, BindingEdge, BindingNode } from './useContext';
import { getUrlParams } from './utils';
import { searchParamOf } from '@/components/utils';
import TabAction from './tab-action';
// import { createDataloadingJob } from './service';
import { transformDataMapToOptions, transformImportOptionsToSchemaMapping } from '@/components/utils/import';
type ISourceTitleProps = {};

const SourceTitle: React.FunctionComponent<ISourceTitleProps> = () => {
  const { updateStore } = useContext();
  const dataMap = useDataMap();
  /** 根据引擎的类型，进行部分UI的隐藏和展示 */
  const engineType = searchParamOf('engineType');
  const graph_name = searchParamOf('graph_name') || '';

  const handleImport = () => {
    //@ts-ignore
    const options = transformDataMapToOptions(dataMap);
    const schema = transformImportOptionsToSchemaMapping(options);
    const params = submitParams(schema, graph_name);
    // createDataloadingJob(params as any);
    console.log('state', params, dataMap);
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
            Import Data
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
