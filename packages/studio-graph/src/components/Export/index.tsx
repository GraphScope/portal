import * as React from 'react';
import { Tooltip, Button } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { useContext } from '../../hooks/useContext';
import { Utils } from '@graphscope/studio-components';
interface IReportProps {}

const Export: React.FunctionComponent<IReportProps> = props => {
  const { store } = useContext();
  const { data } = store;
  const handleClick = () => {
    Utils.createDownload(JSON.stringify(data, null, 2), 'graph.json');
  };
  return (
    <Tooltip title="Export graph json" placement="left">
      <Button onClick={handleClick} icon={<FileTextOutlined />} type="text"></Button>
    </Tooltip>
  );
};

export default Export;
