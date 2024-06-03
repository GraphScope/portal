import * as React from 'react';
import { Row, Space, Button, Typography } from 'antd';

interface IGrootCaseProps {}

const GrootCase: React.FunctionComponent<IGrootCaseProps> = props => {
  //@ts-ignore
  const isGroot = window.GS_ENGINE_TYPE === 'groot';
  const handleSubmit = () => {};
  const handleDelete = () => {};
  return (
    <Row justify="end">
      {isGroot && (
        <Space>
          <Button size="small" type="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button size="small" type="primary" danger ghost onClick={handleDelete}>
            Delete
          </Button>
        </Space>
      )}
    </Row>
  );
};

export default GrootCase;
