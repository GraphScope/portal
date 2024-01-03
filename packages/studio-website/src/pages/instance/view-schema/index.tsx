import * as React from 'react';
import CreateInstance from '../create-instance';
interface IViewSchemaProps {
  graphData?: any;
}

const ViewSchema: React.FunctionComponent<IViewSchemaProps> = props => {
  return (
    <div>
      <CreateInstance isAlert={true}/>
    </div>
  );
};

export default ViewSchema;
