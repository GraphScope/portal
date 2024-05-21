import React, { useState } from 'react';
import { Button, Modal, Segmented } from 'antd';
import { UngroupOutlined } from '@ant-design/icons';
interface IImportSchemaProps {
  style?: React.CSSProperties;
}

const ImportSchema: React.FunctionComponent<IImportSchemaProps> = props => {
  const { style } = props;
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
  return (
    <div>
      <Button type="text" onClick={handleClick} style={style} icon={<UngroupOutlined />}></Button>
      <Modal title="import schema" open={visible} onOk={handleClose} onCancel={handleClose}>
        <Segmented options={['CSV', 'Database', 'GPT', 'Configaration']}></Segmented>
        <div>....</div>
      </Modal>
    </div>
  );
};

export default ImportSchema;
