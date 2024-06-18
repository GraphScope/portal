import React from 'react';
import { history } from 'umi';
import { Result, Typography, Button } from 'antd';
import { useContext as useImporting } from '@graphscope/studio-importor';
import { ResultConfig } from '@graphscope/studio-components';
import { useContext } from '@/layouts/useContext';
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
  const { updateStore } = useContext();
  const { store: importingStore } = useImporting();
  const { nodes, edges } = importingStore;
  const nodes_bind = nodes.length;
  const edges_bind = edges.length;
  return (
    <div style={{ padding: '48px 16px 24px 0px ', marginLeft: '-36px' }}>
      {!isImportFinish ? (
        <ResultConfig
          subTitle={
            <Text type="secondary">
              You currently need to import: {nodes_bind} node files, {edges_bind} edge files, a total of &nbsp;
              {nodes_bind + edges_bind} files.
            </Text>
          }
          rightSVG={rightSVG}
        />
      ) : (
        <>
          <Result
            status="404"
            subTitle={
              <>
                <Text type="secondary">
                  Importing data may take a moment, please wait patiently. You can check the progress in the Task
                  Center.
                </Text>
              </>
            }
          />
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <Button
              style={{ width: '128px' }}
              type="primary"
              onClick={() => {
                history.push('/job');
                updateStore(draft => {
                  draft.currentnNav = '/job';
                });
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
