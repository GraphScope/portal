import React from 'react';
import { Segmented, Flex, Button, theme } from 'antd';
import { useContext } from './useContext';
import { getUrlParams } from './utils';
type ISourceTitleProps = {};
const { useToken } = theme;
const SourceTitle: React.FunctionComponent<ISourceTitleProps> = () => {
  const { store, updateStore } = useContext();
  const { token } = useToken();
  const {
    sourceList: { nodes, edges },
    currentType,
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
  const activeNodeBorder = currentType === 'nodesource' ? `2px solid ${token.colorPrimary}` : 'none';
  const activeEdgesBorder = currentType === 'edgesource' ? `2px solid ${token.colorPrimary}` : 'none';
  const SOURCEDATAOPTIONS = [
    {
      // label: `Point Data Eource Binding（${bindNodeCount}/${nodes?.length}）`,
      label: <div style={{ borderBottom: activeNodeBorder }}>Vertices</div>,
      value: 'nodesource',
    },
    {
      // label: `Edge Data Eource Binding（${bindEdgeCount}/${edges?.length})`,
      label: <div style={{ borderBottom: activeEdgesBorder }}>Edges</div>,
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
          <Button type={isBind ? 'primary' : 'text'} onClick={handleImport} disabled={!isBind}>
            {/* 导入数据 */}
            Import Data
          </Button>
        )}
      </Flex>
    </>
  );
};

export default SourceTitle;
