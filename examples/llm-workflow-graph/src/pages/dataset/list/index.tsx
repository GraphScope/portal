import * as React from 'react';
import ReactDOM from 'react-dom';
import { ContentSection } from '@graphscope/studio-components';
import { Typography, Flex, Breadcrumb, Button } from 'antd';
import { CreateHeaderPortal, Container } from '../../components';
import ListCard from './card';
import { useNavigate } from 'react-router-dom';
interface IListProps {}

const List: React.FunctionComponent<IListProps> = props => {
  const navigation = useNavigate();
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
      <ListCard />
    </Container>
  );
};

export default List;
