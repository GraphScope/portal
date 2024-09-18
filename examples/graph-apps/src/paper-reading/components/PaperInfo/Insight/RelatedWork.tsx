import * as React from 'react';
import { Select, Flex, Typography, Button } from 'antd';
import { useContext } from '@graphscope/studio-graph';
interface IFindPathProps {}

const FindPath: React.FunctionComponent<IFindPathProps> = props => {
  const { store } = useContext();
  const { schema } = store;
  console.log('schema', schema);
  const handleChange = value => {
    console.log(`selected ${value}`);
  };
  const options = schema.nodes.map(item => {
    return {
      value: item.label,
      label: item.label,
    };
  });
  return (
    <div>
      <Flex vertical gap={8}>
        <Typography.Text type="secondary">Please select the classification criteria</Typography.Text>
        <Select defaultValue={options[0].value} style={{ width: '100%' }} onChange={handleChange} options={options} />
        <Button type="primary">Summarize Now</Button>
      </Flex>
    </div>
  );
};

export default FindPath;
