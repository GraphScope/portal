import * as React from 'react';
import ReactDOM from 'react-dom';
import SchemaGraph from '../src/index';

interface IAppProps {}

const DrawGraph: React.FunctionComponent<IAppProps> = props => {
  return (
    <div>
      <SchemaGraph locale="en-US" />
    </div>
  );
};

ReactDOM.render(<DrawGraph />, document.getElementById('root') as HTMLElement);
