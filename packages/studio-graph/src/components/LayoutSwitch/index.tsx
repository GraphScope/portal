import * as React from 'react';
import { LayoutOutlined } from '@ant-design/icons';
import { Button, Flex, Popover, Radio, Typography } from 'antd';
import { Illustration } from '@graphscope/studio-components';
import { useContext } from '../../hooks/useContext';
interface ILayoutSwitchProps {}
const getOption = (value, title) => {
  return {
    label: (
      <Flex justify="center" align="center" vertical gap={12}>
        <Illustration.Welcome style={{ width: '100px', height: '100px' }} />
        <Typography.Text>{title}</Typography.Text>
      </Flex>
    ),
    value: value,
    style: {
      height: '150px',
    },
  };
};
const options = [
  getOption('force', 'Force Layout'),
  getOption('force-combo', 'Force Combo'),
  getOption('force-dagre', 'Force Dagre'),
  getOption('dagre', 'Dagre Layout'),
];
const LayoutContent = () => {
  const { store, updateStore } = useContext();
  const handleChange = e => {
    updateStore(draft => {
      draft.layout = {
        type: e.target.value,
        options: {},
      };
    });
  };

  return <Radio.Group block options={options} defaultValue="force" optionType="button" onChange={handleChange} />;
};
const LayoutSwitch: React.FunctionComponent<ILayoutSwitchProps> = props => {
  return (
    <Popover content={<LayoutContent />} title="Switch Layout" placement="right">
      <Button type="text" icon={<LayoutOutlined />}></Button>
    </Popover>
  );
};

export default LayoutSwitch;
