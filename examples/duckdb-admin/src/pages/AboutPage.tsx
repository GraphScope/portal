import React from 'react';
import { Typography, Card, Divider } from 'antd';
import { FormattedMessage } from 'react-intl';

const { Title, Paragraph, Text, Link } = Typography;

const AboutPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>
        <FormattedMessage id="About DuckDB CSV Query Tool" defaultMessage="About DuckDB CSV Query Tool" />
      </Title>
      <Paragraph>
        <FormattedMessage
          id="This is a CSV data query tool based on DuckDB-WASM, supporting dataset management and persistent storage. You can upload CSV files and then query your data using SQL."
          defaultMessage="This is a CSV data query tool based on DuckDB-WASM, supporting dataset management and persistent storage. You can upload CSV files and then query your data using SQL."
        />
      </Paragraph>

      <Card style={{ marginTop: 24 }}>
        <Title level={3}>
          <FormattedMessage id="Features" defaultMessage="Features" />
        </Title>
        <ul>
          <li>
            <FormattedMessage
              id="Upload and manage multiple CSV datasets"
              defaultMessage="Upload and manage multiple CSV datasets"
            />
          </li>
          <li>
            <FormattedMessage id="Query your data using SQL" defaultMessage="Query your data using SQL" />
          </li>
          <li>
            <FormattedMessage
              id="Persistent storage of data in the browser"
              defaultMessage="Persistent storage of data in the browser"
            />
          </li>
          <li>
            <FormattedMessage
              id="Export query results as CSV, JSON, or TSV"
              defaultMessage="Export query results as CSV, JSON, or TSV"
            />
          </li>
          <li>
            <FormattedMessage
              id="Run completely in the browser, no server required"
              defaultMessage="Run completely in the browser, no server required"
            />
          </li>
        </ul>
      </Card>

      <Card style={{ marginTop: 24 }}>
        <Title level={3}>
          <FormattedMessage id="Technology Stack" defaultMessage="Technology Stack" />
        </Title>
        <Paragraph>
          <FormattedMessage
            id="This application is built using the following technologies:"
            defaultMessage="This application is built using the following technologies:"
          />
        </Paragraph>
        <ul>
          <li>
            <Text strong>DuckDB-WASM</Text> -{' '}
            <FormattedMessage
              id="SQL database that runs in the browser"
              defaultMessage="SQL database that runs in the browser"
            />
          </li>
          <li>
            <Text strong>React</Text> -{' '}
            <FormattedMessage id="User interface framework" defaultMessage="User interface framework" />
          </li>
          <li>
            <Text strong>Ant Design</Text> -{' '}
            <FormattedMessage id="UI component library" defaultMessage="UI component library" />
          </li>
          <li>
            <Text strong>IndexedDB</Text> -{' '}
            <FormattedMessage id="For persistent data storage" defaultMessage="For persistent data storage" />
          </li>
          <li>
            <Text strong>Web Workers</Text> -{' '}
            <FormattedMessage id="For background data processing" defaultMessage="For background data processing" />
          </li>
        </ul>
      </Card>

      <Card style={{ marginTop: 24 }}>
        <Title level={3}>
          <FormattedMessage id="Usage Instructions" defaultMessage="Usage Instructions" />
        </Title>
        <Title level={4}>
          <FormattedMessage id="Dataset Management" defaultMessage="Dataset Management" />
        </Title>
        <ol>
          <li>
            <FormattedMessage id="Go to the 'Datasets' page" defaultMessage="Go to the 'Datasets' page" />
          </li>
          <li>
            <FormattedMessage
              id="Click the 'Upload New Dataset' button"
              defaultMessage="Click the 'Upload New Dataset' button"
            />
          </li>
          <li>
            <FormattedMessage
              id="Provide a unique name for your dataset"
              defaultMessage="Provide a unique name for your dataset"
            />
          </li>
          <li>
            <FormattedMessage id="Select the CSV file to upload" defaultMessage="Select the CSV file to upload" />
          </li>
          <li>
            <FormattedMessage id="Click the 'Upload' button" defaultMessage="Click the 'Upload' button" />
          </li>
        </ol>

        <Divider />

        <Title level={4}>
          <FormattedMessage id="Querying Data" defaultMessage="Querying Data" />
        </Title>
        <ol>
          <li>
            <FormattedMessage id="Go to the 'Query' page" defaultMessage="Go to the 'Query' page" />
          </li>
          <li>
            <FormattedMessage
              id="Select a dataset from the dropdown menu"
              defaultMessage="Select a dataset from the dropdown menu"
            />
          </li>
          <li>
            <FormattedMessage
              id="Enter your SQL query in the query editor"
              defaultMessage="Enter your SQL query in the query editor"
            />
          </li>
          <li>
            <FormattedMessage id="Click the 'Execute Query' button" defaultMessage="Click the 'Execute Query' button" />
          </li>
          <li>
            <FormattedMessage
              id="View the query results in the 'Results' tab"
              defaultMessage="View the query results in the 'Results' tab"
            />
          </li>
          <li>
            <FormattedMessage id="Export the results as needed" defaultMessage="Export the results as needed" />
          </li>
        </ol>

        <Divider />

        <Title level={4}>
          <FormattedMessage id="SQL Examples" defaultMessage="SQL Examples" />
        </Title>
        <Paragraph>
          <FormattedMessage
            id="Here are some SQL query examples you might find useful:"
            defaultMessage="Here are some SQL query examples you might find useful:"
          />
        </Paragraph>
        <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
          {`-- 基本查询
SELECT * FROM "my_dataset" LIMIT 100;

-- 筛选数据
SELECT * FROM "my_dataset" WHERE column_name > 100;

-- 聚合查询
SELECT category, COUNT(*) as count, AVG(value) as average
FROM "my_dataset"
GROUP BY category
ORDER BY count DESC;

-- 连接查询（多个数据集）
SELECT a.*, b.additional_column
FROM "dataset_a" a
JOIN "dataset_b" b ON a.id = b.id;`}
        </pre>
      </Card>

      <Card style={{ marginTop: 24 }}>
        <Title level={3}>
          <FormattedMessage id="Data Security" defaultMessage="Data Security" />
        </Title>
        <Paragraph>
          <FormattedMessage
            id="All data is stored in your browser and is not uploaded to any server. Data is persistently stored using the browser's IndexedDB storage mechanism. Clearing your browser data will result in the loss of stored datasets."
            defaultMessage="All data is stored in your browser and is not uploaded to any server. Data is persistently stored using the browser's IndexedDB storage mechanism. Clearing your browser data will result in the loss of stored datasets."
          />
        </Paragraph>
      </Card>
    </div>
  );
};

export default AboutPage;
