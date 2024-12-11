import * as React from 'react';
import { Tooltip, Button, TooltipProps } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { useContext } from '../../';
import { Utils } from '@graphscope/studio-components';
import { FormattedMessage } from 'react-intl';
interface IReportProps {
  title?: TooltipProps['title'];
  placement?: TooltipProps['placement'];
}

const Export: React.FunctionComponent<IReportProps> = props => {
  const { title = <FormattedMessage id="Export graph json" />, placement = 'left' } = props;
  const { store } = useContext();
  const { data } = store;
  const handleClick = () => {
    Utils.createDownload(JSON.stringify({ nodes: data.nodes, edges: data.edges }, null, 2), 'graph.json');
  };
  return (
    <Tooltip title={title} placement={placement}>
      <Button onClick={handleClick} icon={<FileTextOutlined />} type="text"></Button>
    </Tooltip>
  );
};

export default Export;
