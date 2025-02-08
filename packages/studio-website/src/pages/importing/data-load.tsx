import { Button, Modal, Result, Typography, Tooltip } from 'antd';
import * as React from 'react';
import { useContext } from '../../layouts/useContext';
import { useContext as useImporting } from '@graphscope/studio-importor';
import { FormattedMessage } from 'react-intl';
import StartLoad from './start-load';
import { CloudUploadOutlined } from '@ant-design/icons';

const { Text } = Typography;
interface StartImportingProps {
  onClick?: () => void;
  id: string;
}
const { useState } = React;
const DataLoad: React.FunctionComponent<StartImportingProps> = props => {
  const { store } = useContext(props.id);
  const { store: importingStore, updateStore: updateImportingStore } = useImporting();
  const { appMode, nodes, edges } = importingStore;
  const { graphId } = store;
  console.log(nodes, edges);

  const [state, updateState] = useState<{
    open: boolean;
  }>({
    open: false,
  });
  const { open } = state;

  const handleClick = async () => {
    updateState(preset => {
      return {
        ...preset,
        open: true,
      };
    });
  };

  const onColse = () => {
    updateState(preset => {
      return {
        ...preset,
        open: false,
        result: undefined,
      };
    });
  };
  const isAllNodesBind = nodes.every(node => {
    return node.data.isBind;
  });
  const isAllEdgesBind = edges.every(edge => {
    return edge.data.isBind;
  });
  const isBind = isAllNodesBind && isAllEdgesBind;

  if (appMode === 'DATA_IMPORTING') {
    const title = <FormattedMessage id="Click to load all label's data" />;
    return (
      <>
        <Tooltip title={title}>
          <Button disabled={!isBind} onClick={handleClick} icon={<CloudUploadOutlined />} type="text"></Button>
        </Tooltip>
        <Modal title="" open={open} footer={null} closable={false} width={600} onCancel={onColse}>
          <StartLoad onColse={onColse} graphId={graphId || ''} />
        </Modal>
      </>
    );
  }
  return null;
};

export default DataLoad;
