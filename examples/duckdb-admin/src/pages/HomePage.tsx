import React from 'react';
import { Typography, Card, Button, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  return (
    <div>
      <Title level={2}>
        <FormattedMessage id="Welcome to DuckDB CSV Query Tool" />
      </Title>
      <Paragraph>
        <FormattedMessage id="This is a CSV data query tool based on DuckDB-WASM, supporting dataset management and persistent storage. You can upload CSV files and then query your data using SQL." />
      </Paragraph>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card title={<FormattedMessage id="Dataset Manager" />} style={{ height: '100%' }}>
            <Paragraph>
              <FormattedMessage id="Upload, manage and delete your CSV datasets. All data is stored in your browser." />
            </Paragraph>
            <Button type="primary">
              <Link to="/datasets">
                <FormattedMessage id="Browse Datasets" />
              </Link>
            </Button>
          </Card>
        </Col>
        <Col span={8}>
          <Card title={<FormattedMessage id="Query Data" />} style={{ height: '100%' }}>
            <Paragraph>
              <FormattedMessage id="Query your data with SQL statements. Supports all SQL features of DuckDB." />
            </Paragraph>
            <Button type="primary">
              <Link to="/query">
                <FormattedMessage id="Start Querying" />
              </Link>
            </Button>
          </Card>
        </Col>
        <Col span={8}>
          <Card title={<FormattedMessage id="About" />} style={{ height: '100%' }}>
            <Paragraph>
              <FormattedMessage id="Learn more about this tool, including technologies used and features." />
            </Paragraph>
            <Button type="primary">
              <Link to="/about">
                <FormattedMessage id="Learn More" />
              </Link>
            </Button>
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 24 }}>
        <Title level={3}>
          <FormattedMessage id="Quick Start" />
        </Title>
        <ol>
          <li>
            <FormattedMessage id="Go to the 'Datasets' page to upload your CSV file" />
          </li>
          <li>
            <FormattedMessage id="Give your dataset a unique name" />
          </li>
          <li>
            <FormattedMessage id="Go to the 'Query' page and select your dataset" />
          </li>
          <li>
            <FormattedMessage id="Write SQL queries and execute them" />
          </li>
          <li>
            <FormattedMessage id="View results and export as needed" />
          </li>
        </ol>
      </Card>
    </div>
  );
};

export default HomePage;
