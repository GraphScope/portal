import React, { useEffect, useRef, useState } from 'react';
import { Input, Button, Modal, Flex, Typography, Select, Switch } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';
import { Utils } from '@graphscope/studio-components';
import { useContext } from '@graphscope/studio-graph';

interface ISettingProps {
  style?: React.CSSProperties;
}

const Setting: React.FunctionComponent<ISettingProps> = props => {
  const { style } = props;
  const { store } = useContext();
  const { schema } = store;
  const [isModalOpen, setIsModalOpen] = useState(() => {
    const match = Utils.getSearchParams('tab') === 'copilot';
    return !localStorage.getItem('OPENAI_KEY_FOR_GS') && match;
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const onChangeKeys = value => {
    console.log('values', value);
    Utils.storage.set('exploration_chart_statistical_keys', value);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const defaultStaticalKeys = Utils.storage.get('exploration_chart_statistical_keys') || [];
  const options = getPropertyOptions(schema);

  return (
    <>
      <Button icon={<SettingOutlined />} type="text" size="small" onClick={showModal} style={style}></Button>
      <Modal title={<FormattedMessage id="Setting" />} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Flex vertical gap={12}>
          <Typography.Text>
            <FormattedMessage id="Statistical property fields" />
          </Typography.Text>
          <Select mode="multiple" defaultValue={defaultStaticalKeys} options={options} onChange={onChangeKeys}></Select>
          {/* <Typography.Text>
            <FormattedMessage id="Support multi-select on charts" />
          </Typography.Text>
          <Switch /> */}
        </Flex>
      </Modal>
    </>
  );
};

export default Setting;

/** Utils */

import { getIconByType } from './utils';
import { Tag, Space } from 'antd';
import type { GraphSchema } from '@graphscope/studio-graph';
export function getPropertyOptions(schema: GraphSchema) {
  const nodeProperties = new Map();
  const edgeProperties = new Map();
  schema.nodes.forEach(node => {
    node.properties.forEach(property => {
      const { name, type } = property;
      const { icon, color } = getIconByType(type);
      nodeProperties.set(name, {
        value: name,
        label: (
          <Space color={color}>
            {icon}
            {name}
          </Space>
        ),
      });
    });
  });
  schema.edges.forEach(edge => {
    edge.properties.forEach(property => {
      const { name, type } = property;
      const { icon, color } = getIconByType(type);
      edgeProperties.set(name, {
        value: name,
        label: (
          <>
            {icon}
            {name}
          </>
        ),
      });
    });
  });

  return [
    {
      label: 'Vertex',
      title: 'Vertex Properties',
      options: [...Array.from(nodeProperties.values())],
    },
    {
      label: 'Edge',
      title: 'Edge Properties',
      options: [...Array.from(edgeProperties.values())],
    },
  ];
}
