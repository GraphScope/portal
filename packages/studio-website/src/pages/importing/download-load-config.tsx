import * as React from 'react';
import { Button, Tooltip } from 'antd';
import { ScheduleOutlined } from '@ant-design/icons';
import { useContext as useImporting } from '@graphscope/studio-importor';
import { Utils } from '@graphscope/studio-components';
import { FormattedMessage } from 'react-intl';
import { getLoadScheduleConfig } from './services';

interface IDownloadLoadConfigProps {
  id: string;
  graphId: string | null;
}

const DownloadLoadConfig: React.FunctionComponent<IDownloadLoadConfigProps> = props => {
  const { graphId } = props;
  const { store: importingStore } = useImporting();
  const { nodes, edges } = importingStore;
  const handleClick = async () => {
    const res = await getLoadScheduleConfig(graphId as string, { nodes, edges });
    if (res.data && res.data.config) {
      Utils.createDownload(res.data.config, 'load_config.text');
    }
  };
  return (
    <Tooltip title={'Download Load Task Config'}>
      <Button type="text" icon={<ScheduleOutlined />} onClick={handleClick}></Button>
    </Tooltip>
  );
};

export default DownloadLoadConfig;
