import React, { useState, useEffect, useRef } from "react";
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
} from "antd";
import {
  PlayCircleOutlined,
  ClearOutlined,
  DownloadOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import type { SelectProps } from "antd";
import duckDBService from "../services/duckdbService";

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

type ExportFormat = "csv" | "json" | "tsv";

const QueryPage: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const [queryResult, setQueryResult] = useState<QueryResult[] | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [executing, setExecuting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("csv");
  const [activeTab, setActiveTab] = useState<string>("query");
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
      message.error("加载数据集失败: " + (error as Error).message);
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

      message.success(`数据集 "${datasetName}" 已加载`);
    } catch (error) {
      message.error("加载数据集失败: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const executeQuery = async (): Promise<void> => {
    if (!query.trim()) {
      message.warning("请输入查询语句");
      return;
    }

    try {
      setExecuting(true);
      setError(null);
      setActiveTab("results");

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
          if (text === null) return <span style={{ color: "#999" }}>NULL</span>;
          return String(text);
        },
      }));

      setColumns(columns);
      setQueryResult(data);

      message.success(`查询成功，返回 ${data.length} 条记录`);
    } catch (error) {
      setError((error as Error).message);
      message.error("查询执行失败: " + (error as Error).message);
    } finally {
      setExecuting(false);
    }
  };

  const clearQuery = (): void => {
    setQuery("");
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  };

  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text).then(
      () => {
        message.success("已复制到剪贴板");
      },
      () => {
        message.error("复制失败");
      }
    );
  };

  const exportData = (): void => {
    if (!queryResult || queryResult.length === 0) {
      message.warning("没有数据可导出");
      return;
    }

    try {
      let content = "";
      const header = columns.map((col) => col.title);

      if (exportFormat === "csv") {
        // CSV 格式
        content = [
          header.join(","),
          ...queryResult.map((row) =>
            header
              .map((key) => {
                const value = row[key];
                return value === null ? "" : String(value).replace(/,/g, ";");
              })
              .join(",")
          ),
        ].join("\n");
      } else if (exportFormat === "json") {
        // JSON 格式
        content = JSON.stringify(queryResult, null, 2);
      } else if (exportFormat === "tsv") {
        // TSV 格式
        content = [
          header.join("\t"),
          ...queryResult.map((row) =>
            header
              .map((key) => {
                const value = row[key];
                return value === null ? "" : String(value).replace(/\t/g, " ");
              })
              .join("\t")
          ),
        ].join("\n");
      }

      // 创建下载链接
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `query-result.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      message.success(`数据已导出为 ${exportFormat.toUpperCase()} 格式`);
    } catch (error) {
      message.error("导出失败: " + (error as Error).message);
    }
  };

  return (
    <div>
      <Title level={2}>数据查询</Title>
      <Paragraph>
        在这里您可以使用 SQL
        查询您的数据集。先选择一个数据集，然后编写并执行查询。
      </Paragraph>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space align='center' style={{ marginBottom: 16 }}>
            <Text strong>选择数据集:</Text>
            <Select
              placeholder='选择要查询的数据集'
              style={{ width: 240 }}
              onChange={handleSelectDataset}
              loading={loading}
              disabled={loading}
            >
              {datasets.map((dataset) => (
                <Option key={dataset.name} value={dataset.name}>
                  {dataset.name} ({dataset.rowCount.toLocaleString()} 行)
                </Option>
              ))}
            </Select>
          </Space>

          <Divider />

          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab='查询' key='query'>
              <div style={{ marginBottom: 16 }}>
                <TextArea
                  ref={textAreaRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='输入 SQL 查询语句...'
                  autoSize={{ minRows: 6, maxRows: 12 }}
                  disabled={!selectedDataset || executing}
                  className='query-editor'
                />
              </div>

              <Space>
                <Button
                  type='primary'
                  icon={<PlayCircleOutlined />}
                  onClick={executeQuery}
                  loading={executing}
                  disabled={!selectedDataset || !query.trim()}
                >
                  执行查询
                </Button>
                <Button
                  icon={<ClearOutlined />}
                  onClick={clearQuery}
                  disabled={!query || executing}
                >
                  清除
                </Button>
              </Space>

              {error && (
                <div style={{ marginTop: 16, color: "red" }}>
                  <Text type='danger' strong>
                    错误:
                  </Text>
                  <pre
                    style={{
                      background: "#fff2f0",
                      padding: 12,
                      borderRadius: 4,
                      border: "1px solid #ffccc7",
                    }}
                  >
                    {error}
                  </pre>
                </div>
              )}
            </TabPane>

            <TabPane tab='结果' key='results'>
              {queryResult && (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <Space>
                      <Radio.Group
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value)}
                      >
                        <Radio.Button value='csv'>CSV</Radio.Button>
                        <Radio.Button value='json'>JSON</Radio.Button>
                        <Radio.Button value='tsv'>TSV</Radio.Button>
                      </Radio.Group>
                      <Button icon={<DownloadOutlined />} onClick={exportData}>
                        导出数据
                      </Button>
                    </Space>
                  </div>

                  <Table
                    dataSource={queryResult}
                    columns={columns}
                    scroll={{ x: "max-content" }}
                    pagination={{ pageSize: 10 }}
                  />
                </>
              )}
            </TabPane>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default QueryPage;
