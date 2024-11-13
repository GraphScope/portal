import React from 'react';
import { Result } from 'antd';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import ReactJson from 'react-json-view';
import { useStudioProvier } from '@graphscope/studio-components';
interface IJSONViewProps {
  data: any;
  isFetching: boolean;
}

const RawView: React.FunctionComponent<IJSONViewProps> = props => {
  const { data, isFetching } = props;
  const { isLight } = useStudioProvier();
  const theme = isLight ? 'rjv-default' : 'grayscale';
  if (isFetching) {
    return <Result icon={<Loading3QuartersOutlined spin />} status="error" title={'Running'}></Result>;
  }
  if (data.mode === 'error') {
    return <Result status="error" title={data.raw && data.raw.name} subTitle={data.raw && data.raw.message}></Result>;
  }
  return (
    <div
      style={{
        paddingLeft: '16px',
        overflowWrap: 'break-word',
        wordBreak: 'break-all',
        whiteSpace: 'pre-wrap',
      }}
    >
      <ReactJson src={data.raw} theme={theme} />
      {/* <pre style={{ textWrap: 'pretty' }}>{JSON.stringify(data.raw, null, 2)}</pre> */}
    </div>
  );
};

export default RawView;
