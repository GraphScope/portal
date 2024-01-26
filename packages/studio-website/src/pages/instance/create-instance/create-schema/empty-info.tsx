import * as React from 'react';
import AddLabel from './add-label';
interface IEmptyInfoProps {}

const EmptyInfo: React.FunctionComponent<IEmptyInfoProps> = props => {
  return (
    <div style={{ padding: '24px' }}>
      <AddLabel />
    </div>
  );
};

export default EmptyInfo;
