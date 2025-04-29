import * as React from 'react';
import { GraphProvider, GraphCanvas, useGraphStore } from './src/index';
import { createRoot } from 'react-dom/client';
import { Divider ,Button} from 'antd';
import StoreProvider from '@graphscope/use-zustand';

interface IAppProps {}
const Edit = ()=>{
  const {store,} = useGraphStore();
  const { nodes } = store;
  const printData = ()=>{
  console.log('nodes::: ', nodes);
    console.log(JSON.stringify(store))
  }
  return  (
    <GraphCanvas>
      <Button style={{position:"absolute",zIndex:4}} onClick={()=>printData()}>
          test
      </Button>
    </GraphCanvas>
  )
}
const DrawGraph: React.FunctionComponent<IAppProps> = props => {
  return (
    <>
      <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
        <GraphProvider>
           <Edit/>
        </GraphProvider>
      </div>
    </>
  );
};

createRoot(document.getElementById('root')!).render(<DrawGraph />);
