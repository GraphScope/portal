import React, { useEffect } from 'react';
import { Result } from 'antd';
interface IJSONViewProps {
  data: any;
}

const RawView: React.FunctionComponent<IJSONViewProps> = props => {
  const { data } = props;
  console.log('data', data);
  if (data.mode === 'error') {
    return <Result status="error" title={data.raw && data.raw.name} subTitle={data.raw && data.raw.message}></Result>;
  }
  return (
    <div>
      <pre style={{ textWrap: 'pretty' }}>{JSON.stringify(data.raw, null, 2)}</pre>
    </div>
  );
};

export default RawView;
