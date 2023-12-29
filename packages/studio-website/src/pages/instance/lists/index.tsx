import * as React from 'react';
import { Button } from 'antd';
import { history } from 'umi';
interface IListsProps {}

const Lists: React.FunctionComponent<IListsProps> = props => {
  return (
    <div>
      Instance List
      <Button
        type="primary"
        onClick={() => {
          history.push('/instance/create');
        }}
      >
        create instance
      </Button>
      <Button
        type="primary"
        onClick={() => {
          history.push('/instance/import');
        }}
      >
        import data
      </Button>
      <Button
        type="primary"
        onClick={() => {
          history.push('/instance/schema');
        }}
      >
        view Schema
      </Button>
    </div>
  );
};

export default Lists;
