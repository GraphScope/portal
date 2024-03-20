import React, { useEffect } from 'react';

interface IJSONViewProps {
  data: any;
}

const RawView: React.FunctionComponent<IJSONViewProps> = props => {
  const { data } = props;
  return (
    <div>
      <pre style={{ textWrap: 'pretty' }}>{JSON.stringify(data.raw, null, 2)}</pre>
    </div>
  );
};

export default RawView;
