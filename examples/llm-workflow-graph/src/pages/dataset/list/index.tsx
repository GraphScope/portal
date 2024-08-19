import * as React from 'react';
import { Typography, Flex, Space, Button, Tag, theme } from 'antd';
import { Container } from '../../components';
import { useNavigate } from 'react-router-dom';

import { GraphList, GraphSchema } from '../../components';

const { useToken } = theme;

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
      <Flex vertical flex={1} style={styles.container} gap={8}>
        <Flex justify="space-between" align="center" style={styles.card}>
          <Typography.Text type="secondary">当前上传了 255 份 PDF 文件，暂未解析实体与关系</Typography.Text>
          <Space>
            <Button
              onClick={() => {
                navigation('/dataset/embed');
              }}
            >
              Embed Graph
            </Button>
            <Button
              onClick={() => {
                navigation('/dataset/extract');
              }}
            >
              Extract
            </Button>
            <Button
              onClick={() => {
                navigation('/explore/all');
              }}
            >
              View Graph
            </Button>
          </Space>
        </Flex>
        <Flex justify="space-between" gap={8}>
          <Flex style={{ ...styles.card, flexBasis: '300px' }}>
            <GraphSchema data={null} />
          </Flex>
          <Flex flex={1} style={styles.card}>
            <GraphList></GraphList>
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
};

export default List;
