import React, { useEffect, useRef, useState } from 'react';
import { Input, Button, Modal, Flex, Typography, Select } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';
import { Utils } from '@graphscope/studio-components';
import { models } from './query';
interface ISettingProps {
  style?: React.CSSProperties;
}

const Setting: React.FunctionComponent<ISettingProps> = props => {
  const { style } = props;
  const [isModalOpen, setIsModalOpen] = useState(() => {
    const match = Utils.getSearchParams('tab') === 'copilot';
    return !localStorage.getItem('OPENAI_KEY_FOR_GS') && match;
  });
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
    }
    setIsModalOpen(false);
  };
  const onChangeModel = value => {
    localStorage.setItem('AI_MODEL_FOR_GS', value);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const defaultValue = localStorage.getItem('OPENAI_KEY_FOR_GS') || '';
  const defaultModel = localStorage.getItem('AI_MODEL_FOR_GS') || models[0].name;
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
          <Typography.Text strong>Select AI Model</Typography.Text>
          <Select
            defaultValue={defaultModel}
            options={models.map(item => {
              return {
                label: item.name,
                value: item.name,
              };
            })}
            onChange={onChangeModel}
          ></Select>
          <Typography.Text strong>API key</Typography.Text>
          <Input
            ref={InputRef}
            placeholder={intl.formatMessage({ id: 'API key is only stored locally in your browser' })}
            defaultValue={defaultValue}
          ></Input>
        </Flex>
      </Modal>
    </>
  );
};

export default Setting;
