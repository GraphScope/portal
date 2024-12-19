import * as React from 'react';
import { Typography, Flex, Space, Button, Tag, theme, Result } from 'antd';
import { Container } from '../../components';
import { useNavigate } from 'react-router-dom';

import { GraphList, GraphSchema } from '../../components';
import { queryDataset } from '../service';
import ListItem from './item';
import Action from './action';
const { useToken } = theme;
import type { IDataset } from '../typing';

const styles: Record<string, React.CSSProperties> = {
  container: {
    margin: '24px 0px',
    padding: '12px',
    background: '#f4f6f8',
  },
  card: {
    borderRadius: '4px',
    padding: '12px',
    background: '#fff',
  },
};

interface IListProps {}

const List: React.FunctionComponent<IListProps> = props => {
  const navigation = useNavigate();
  const [state, setState] = React.useState<{
    lists: IDataset[];
  }>({
    lists: [],
  });
  const { lists } = state;
  const queryData = async () => {
    const data = await queryDataset();
    setState(preState => {
      return {
        ...preState,
        lists: data,
      };
    });
  };
  React.useEffect(() => {
    queryData();
  }, []);
  const isEmpty = lists.length === 0;
  return (
    <Container
      breadcrumb={[
        {
          title: 'dataset',
        },
      ]}
    >
      {!isEmpty && (
        <Flex justify="flex-start" align="center">
          <Button
            type="primary"
            onClick={() => {
              navigation('/dataset/create');
            }}
          >
            Create Dataset
          </Button>
        </Flex>
      )}
      <Flex vertical gap={24} style={{ marginTop: '24px' }}>
        {lists.map(item => {
          return <ListItem key={item.id} {...item} refreshList={queryData} />;
        })}
      </Flex>
      {isEmpty && (
        <Result
          status="404"
          title="No dataset available"
          subTitle="Please click the button below to 「Create Dataset」."
          extra={
            <Button
              onClick={() => {
                navigation('/dataset/create');
              }}
              type="primary"
            >
              Create Dataset
            </Button>
          }
        />
      )}
    </Container>
  );
};

export default List;
