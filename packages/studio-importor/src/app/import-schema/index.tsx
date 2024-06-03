import React, { useState } from 'react';
import { Button, Modal, Segmented } from 'antd';
import { UngroupOutlined } from '@ant-design/icons';
import ImportFromCSV from './import-from-csv';
import ImportFromSQL from './import-from-sql';
import ImportFromYaml from './import-from-yaml';
import { SegmentedTabs } from '@graphscope/studio-components';
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
    label: 'SQL DDL',
    key: 'SQL',
    children: <ImportFromSQL />,
  },
  {
    label: 'YAML',
    key: 'YAML',
    children: <ImportFromYaml />,
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
      <>
        <Button type="text" onClick={handleClick} style={style} icon={<UngroupOutlined />}></Button>
        <Modal title="import schema" open={visible} onOk={handleClose} onCancel={handleClose}>
          <Segmented options={['CSV', 'SQL DDL', 'YAML']} block></Segmented>
        </Modal>
      </>
    );
  }
  return (
    <div style={{ height: '100%' }}>
      <SegmentedTabs items={items} block />
      {/* <Segmented options={['CSV', 'SQL DDL', 'YAML']} block></Segmented>
      <div style={{ height: 'calc(100% - 40px)', padding: '12px 0px', boxSizing: 'border-box' }}>
      
      </div> */}
    </div>
  );
};

export default ImportSchema;
