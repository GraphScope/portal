import React, { useState } from 'react';
import { Button, Modal, Segmented, Space, Tooltip } from 'antd';
import { UngroupOutlined } from '@ant-design/icons';
import ImportFromCSV from './import-from-csv';
import ImportFromSQL from './import-from-sql';
import ImportFromYAML from './import-from-yaml';
import { SegmentedTabs, Icons, useStudioProvier } from '@graphscope/studio-components';
import type { SegmentedTabsProps } from '@graphscope/studio-components';

import { FormattedMessage } from 'react-intl';
import { useContext } from '../useContext';
interface IImportSchemaProps {
  style?: React.CSSProperties;
  displayType?: 'model' | 'panel';
}

const items: SegmentedTabsProps['items'] = [
  {
    label: 'CSV',
    key: 'CSV',
    children: <ImportFromCSV />,
  },
  {
    label: 'YAML',
    key: 'SQL',
    children: <ImportFromYAML icon={<Icons.FileYaml style={{ fontSize: '50px' }} />} />,
  },
];

const ImportSchema: React.FunctionComponent<IImportSchemaProps> = props => {
  const { style, displayType = 'panel' } = props;
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
  if (displayType === 'model') {
    return (
      <Space>
        <Tooltip title={<FormattedMessage id="Shortcut: parse files into a graph model" />} placement="left">
          <Button
            type="text"
            disabled={elementOptions.isEditable}
            onClick={handleClick}
            style={style}
            icon={<Icons.FileYaml style={{ color: pathFill() }} />}
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
            <SegmentedTabs items={items} block />
          </div>
        </Modal>
      </Space>
    );
  }
  return (
    <div style={{ height: '100%' }}>
      <SegmentedTabs items={items} block />
    </div>
  );
};

export default ImportSchema;
