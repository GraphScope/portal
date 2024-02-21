import React from 'react';
import { Segmented, Flex, Button, theme } from 'antd';
import { useContext } from './useContext';
import { getUrlParams } from './utils';
import { searchParamOf } from '@/components/utils';
import TabAction from './tab-action';
type ISourceTitleProps = {};

const SourceTitle: React.FunctionComponent<ISourceTitleProps> = () => {
  const { store, updateStore } = useContext();

  const {
    nodes,
    edges,
    // currentType,
  } = store;
  /** 根据引擎的类型，进行部分UI的隐藏和展示 */
  const engineType = searchParamOf('engineType');
  console.log('engineType ', engineType);
  const handleImport = () => {
    console.log('state', store);
  };

  const bindNodeCount = nodes.filter(item => item.isBind).length;
  const bindEdgeCount = edges.filter(item => item.isBind).length;

  const isBind = nodes.every(item => item.isBind) && edges.every(item => item.isBind);

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
            { label: `Vertexs（${bindNodeCount}/${nodes?.length}）`, value: 'node' },
            { label: `Edges (${bindEdgeCount}/${edges?.length})`, value: 'edge' },
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
