import React from 'react';
import { Result, Typography } from 'antd';
import { useContext as useImporting } from '@graphscope/studio-importor';
interface IRightSide {
  finish: boolean;
  isImportFinish: boolean;
}
const { Text } = Typography;
const RightSide: React.FC<IRightSide> = props => {
  const { finish, isImportFinish } = props;
  const { store: importingStore } = useImporting();
  const { nodes, edges } = importingStore;
  const nodes_bind = nodes.length;
  const edges_bind = edges.length;
  return (
    <>
      {finish ? (
        <>
          {isImportFinish ? (
            <Result status="403" subTitle="Sorry, you are not authorized to access this page." />
          ) : (
            <Text>导入数据需要一点时间，请耐心等待，您可以前往任务中心查看进展</Text>
          )}
        </>
      ) : (
        <Text>
          您此时需要导入 {nodes_bind} 份点文件，{edges_bind} 份边文件，共计 {nodes_bind + edges_bind} 份文件，一共300MB
        </Text>
      )}
    </>
  );
};

export default RightSide;
