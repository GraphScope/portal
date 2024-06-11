import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Segmented, Flex, Button, notification, Typography } from 'antd';
import { useContext, useDataMap, BindingEdge, BindingNode } from './useContext';
// import { getUrlParams } from './utils';
import { Utils } from '@graphscope/studio-components';
const { searchParamOf } = Utils;
// import TabAction from './tab-action';
import { createDataloadingJob } from './service';
// import { history } from 'umi';
import { transformDataMapToOptions, transformImportOptionsToSchemaMapping } from '@/components/utils/import';
type ISourceTitleProps = {
  type?: string;
};
export function submitParams(schema: any) {
  const FIRST_DATA = schema.vertex_mappings[0];
  //@ts-ignore
  const { delimiter, datatype } = FIRST_DATA;
  return {
    loading_config: {
      data_source: {
        scheme: datatype === 'odps' ? 'odps' : 'file',
      },
      import_option: 'overwrite',
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
export function count(dataMap: BindingEdge | BindingNode) {
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
const SourceTitle: React.FunctionComponent<ISourceTitleProps> = props => {
  const { type } = props;
  const { store, updateStore } = useContext();
  const dataMap = useDataMap();
  /** 根据引擎的类型，进行部分UI的隐藏和展示 */
  const engineType = window.GS_ENGINE_TYPE;
  const graph_id = searchParamOf('graph_id') || '';
  const handleImport = async () => {
    //@ts-ignore
    const options = transformDataMapToOptions(dataMap);
    const schema = transformImportOptionsToSchemaMapping(options);
    // const params = submitParams(schema);

    const jobId = await createDataloadingJob(graph_id, schema);
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
    }
  };
  //@ts-ignore
  const { nodeBind, nodeCount, edgeBind, edgeCount } = count(dataMap);

  // const isBind = nodeBind === nodeCount && nodeCount > 0 && edgeBind === edgeCount && edgeCount > 0;
  const isBind = nodeBind > 0 || edgeBind > 0;

  const handleChangeTabs = (val: string) => {
    updateStore(draft => {
      draft.currentType = val;
    });
  };
  return (
    <>
      <Flex gap="middle" justify="space-between">
        {type === 'title' && (
          <Segmented
            options={[
              {
                label: (
                  <>
                    <FormattedMessage id="Vertices" />
                    {`(${nodeBind}/${nodeCount}）`}
                  </>
                ),
                value: 'node',
              },
              {
                label: (
                  <>
                    <FormattedMessage id="Edges" />
                    {`(${edgeBind}/${edgeCount})`}
                  </>
                ),
                value: 'edge',
              },
            ]}
            onChange={handleChangeTabs}
          />
        )}
        {type === 'import' && engineType !== 'groot' && (
          <Button type={isBind ? 'primary' : 'default'} onClick={handleImport} disabled={!isBind}>
            <FormattedMessage id="Importing data" />
          </Button>
        )}
      </Flex>
    </>
  );
};

export default SourceTitle;
