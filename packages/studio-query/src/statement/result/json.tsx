import React, { useEffect } from 'react';

interface IJSONViewProps {
  data: any;
}

const JSONView: React.FunctionComponent<IJSONViewProps> = props => {
  useEffect(() => {
    return () => {
      console.log('unmount....graph');
    };
  }, []);
  return <div>JSON view</div>;
};

export default JSONView;
