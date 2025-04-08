import React, { useState, useEffect, useRef } from 'react';
import {
  Typography,
  Button,
  Table,
  Card,
  Spin,
  Select,
  message,
  Tabs,
  Input,
  Space,
  Divider,
  Tooltip,
  Radio,
} from 'antd';
import { PlayCircleOutlined, ClearOutlined, DownloadOutlined, CopyOutlined } from '@ant-design/icons';
import type { SelectProps } from 'antd';
import duckDBService from '../services/duckdbService';
import { FormattedMessage, useIntl } from 'react-intl';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

interface Dataset {
  name: string;
  rowCount: number;
}

interface QueryResult {
  [key: string]: any;
}

interface Column {
  title: string;
  dataIndex: string;
  key: string;
  ellipsis: boolean;
  render: (text: any) => React.ReactNode;
}

interface Field {
  name: string;
  type: string;
}

type ExportFormat = 'csv' | 'json' | 'tsv';

const QueryPage: React.FC = () => {
  const intl = useIntl();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');
  const [queryResult, setQueryResult] = useState<QueryResult[] | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [executing, setExecuting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');
  const [activeTab, setActiveTab] = useState<string>('query');
  const textAreaRef = useRef<any>(null);

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async (): Promise<void> => {
    try {
      setLoading(true);
      const allDatasets = await duckDBService.getAllDatasets();
      setDatasets(allDatasets);
    } catch (error) {
      message.error(<FormattedMessage id="Failed to load datasets" />);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDataset = async (datasetName: string): Promise<void> => {
    try {
      setLoading(true);
      setSelectedDataset(datasetName);

      // 加载数据集
      await duckDBService.loadDataset(datasetName);

      // 设置默认查询
      setQuery(`SELECT * FROM "${datasetName}" LIMIT 100`);

      message.success(<FormattedMessage id="Dataset '{name}' loaded" values={{ name: datasetName }} />);
    } catch (error) {
      message.error(<FormattedMessage id="Failed to load dataset" />);
    } finally {
      setLoading(false);
    }
  };

  const executeQuery = async (): Promise<void> => {
    if (!query.trim()) {
      message.warning(<FormattedMessage id="Please enter a query" />);
      return;
    }

    try {
      setExecuting(true);
      setError(null);
      setActiveTab('results');

      const result = await duckDBService.executeQuery(query);

      // 处理结果数据
      const data = result.toArray();

      // 创建列定义
      const columns = result.schema.fields.map((field: Field) => ({
        title: field.name,
        dataIndex: field.name,
        key: field.name,
        ellipsis: true,
        render: (text: any) => {
          if (text === null) return <span style={{ color: '#999' }}>NULL</span>;
          return String(text);
        },
      }));

      setColumns(columns);
      setQueryResult(data);

      message.success(
        <FormattedMessage id="Query successful, {count} records returned" values={{ count: data.length }} />,
      );
    } catch (error) {
      setError((error as Error).message);
      message.error(
        <FormattedMessage id="Query execution failed: {message}" values={{ message: (error as Error).message }} />,
      );
    } finally {
      setExecuting(false);
    }
  };

  const clearQuery = (): void => {
    setQuery('');
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  };

  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text).then(
      () => {
        message.success(<FormattedMessage id="Copied to clipboard" />);
      },
      () => {
        message.error(<FormattedMessage id="Copy failed" />);
      },
    );
  };

  const exportData = (): void => {
    if (!queryResult || queryResult.length === 0) {
      message.warning(<FormattedMessage id="No data to export" />);
      return;
    }

    try {
      let content = '';
      const header = columns.map(col => col.title);

      if (exportFormat === 'csv') {
        // CSV 格式
        content = [
          header.join(','),
          ...queryResult.map(row =>
            header
              .map(key => {
                const value = row[key];
                return value === null ? '' : String(value).replace(/,/g, ';');
              })
              .join(','),
          ),
        ].join('\n');
      } else if (exportFormat === 'json') {
        // JSON 格式
        content = JSON.stringify(queryResult, null, 2);
      } else if (exportFormat === 'tsv') {
        // TSV 格式
        content = [
          header.join('\t'),
          ...queryResult.map(row =>
            header
              .map(key => {
                const value = row[key];
                return value === null ? '' : String(value).replace(/\t/g, ' ');
              })
              .join('\t'),
          ),
        ].join('\n');
      }

      // 创建下载链接
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `query-result.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      message.success(
        <FormattedMessage id="Data exported as {format} format" values={{ format: exportFormat.toUpperCase() }} />,
      );
    } catch (error) {
      message.error(<FormattedMessage id="Export failed" />);
    }
  };

  return (
    <div>
      <Title level={2}>
        <FormattedMessage id="SQL Query" />
      </Title>
      <Paragraph>
        <FormattedMessage id="Execute SQL queries on your datasets" />
      </Paragraph>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space align="center" style={{ marginBottom: 16 }}>
            <Text strong>
              <FormattedMessage id="Select Dataset" />:
            </Text>
            <Select
              placeholder={intl.formatMessage({ id: 'Select a dataset to query' })}
              style={{ width: 240 }}
              onChange={handleSelectDataset}
              loading={loading}
              disabled={loading}
            >
              {datasets.map(dataset => (
                <Option key={dataset.name} value={dataset.name}>
                  {dataset.name} ({dataset.rowCount.toLocaleString()} <FormattedMessage id="rows" />)
                </Option>
              ))}
            </Select>
          </Space>

          <Divider />

          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab={intl.formatMessage({ id: 'Query' })} key="query">
              <div style={{ marginBottom: 16 }}>
                <TextArea
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={intl.formatMessage({ id: 'Enter your SQL query here' })}
                  autoSize={{ minRows: 6, maxRows: 12 }}
                  style={{ fontFamily: 'monospace' }}
                  ref={textAreaRef}
                />
              </div>

              <Space>
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  onClick={executeQuery}
                  loading={executing}
                  disabled={!selectedDataset}
                >
                  <FormattedMessage id="Execute Query" />
                </Button>
                <Button icon={<ClearOutlined />} onClick={clearQuery} disabled={!query}>
                  <FormattedMessage id="Clear" />
                </Button>
              </Space>
            </TabPane>

            <TabPane tab={intl.formatMessage({ id: 'Results' })} key="results">
              {error ? (
                <div className="error-message">
                  <Title level={4} style={{ color: 'red' }}>
                    <FormattedMessage id="Error executing query" />:
                  </Title>
                  <pre>{error}</pre>
                </div>
              ) : queryResult && queryResult.length > 0 ? (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <Space>
                      <Text strong>
                        <FormattedMessage id="Export as" />:
                      </Text>
                      <Radio.Group
                        value={exportFormat}
                        onChange={e => setExportFormat(e.target.value)}
                        buttonStyle="solid"
                        size="small"
                      >
                        <Radio.Button value="csv">CSV</Radio.Button>
                        <Radio.Button value="json">JSON</Radio.Button>
                        <Radio.Button value="tsv">TSV</Radio.Button>
                      </Radio.Group>
                      <Button icon={<DownloadOutlined />} onClick={exportData} size="small">
                        <FormattedMessage id="Export" />
                      </Button>
                      <Button
                        icon={<CopyOutlined />}
                        onClick={() => copyToClipboard(JSON.stringify(queryResult, null, 2))}
                        size="small"
                      >
                        <FormattedMessage id="Copy as JSON" />
                      </Button>
                    </Space>
                  </div>

                  <Table
                    dataSource={queryResult}
                    columns={columns}
                    rowKey={(record, index) => `${index}`}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      pageSizeOptions: ['10', '20', '50', '100'],
                    }}
                    scroll={{ x: 'max-content' }}
                    size="small"
                    bordered
                  />

                  <div style={{ marginTop: 16 }}>
                    <Text>
                      <FormattedMessage id="Showing" /> {queryResult.length} <FormattedMessage id="records" />
                    </Text>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <Paragraph>
                    <FormattedMessage id="No results to display" />
                  </Paragraph>
                  <Paragraph>
                    <FormattedMessage id="Execute a query to see results" />
                  </Paragraph>
                </div>
              )}
            </TabPane>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default QueryPage;
