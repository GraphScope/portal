import * as React from 'react';
import { history } from 'umi';
import { UploadOutlined, EllipsisOutlined, ApartmentOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Card, Row, Col, Divider } from 'antd';
interface InstanceProps {}
const { Meta } = Card;
const Instance: React.FunctionComponent<InstanceProps> = props => {
  return (
    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '6px' }}>
      <Row>
        <Col span={4}>
          <Card
            style={{
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              textAlign: 'center',
            }}
            onClick={() => {
              history.push('/instance/list');
            }}
          >
            <PlusOutlined />
            <p>Create Graph Instance </p>
          </Card>
        </Col>
        <Col span={4} push={1}>
          <Card
            actions={[
              <ApartmentOutlined
                key="setting"
                onClick={() => {
                  history.push('/instance/create','detail');
                }}
              />,
              <UploadOutlined
                key="edit"
                onClick={() => {
                  history.push('/instance/import');
                }}
              />,
              <EllipsisOutlined
                key="ellipsis"
                onClick={() => {
                  history.push('/instance/schema');
                }}
              />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
              title="DEFAULT GRAPH"
              description={
                <div>
                  <p>这是一个电影图谱</p>
                  <p>2023-12-27 10:00:00</p>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Instance;
