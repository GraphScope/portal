import React from 'react';
import { Segmented, Flex, Button, theme } from 'antd';
import { useContext, useDataMap, updateDataMap, BindingEdge, BindingNode } from './useContext';
import { getUrlParams } from './utils';
import { searchParamOf } from '@/components/utils';
import TabAction from './tab-action';
import { createDataloadingJob } from './service';
type ISourceTitleProps = {};

const SourceTitle: React.FunctionComponent<ISourceTitleProps> = () => {
  const { updateStore } = useContext();
  const dataMap = useDataMap();
  /** 根据引擎的类型，进行部分UI的隐藏和展示 */
  const engineType = searchParamOf('engineType');
  const graph_name = searchParamOf('graph_name');
  console.log('engineType ', dataMap);
  const handleImport = () => {
    //@ts-ignore
    const schema = transform(dataMap);
    const FIRST_DATA = Object.values(dataMap)[0];
    const { delimiter, datatype } = FIRST_DATA;

    const params = {
      graph: graph_name,
      loading_config: {
        data_source: {
          scheme: datatype === 'odps' ? 'odps' : 'file',
        },
        import_option: 'init',
        format: {
          type: 'string',
          metadata: {
            delimiter,
          },
        },
      },
      ...schema,
    };
    createDataloadingJob(params as any);
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

function transform(dataMap: BindingEdge) {
  let vertex_mappings: any[] = [];
  let edge_mappings: any[] = [];
  const NODE_LABEL_MAP: Record<string, string> = {};
  const NODE_PRIMARY_MAP: Record<string, string> = {};
  Object.values(dataMap).forEach((item: BindingEdge & BindingNode) => {
    const { key, properties, filelocation, label, source, target, primary } = item;
    console.log('key>>>>', key);
    const isEdge = source && target;

    //NODE
    if (!isEdge) {
      NODE_LABEL_MAP[key as string] = label;
      NODE_PRIMARY_MAP[key as string] = primary;
      vertex_mappings.push({
        type_name: label,
        inputs: [filelocation],
        column_mappings: properties.map(p => {
          const { token, name } = p;

          const num = parseFloat(token as string);
          const isNumber = !isNaN(num);
          return {
            column: {
              index: isNumber ? num : 0,
              name: isNumber ? '' : token,
            },
            property: name,
          };
        }),
      });
    } else {
      //EDGE
      edge_mappings.push({
        type_triplet: {
          edge: label,
          source_vertex: NODE_LABEL_MAP[source],
          destination_vertex: NODE_LABEL_MAP[target],
        },
        inputs: [filelocation],
        column_mappings: properties.map(p => {
          const { token, name } = p;
          const num = parseFloat(token as string);
          const isNumber = !isNaN(num);
          return {
            column: {
              //HACK>>>>>>>>
              index: isNumber ? num + 2 : 0,
              name: isNumber ? '' : token,
            },
            property: name,
          };
        }),
        /*** TODO */
        source_vertex_mappings: [
          {
            column: {
              index: 0,
              name: NODE_PRIMARY_MAP[source],
            },
          },
        ],
        destination_vertex_mappings: [
          {
            column: {
              index: 1,
              name: NODE_PRIMARY_MAP[target],
            },
          },
        ],
        /*** TODO END */
      });
    }
  });
  return {
    vertex_mappings,
    edge_mappings,
  };
}
