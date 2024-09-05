import React, { useEffect, useState } from 'react';
import { Typography, CollapseProps, Collapse, Flex, Input, Button } from 'antd';
import { useContext } from '@graphscope/studio-importor';

interface IRightSideProps {}

const Content = props => {
  const { id, data, onChange } = props;

  const [state, setState] = useState({
    name: data.label,
    prompt: `What are the primary "Entity" that the dataset addresses?`,
  });
  const { name, prompt } = state;
  useEffect(() => {
    setState({
      ...state,
      name: data.label,
    });
  }, [data.label]);

  const handleName = e => {
    const { value } = e.target;
    onChange && onChange(id, 'label', value);
  };
  const handlePrompt = e => {
    const { value } = e.target;
    onChange && onChange(id, 'prompt', value);
  };
  return (
    <Flex vertical gap={12}>
      <Typography.Text>Entity Name</Typography.Text>
      <Input
        value={name}
        onBlur={handleName}
        onChange={e => {
          setState({
            ...state,
            name: e.target.value,
          });
        }}
      ></Input>
      <Typography.Text>Prompts</Typography.Text>
      <Input.TextArea
        rows={5}
        value={prompt}
        onChange={e => {
          setState({
            ...state,
            prompt: e.target.value,
          });
        }}
        onBlur={handlePrompt}
      ></Input.TextArea>
    </Flex>
  );
};
const RightSide: React.FunctionComponent<IRightSideProps> = props => {
  const { store, updateStore } = useContext();
  const { nodes, edges, currentId } = store;
  const onChange = (id, key, value) => {
    console.log(id, value);
    updateStore(draft => {
      draft.nodes = draft.nodes.map(node => {
        if (node.id === id) {
          node.data[key] = value;
        }
        return node;
      });
    });
  };
  const items: CollapseProps['items'] = nodes.map(item => {
    return {
      key: item.id,
      label: item.data.label,
      children: <Content id={item.id} data={item.data} onChange={onChange} />,
    };
  });
  return (
    <div>
      <Typography.Title level={5}></Typography.Title>
      <Collapse items={items} defaultActiveKey={[currentId]} accordion activeKey={[currentId]} />
    </div>
  );
};

export default RightSide;
