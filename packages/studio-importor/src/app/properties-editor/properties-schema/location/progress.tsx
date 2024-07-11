import * as React from 'react';
import { Progress } from 'antd';
interface IUploadProgressProps {
  file: File;
}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const UploadProgress: React.FunctionComponent<IUploadProgressProps> = props => {
  const { file } = props;
  const [state, setState] = React.useState({
    progress: 0,
  });

  const { progress } = state;
  const calcProgress = async () => {
    const fileSize = file.size;
    //@ts-ignore
    const donwlink = (navigator.connection.downlink / 2) * 1024 * 1024;
    const totalChunks = 50;
    //@ts-ignore
    const estimatedTime = Math.round((fileSize / donwlink) * 1000);
    console.log(estimatedTime / totalChunks);
    for (let i = 0; i < totalChunks; i++) {
      await delay(estimatedTime / totalChunks);
      const progress = Math.round(((i + 1) / totalChunks) * 99);
      setState(preState => {
        return {
          ...preState,
          progress: progress,
        };
      });
    }
  };
  React.useEffect(() => {
    calcProgress();
  }, []);
  return <Progress percent={progress} size="small" status="active" style={{ margin: '2px 4px 0px 6px' }} />;
};

export default UploadProgress;
