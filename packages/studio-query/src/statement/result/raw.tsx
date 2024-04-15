import React, { useEffect } from 'react';
import { Result } from 'antd';
import { LoadingOutlined, Loading3QuartersOutlined } from '@ant-design/icons';

interface IJSONViewProps {
  data: any;
  isFetching: boolean;
}

const RawView: React.FunctionComponent<IJSONViewProps> = props => {
  const { data, isFetching } = props;

  if (isFetching) {
    return <Result icon={<Loading3QuartersOutlined spin />} status="error" title={'Running'}></Result>;
  }
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
