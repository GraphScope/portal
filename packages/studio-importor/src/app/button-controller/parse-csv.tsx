import React, { useState } from 'react';
import { Button, Modal, Segmented, Space, Tooltip } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import ImportFromCSV from '../import-schema/import-from-csv';

import { SegmentedTabs, Icons, useStudioProvier } from '@graphscope/studio-components';
import type { SegmentedTabsProps } from '@graphscope/studio-components';

import { FormattedMessage } from 'react-intl';
import { useContext } from '@graphscope/use-zustand';
interface IImportSchemaProps {
  style?: React.CSSProperties;
}

const ParseCSVButton: React.FunctionComponent<IImportSchemaProps> = props => {
  const { style } = props;
  const [state, updateState] = useState({
    visible: false,
  });
  const { visible } = state;
  const { store } = useContext();
  const { elementOptions } = store;
  const { isLight } = useStudioProvier();

  /** svg pathFill */
  let pathFill = () => {
    if (!isLight) {
      return elementOptions.isEditable ? '#585858' : '#fff';
    } else {
      return elementOptions.isEditable ? '#ddd' : '#000';
    }
  };
  const handleClick = () => {
    updateState({
      ...state,
      visible: !visible,
    });
  };
  const handleClose = () => {
    updateState({
      ...state,
      visible: false,
    });
  };

  return (
    <Space>
      <Tooltip title={<FormattedMessage id="Shortcut: parse files into a graph model" />} placement="left">
        <Button
          type="text"
          disabled={elementOptions.isEditable}
          onClick={handleClick}
          style={style}
          icon={<BulbOutlined style={{ color: pathFill() }} />}
        ></Button>
      </Tooltip>

      <Modal
        title={<FormattedMessage id="Parse files into a graph model" />}
        open={visible}
        onOk={handleClose}
        onCancel={handleClose}
        footer={null}
      >
        <div style={{ height: '60vh' }}>
          <ImportFromCSV onCallback={handleClose} />
        </div>
      </Modal>
    </Space>
  );
};

export default ParseCSVButton;
