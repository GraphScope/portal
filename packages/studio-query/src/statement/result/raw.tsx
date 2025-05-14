import React from 'react';
import { Result } from 'antd';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import ReactJson from 'react-json-view';
interface IJSONViewProps {
  data: any;
  isFetching: boolean;
}

const RawView: React.FunctionComponent<IJSONViewProps> = props => {
  const { data, isFetching } = props;

  if (isFetching) {
    return <Result icon={<Loading3QuartersOutlined spin />} status="success" title={'Running'}></Result>;
  }
  if (data.mode === 'error') {
    return <Result status="error" title={data.raw && data.raw.name} subTitle={data.raw && data.raw.message}></Result>;
  }

  return (
    <div style={{ 
      height: '100%', 
      width: '100%', 
      padding: '8px',
      boxSizing: 'border-box',
      overflow: 'auto'
    }}>
      <ReactJson 
        src={data.raw} 
        style={{ 
          overflowWrap: 'break-word', 
          width: '100%'
        }}
        displayDataTypes={false}
        enableClipboard={true}
        displayObjectSize={true}
        collapsed={1}
        theme="rjv-default"
        indentWidth={2}
      />
    </div>
  );
};

export default RawView;
