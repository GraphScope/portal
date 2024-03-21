import React, { useRef, useState } from 'react';
import { Input, Button, Modal, Flex, Typography } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';
interface ISettingProps {
  onChange: (value: string) => void;
  style?: React.CSSProperties;
}

const Setting: React.FunctionComponent<ISettingProps> = props => {
  const { onChange, style } = props;
  const [isModalOpen, setIsModalOpen] = useState(!localStorage.getItem('OPENAI_KEY_FOR_GS'));
  const InputRef = useRef(null);
  const intl = useIntl();

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
      <Modal title={<FormattedMessage id="Setting" />} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Flex vertical gap={12}>
          <Typography.Text strong>
            <FormattedMessage id="Privacy Security Notice" />
          </Typography.Text>
          <Typography.Text>
            <FormattedMessage id="query.app.sidebar.gpt.setting.security" />
          </Typography.Text>
          <Typography.Text strong>OpenAI API key</Typography.Text>
          <Input
            ref={InputRef}
            placeholder={intl.formatMessage({ id: 'OpenAI API key is only stored locally in your browser' })}
            defaultValue={defaultValue}
          ></Input>
        </Flex>
      </Modal>
    </>
  );
};

export default Setting;
