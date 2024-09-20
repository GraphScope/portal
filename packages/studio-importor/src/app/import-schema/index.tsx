import React, { useState } from 'react';
import { Button, Modal, Segmented, Space, Tooltip } from 'antd';
import { UngroupOutlined } from '@ant-design/icons';
import ImportFromCSV from './import-from-csv';
import ImportFromSQL from './import-from-sql';
import ImportFromYAML from './import-from-yaml';
import { SegmentedTabs, Icons } from '@graphscope/studio-components';
import type { SegmentedTabsProps } from '@graphscope/studio-components';

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
        <Tooltip title="Shortcut: parse files into a graph model" placement="left">
          <Button type="text" onClick={handleClick} style={style} icon={<Icons.FileYaml />}></Button>
        </Tooltip>

        <Modal
          title="Parse files into a graph model"
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
