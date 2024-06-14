import React from 'react';
import { history } from 'umi';
import { Result, Typography, Button, Space } from 'antd';
import { useContext as useImporting } from '@graphscope/studio-importor';
import type { IModalType } from './modal-type';
type IRightSide = Pick<IModalType, 'handleColse'> & {
  isImportFinish: boolean;
};
const { Text } = Typography;
const RightSide: React.FC<IRightSide> = props => {
  const { isImportFinish, handleColse } = props;
  const { store: importingStore } = useImporting();
  const { nodes, edges } = importingStore;
  const nodes_bind = nodes.length;
  const edges_bind = edges.length;
  return (
    <>
      {!isImportFinish ? (
        <Result
          style={{ paddingTop: '0px' }}
          status="403"
          subTitle={
            <>
              <Text>您此时需要导入:</Text>
              <Text>节点 {nodes_bind} 份文件,</Text>
              <Text>边 {edges_bind} 份文件,</Text>
              <Text>共计 {nodes_bind + edges_bind} 份文件,</Text>
              <Text>内存 300MB</Text>
            </>
          }
        />
      ) : (
        <>
          <Result
            style={{ paddingTop: '0px' }}
            status="403"
            subTitle={
              <>
                <Text>导入数据需要一点时间，请耐心等待，您可以前往任务中心查看进展</Text>
              </>
            }
          />
          <div style={{ textAlign: 'center', marginTop: '-24px' }}>
            <Space>
              <Button
                style={{ width: '120px' }}
                type="primary"
                onClick={() => {
                  history.push('/job');
                }}
              >
                Goto Jobs
              </Button>
              <Button style={{ width: '120px' }} onClick={handleColse}>
                Close
              </Button>
            </Space>
          </div>
        </>
      )}
    </>
  );
};

export default RightSide;
