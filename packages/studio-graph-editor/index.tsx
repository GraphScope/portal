import * as React from 'react';
import { Graph } from './src/index';
import { createRoot } from 'react-dom/client';

interface IAppProps {}

const DrawGraph: React.FunctionComponent<IAppProps> = props => {
  return (
    <div>
      <Graph locale="en-US" isShowPopover={true} isLabelEmpty={true} />
    </div>
  );
};

// ReactDOM.render(<DrawGraph />, document.getElementById('root') as HTMLElement);
createRoot(document.getElementById('root')!).render(<DrawGraph />);
