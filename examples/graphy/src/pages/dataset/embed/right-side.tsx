import React, { useEffect, useState } from 'react';
import { Typography, CollapseProps, Collapse, Flex, Input, Button } from 'antd';
import { useContext } from '@graphscope/studio-importor';

interface IRightSideProps {}

const defaultOutput = {
  type: 'array',
  description: 'A list of entities in the paper.',
  item: [
    {
      name: 'name',
      type: 'string',
      description: 'The summarized name of the entity.',
    },
    {
      name: 'description',
      type: 'string',
      description: 'The description of the entity.',
    },
    {
      name: 'solution',
      type: 'string',
      description: 'The solution of the entity.',
    },
  ],
};
const Content = props => {
  const { id, data, onChange } = props;
  const defaultQuery = data.query || `What are the primary "Entity" that the dataset addresses?`;
  const defaultOutputSchema = JSON.stringify(data.output_schema, null, 2) || JSON.stringify(defaultOutput, null, 2);
  const defaultName = data.name || data.label || 'Entity';
  const [state, setState] = useState({
    name: defaultName,
    query: defaultQuery,
    output_schema: defaultOutputSchema,
    extract_from_indexs: data.extract_from.exact || '',
    extract_from_words: data.extract_from.match || '',
  });
  const { name, query, output_schema, extract_from_indexs, extract_from_words } = state;
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
    onChange && onChange(id, 'query', value);
  };
  const handleOutput = e => {
    const { value } = e.target;
    onChange && onChange(id, 'output_schema', value);
  };
  const handleExtractIndexs = e => {
    const { value } = e.target;
    onChange && onChange(id, 'extract_from_indexs', value);
  };
  const handleExtractWords = e => {
    const { value } = e.target;
    onChange && onChange(id, 'extract_from_words', value);
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
        rows={8}
        value={query}
        onChange={e => {
          setState({
            ...state,
            query: e.target.value,
          });
        }}
        onBlur={handlePrompt}
      ></Input.TextArea>
      <Typography.Text>Extract</Typography.Text>
      <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
        Extract from page indexs
      </Typography.Text>
      <Input.TextArea
        placeholder="such as 1,2,3"
        rows={1}
        value={extract_from_indexs}
        onChange={e => {
          setState({
            ...state,
            extract_from_indexs: e.target.value,
          });
        }}
        onBlur={handleExtractIndexs}
      ></Input.TextArea>
      <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
        Extract from match wordings
      </Typography.Text>
      <Input.TextArea
        placeholder="such as background,keyword"
        rows={1}
        value={extract_from_words}
        onChange={e => {
          setState({
            ...state,
            extract_from_words: e.target.value,
          });
        }}
        onBlur={handleExtractWords}
      ></Input.TextArea>
      <Typography.Text>Output</Typography.Text>
      <Input.TextArea
        rows={8}
        value={output_schema}
        onChange={e => {
          setState({
            ...state,
            output_schema: e.target.value,
          });
        }}
        onBlur={handleOutput}
      ></Input.TextArea>
    </Flex>
  );
};
const RightSide: React.FunctionComponent<IRightSideProps> = props => {
  const { store, updateStore } = useContext();
  const { nodes, edges, currentId } = store;

  const onChange = (id, key, value) => {
    console.log(id, key, value);
    updateStore(draft => {
      draft.nodes = draft.nodes.map(node => {
        if (node.id === id) {
          node.data[key] = value;
        }
        return node;
      });
    });
  };
  console.log(nodes);
  const items: CollapseProps['items'] = nodes.map(item => {
    return {
      key: item.id,
      label: item.data.label,
      children: <Content id={item.id} data={item.data} onChange={onChange} />,
    };
  });
  const onChangeCollapse = e => {
    // console.log('e', e, currentId);
    updateStore(draft => {
      draft.currentId = e[0];
    });
  };
  return (
    <div>
      <Typography.Title level={5}></Typography.Title>
      <Collapse
        items={items}
        defaultActiveKey={[currentId]}
        accordion
        activeKey={[currentId]}
        onChange={onChangeCollapse}
      />
    </div>
  );
};

export default RightSide;
