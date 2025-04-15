import * as React from 'react';
import GraphEditor from './src/index';
import { createRoot } from 'react-dom/client';

interface IAppProps {}
const DrawGraph: React.FunctionComponent<IAppProps> = props => {
  return (
      <GraphEditor/>
  );
};

// ReactDOM.render(<DrawGraph />, document.getElementById('root') as HTMLElement);
createRoot(document.getElementById('root')!).render(<DrawGraph />);
