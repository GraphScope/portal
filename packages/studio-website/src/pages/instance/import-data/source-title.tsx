import React from 'react';
import { Segmented, Flex, Button, Divider } from 'antd';
import { useContext } from './useContext';
import { getUrlParams } from './utils';
type ISourceTitleProps = {};

const SourceTitle: React.FunctionComponent<ISourceTitleProps> = () => {
  const { store, updateStore } = useContext();
  const {
    sourceList: { nodes, edges },
  } = store;
  /** 根据引擎的类型，进行部分UI的隐藏和展示 */
  const { engineType } = getUrlParams();
  const handleImport = () => {
    console.log('state', store);

    // todo fetch
  };
  const nodeEdgeChange: (val: string) => void = val => {
    updateStore(draft => {
      draft.currentType = val;
    });
  };
  const bindNodeCount = nodes.filter(item => item.isBind).length;
  const bindEdgeCount = edges.filter(item => item.isBind).length;

  const SOURCEDATAOPTIONS = [
    {
      label: `点数据源绑定（${bindNodeCount}/${nodes?.length}）`,
      value: 'nodesource',
    },
    {
      label: `边数据源绑定（${bindEdgeCount}/${edges?.length})`,
      value: 'edgesource',
    },
  ];
  const isBind = nodes.every(item => item.isBind) && edges.every(item => item.isBind);
  return (
    <>
      <Flex gap="middle" justify="space-between">
        <Segmented
          options={SOURCEDATAOPTIONS}
          //@ts-ignore
          onChange={nodeEdgeChange}
        />
        {engineType !== 'groot' && (
          <Button type={isBind ? 'primary' : 'dashed'} onClick={handleImport} disabled={!isBind}>
            导入数据
          </Button>
        )}
      </Flex>
    </>
  );
};

export default SourceTitle;
