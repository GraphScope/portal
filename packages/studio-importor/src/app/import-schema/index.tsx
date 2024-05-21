import React, { useState } from 'react';
import { Button, Modal, Segmented } from 'antd';
import { UngroupOutlined } from '@ant-design/icons';
interface IImportSchemaProps {
  style?: React.CSSProperties;
  displayType?: 'model' | 'panel';
}

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
          <Segmented options={['CSV', 'Database', 'GPT', 'Configaration']}></Segmented>
          <div>....</div>
        </Modal>
      </>
    );
  }
  return (
    <div>
      <Segmented options={['CSV', 'Database', 'GPT', 'Configaration']}></Segmented>
      <div>....</div>
    </div>
  );
};

export default ImportSchema;
