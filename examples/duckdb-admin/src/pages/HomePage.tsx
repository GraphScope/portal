import React from "react";
import { Typography, Card, Button, Row, Col } from "antd";
import { Link } from "react-router-dom";

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  return (
    <div>
      <Title level={2}>欢迎使用 DuckDB CSV 查询工具</Title>
      <Paragraph>
        这是一个基于 DuckDB-WASM 的 CSV
        数据查询工具，支持数据集管理和持久化存储。 您可以上传 CSV 文件，然后使用
        SQL 查询您的数据。
      </Paragraph>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card title='管理数据集' style={{ height: "100%" }}>
            <Paragraph>
              上传、管理和删除您的 CSV 数据集。所有数据都存储在您的浏览器中。
            </Paragraph>
            <Button type='primary'>
              <Link to='/datasets'>浏览数据集</Link>
            </Button>
          </Card>
        </Col>
        <Col span={8}>
          <Card title='查询数据' style={{ height: "100%" }}>
            <Paragraph>
              使用 SQL 查询语句查询您的数据。支持 DuckDB 的所有 SQL 功能。
            </Paragraph>
            <Button type='primary'>
              <Link to='/query'>开始查询</Link>
            </Button>
          </Card>
        </Col>
        <Col span={8}>
          <Card title='关于' style={{ height: "100%" }}>
            <Paragraph>
              了解更多关于此工具的信息，包括使用的技术和功能。
            </Paragraph>
            <Button type='primary'>
              <Link to='/about'>了解更多</Link>
            </Button>
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 24 }}>
        <Title level={3}>快速入门</Title>
        <ol>
          <li>前往"数据集"页面上传您的 CSV 文件</li>
          <li>为数据集指定一个唯一的名称</li>
          <li>转到"查询"页面，选择您的数据集</li>
          <li>编写 SQL 查询并执行</li>
          <li>查看结果并根据需要导出</li>
        </ol>
      </Card>
    </div>
  );
};

export default HomePage;
