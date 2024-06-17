import React from 'react';
import { history } from 'umi';
import { Result, Typography, Button } from 'antd';
import { useContext as useImporting } from '@graphscope/studio-importor';
import { ResultConfig } from '@graphscope/studio-components';
type IRightSide = {
  isImportFinish: boolean;
};
const { Text } = Typography;
const rightSVG = (
  <>
    <svg width="45px" height="45px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <path fill="#fff" d="M819.2 511.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z" />
      <path fill="#fff" d="M512 511.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z" />
      <path fill="#fff" d="M204.8 511.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z" />
    </svg>
  </>
);
const RightSide: React.FC<IRightSide> = props => {
  const { isImportFinish } = props;
  const { store: importingStore } = useImporting();
  const { nodes, edges } = importingStore;
  const nodes_bind = nodes.length;
  const edges_bind = edges.length;
  return (
    <div style={{ padding: '48px 16px 24px 0px ', marginLeft: '-36px' }}>
      {!isImportFinish ? (
        <ResultConfig
          subTitle={
            <Text>
              You currently need to import: {nodes_bind} node files, {edges_bind} edge files, a total of &nbsp;
              {nodes_bind + edges_bind} files, requiring 300MB of memory.
            </Text>
            //       {/* <Text>您此时需要导入:</Text>
            //       <Text>节点 {nodes_bind} 份文件,</Text>
            //       <Text>边 {edges_bind} 份文件,</Text>
            //       <Text>共计 {nodes_bind + edges_bind} 份文件,</Text>
            //       <Text>内存 300MB</Text> */}
          }
          rightSVG={rightSVG}
        />
      ) : (
        <>
          <Result
            style={{ padding: 0 }}
            status="404"
            subTitle={
              <>
                <Text>
                  Importing data may take a moment, please wait patiently. You can check the progress in the Task
                  Center.
                </Text>
                {/* <Text>导入数据需要一点时间，请耐心等待，您可以前往任务中心查看进展</Text> */}
              </>
            }
          />
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <Button
              style={{ width: '128px' }}
              type="primary"
              onClick={() => {
                history.push('/job');
              }}
            >
              Goto Jobs
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default RightSide;
