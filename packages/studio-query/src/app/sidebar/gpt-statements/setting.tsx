import React, { useRef, useState } from 'react';
import { Input, Button, Modal } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
interface ISettingProps {
  onChange: (value: string) => void;
  style?: React.CSSProperties;
}

const Setting: React.FunctionComponent<ISettingProps> = props => {
  const { onChange, style } = props;
  const [isModalOpen, setIsModalOpen] = useState(!localStorage.getItem('OPENAI_KEY_FOR_GS'));
  const InputRef = useRef(null);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (InputRef.current) {
      //@ts-ignore
      const { value } = InputRef.current.input;
      const val = String(value).trim();
      localStorage.setItem('OPENAI_KEY_FOR_GS', val);
      onChange && onChange(val);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const defaultValue = localStorage.getItem('OPENAI_KEY_FOR_GS') || '';
  return (
    <>
      <Button icon={<SettingOutlined />} type="text" onClick={showModal} style={style}></Button>
      <Modal title="Setting OPENAI KEY" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div>
          <Input ref={InputRef} placeholder="please setting openai key" defaultValue={defaultValue}></Input>
        </div>
      </Modal>
    </>
  );
};

export default Setting;
