import * as React from 'react';
import { Typography, Flex, Space, Button, Tag, theme } from 'antd';
import { Container } from '../../components';
import { useNavigate } from 'react-router-dom';

import { GraphList, GraphSchema } from '../../components';
import { queryDataset } from '../service';
import ListItem from './item';
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
    console.log('data', data);
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
  return (
    <Container
      breadcrumb={[
        {
          title: 'Home',
        },
        {
          title: 'dataset',
        },
      ]}
    >
      <Flex justify="flex-end" align="center">
        <Button
          onClick={() => {
            navigation('/dataset/create');
          }}
        >
          Create Dataset
        </Button>
      </Flex>
      {lists.map(item => {
        return <ListItem key={item.id} {...item} />;
      })}
    </Container>
  );
};

export default List;
