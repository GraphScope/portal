import React from 'react';
import { Segmented, Flex, Button, theme } from 'antd';
import { useContext, useDataMap, updateDataMap, BindingEdge, BindingNode } from './useContext';
import { getUrlParams } from './utils';
import { searchParamOf } from '@/components/utils';
import TabAction from './tab-action';

type ISourceTitleProps = {};

const SourceTitle: React.FunctionComponent<ISourceTitleProps> = () => {
  const { updateStore } = useContext();
  const dataMap = useDataMap();

  /** 根据引擎的类型，进行部分UI的隐藏和展示 */
  const engineType = searchParamOf('engineType');
  console.log('engineType ', dataMap);
  const handleImport = () => {
    //@ts-ignore
    const params = transform(dataMap);
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

function count(dataMap: BindingEdge & BindingNode) {
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
  Object.values(dataMap).forEach((item: BindingEdge & BindingNode) => {
    const { key, properties, filelocation, label, source, target } = item;
    const isEdge = source && target;
    //NODE
    if (!isEdge) {
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
          source_vertex: source,
          destination_vertex: target,
        },
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
        /*** TODO */
        source_vertex_mappings: [
          {
            column: {
              index: 0,
              name: '',
            },
          },
        ],
        destination_vertex_mappings: [
          {
            column: {
              index: 0,
              name: '',
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
