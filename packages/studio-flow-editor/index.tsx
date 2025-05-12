import * as React from 'react';
import { GraphProvider, GraphCanvas, useGraphStore, useAddNode } from './src/index';
import { createRoot } from 'react-dom/client';
import { Button } from 'antd';

interface IAppProps {}
const Edit = () => {
  const { store } = useGraphStore();
  const { handleAddVertex } = useAddNode();
  const { nodes } = store;
  const printData = () => {
    console.log('nodes::: ', nodes);
  };
  return (
    <>
      <Button style={{ position: 'absolute', zIndex: 4, left: 20, top: 20 }} onClick={() => printData()}>
        test
      </Button>
      <Button style={{ position: 'absolute', zIndex: 4, left: 80, top: 20 }} onClick={() => handleAddVertex()}>
        add
      </Button>
    </>
  );
};
const DrawGraph: React.FunctionComponent<IAppProps> = props => {
  return (
    <>
      <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
        <GraphProvider>
          <GraphCanvas>
            <Edit />
          </GraphCanvas>
        </GraphProvider>
      </div>
    </>
  );
};

createRoot(document.getElementById('root')!).render(<DrawGraph />);
