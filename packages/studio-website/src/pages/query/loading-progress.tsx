import * as React from 'react';
import { Flex, Space, Progress } from 'antd';

interface IUploadProgressProps {
  file?: string;
}

const UploadProgress: React.FunctionComponent<IUploadProgressProps> = ({ file }) => {
  const [state, setState] = React.useState({ progress: 0 });

  const { progress } = state;

  const calcProgress = React.useMemo(() => {
    //@ts-ignore
    const fileSize = file?.size;
    //@ts-ignore
    const downlink = (navigator?.connection.downlink / 2) * 1024 * 1024;
    const totalChunks = 50;
    const estimatedTime = Math.round((fileSize / downlink) * 1000);

    return async () => {
      for (let i = 0; i < totalChunks; i++) {
        await delay(estimatedTime / totalChunks);
        const newProgress = Math.round(((i + 1) / totalChunks) * 99);
        setState({ progress: newProgress });
      }
    };
  }, [file]);

  const delay = React.useCallback(ms => new Promise(resolve => setTimeout(resolve, ms)), []);

  React.useEffect(() => {
    calcProgress().catch(console.error);
  }, [calcProgress]);

  return (
    <Flex style={{ width: '100%', height: '100%' }} vertical justify="center" align="center">
      <Space.Compact direction="vertical">
        <Progress percent={progress} status="active" />
        <p style={{ marginLeft: '24px' }}>Loading resources...</p>
      </Space.Compact>
    </Flex>
  );
};

export default UploadProgress;
