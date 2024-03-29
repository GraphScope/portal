import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Segmented, Flex, Button, theme, notification, Typography } from 'antd';
import { useContext, useDataMap, updateDataMap, BindingEdge, BindingNode } from './useContext';
import { getUrlParams } from './utils';
import { searchParamOf } from '@/components/utils';
import TabAction from './tab-action';
import { createDataloadingJob } from './service';
import { history } from 'umi';
import { transformDataMapToOptions, transformImportOptionsToSchemaMapping } from '@/components/utils/import';
type ISourceTitleProps = {
  type?: string;
};

const SourceTitle: React.FunctionComponent<ISourceTitleProps> = props => {
  const { type } = props;
  const { updateStore } = useContext();
  const dataMap = useDataMap();
  /** 根据引擎的类型，进行部分UI的隐藏和展示 */
  const engineType = window.GS_ENGINE_TYPE;
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
            <FormattedMessage id="Importing graph data" />
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
