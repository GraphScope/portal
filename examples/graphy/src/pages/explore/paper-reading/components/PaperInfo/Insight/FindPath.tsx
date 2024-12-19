import * as React from 'react';
import { Select, Flex, Typography, Button } from 'antd';

import { SERVICES } from '../../registerServices';
interface IFindPathProps {}

const FindPath: React.FunctionComponent<IFindPathProps> = props => {
  const handleChange = value => {
    console.log(`selected ${value}`);
  };
  const onClick = async () => {
    const data = await SERVICES.queryCypher({
      script: ``,
    });
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
