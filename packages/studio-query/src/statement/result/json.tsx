import React, { useEffect } from 'react';

interface IJSONViewProps {
  data: any;
}

const JSONView: React.FunctionComponent<IJSONViewProps> = props => {
  const { data } = props;
  useEffect(() => {
    return () => {
      console.log('unmount....graph');
    };
  }, []);
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default JSONView;
