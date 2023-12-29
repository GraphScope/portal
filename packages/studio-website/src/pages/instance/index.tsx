import * as React from 'react';
import InstanceLits from './lists';
interface InstanceProps {}

const Instance: React.FunctionComponent<InstanceProps> = props => {
  return (
    <div>
      <InstanceLits />
    </div>
  );
};

export default Instance;
