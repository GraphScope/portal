import * as React from 'react';
import { Select, Flex, Typography, Button } from 'antd';
import { useContext } from '@graphscope/studio-graph';
import { queryCypher } from '../../../service';
interface IFindPathProps {}

const FindPath: React.FunctionComponent<IFindPathProps> = props => {
  const { updateStore } = useContext();

  const handleChange = value => {
    console.log(`selected ${value}`);
  };
  const onClick = async () => {
    const data = await queryCypher({
      script: ``,
    });
    console.log('data', data);
  };
  return (
    <div>
      <Flex vertical gap={8}>
        <Typography.Text type="secondary">Please Select the number of hops in the path</Typography.Text>
        <Select
          defaultValue="2"
          style={{ width: '100%' }}
          onChange={handleChange}
          options={[
            { value: '1', label: 'one degree' },
            { value: '2', label: 'two degree' },
            { value: '3', label: 'three degree' },
            { value: '4', label: 'four degree' },
          ]}
        />
        <Button type="primary" onClick={onClick}>
          Find Answers Now
        </Button>
      </Flex>
    </div>
  );
};

export default FindPath;
