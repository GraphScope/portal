import React, { useState, useEffect, useRef } from 'react';
import {
  Typography,
  Button,
  Table,
  Card,
  Spin,
  Select,
  message,
  Input,
  Space,
  Divider,
  Tooltip,
  Radio,
  Empty,
  Tag,
  Alert,
  Badge,
  Row,
  Col,
  Layout,
} from 'antd';
import {
  PlayCircleOutlined,
  ClearOutlined,
  DownloadOutlined,
  CopyOutlined,
  TableOutlined,
  DatabaseOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import duckDBService from '../services/duckdbService';
import { FormattedMessage, useIntl } from 'react-intl';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Content } = Layout;

// 类型定义
interface Dataset {
  id: string;
  name: string;
  description: string;
  dateCreated: string;
  tables: string[];
}

interface Table {
  name: string;
  description: string;
  fileName: string;
  rowCount: number;
  size: number;
  dateAdded: string;
  datasetId: string;
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

// 应用状态定义
interface AppState {
  // 数据集相关
  datasets: Dataset[]; // 所有数据集信息
  tables: { [datasetId: string]: Table[] }; // 数据集表的映射关系
  selectedDataset: string | null; // 当前选中的数据集ID
  selectedTable: string | null; // 当前选中的表名
  activeDataset: Dataset | null; // 当前激活的数据集

  // 查询相关
  query: string; // 当前SQL查询语句
  queryResult: QueryResult[] | null; // 查询结果数据
  columns: Column[]; // 查询结果列定义
  exportFormat: ExportFormat; // 导出格式

  // 状态标记
  loading: boolean; // 是否正在加载数据
  executing: boolean; // 是否正在执行查询
  error: string | null; // 查询错误信息
}

/**
 * 数据集选择组件
 */
const DatasetSelector = ({
  datasets,
  selectedDataset,
  loading,
  onSelect,
  onShowTables,
  onRefresh,
  activeDataset,
}: {
  datasets: Dataset[];
  selectedDataset: string | null;
  loading: boolean;
  onSelect: (datasetId: string) => void;
  onShowTables: () => void;
  onRefresh: () => void;
  activeDataset: Dataset | null;
}) => {
  const intl = useIntl();

  return (
    <Card style={{ marginBottom: 12 }} size="small" bodyStyle={{ padding: '16px' }}>
      <Row align="middle" gutter={16}>
        <Col span={6}>
          <Select
            style={{ width: '100%' }}
            placeholder={intl.formatMessage({ id: 'Select a dataset' })}
            value={selectedDataset || undefined}
            onChange={onSelect}
            loading={loading}
            disabled={loading || datasets.length === 0}
          >
            {datasets.map(dataset => (
              <Select.Option key={dataset.id} value={dataset.id}>
                <Space>
                  <DatabaseOutlined />
                  <span>{dataset.name}</span>
                  {dataset.tables.length > 0 && <Badge count={dataset.tables.length} size="small" />}
                </Space>
              </Select.Option>
            ))}
          </Select>
        </Col>

        <Col span={18}>
          <Row justify="start" gutter={16} align="middle">
            <Col>
              <Button
                type="primary"
                onClick={onShowTables}
                icon={<SearchOutlined />}
                disabled={!selectedDataset}
                size="middle"
              >
                <FormattedMessage id="Show Tables" />
              </Button>
            </Col>

            <Col>
              <Button onClick={onRefresh} icon={<ReloadOutlined />} disabled={loading} size="middle">
                <FormattedMessage id="Refresh" />
              </Button>
            </Col>

            {activeDataset && (
              <Col>
                <Tag color="blue" style={{ padding: '4px 8px', fontSize: '14px' }}>
                  <FormattedMessage id="Active Dataset" />: {activeDataset.name}
                </Tag>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

/**
 * 查询编辑器组件
 */
const QueryEditor = ({
  query,
  selectedDataset,
  selectedTable,
  activeDataset,
  executing,
  onChangeQuery,
  onExecute,
  onClear,
  textAreaRef,
}: {
  query: string;
  selectedDataset: string | null;
  selectedTable: string | null;
  activeDataset: Dataset | null;
  executing: boolean;
  onChangeQuery: (query: string) => void;
  onExecute: () => void;
  onClear: () => void;
  textAreaRef: React.RefObject<any>;
}) => {
  const intl = useIntl();

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={8}>
      <Typography.Title level={5} style={{ marginBottom: '4px', fontSize: '16px' }}>
        <FormattedMessage id="Query" />
      </Typography.Title>

      <Space direction="vertical" style={{ width: '100%' }} size={6}>
        {selectedDataset && (
          <Space wrap size={[4, 4]}>
            <Button size="small" onClick={() => onChangeQuery('SHOW TABLES')} icon={<TableOutlined />}>
              SHOW TABLES
            </Button>

            {/* 表格显示后用户可以点击表格行查询特定表 */}
            {selectedTable && activeDataset && (
              <Button
                size="small"
                onClick={() => {
                  const fullTableName = `${activeDataset.name}_${selectedTable}`;
                  onChangeQuery(`SELECT * FROM "${fullTableName}" LIMIT 100`);
                }}
              >
                SELECT * FROM "{activeDataset.name}_{selectedTable}"
              </Button>
            )}
            {selectedTable && activeDataset && (
              <Button
                size="small"
                onClick={() => {
                  const fullTableName = `${activeDataset.name}_${selectedTable}`;
                  onChangeQuery(`DESCRIBE "${fullTableName}"`);
                }}
              >
                DESCRIBE "{activeDataset.name}_{selectedTable}"
              </Button>
            )}
          </Space>
        )}

        <TextArea
          value={query}
          onChange={e => onChangeQuery(e.target.value)}
          placeholder={intl.formatMessage({ id: 'Enter your SQL query here' })}
          style={{ height: '100px', fontFamily: 'monospace', resize: 'none' }}
          ref={textAreaRef}
        />

        <Space size={4}>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={onExecute}
            loading={executing}
            disabled={!selectedDataset}
            size="small"
          >
            <FormattedMessage id="Execute Query" />
          </Button>
          <Button icon={<ClearOutlined />} onClick={onClear} disabled={!query} size="small">
            <FormattedMessage id="Clear" />
          </Button>
        </Space>
      </Space>
    </Space>
  );
};

/**
 * 查询结果组件
 */
const QueryResults = ({
  error,
  queryResult,
  columns,
  query,
  activeDataset,
  exportFormat,
  onExportFormatChange,
  onExport,
  onCopyToClipboard,
  onSelectTableRow,
}: {
  error: string | null;
  queryResult: QueryResult[] | null;
  columns: Column[];
  query: string;
  activeDataset: Dataset | null;
  exportFormat: ExportFormat;
  onExportFormatChange: (format: ExportFormat) => void;
  onExport: () => void;
  onCopyToClipboard: (data: string) => void;
  onSelectTableRow: (record: QueryResult) => void;
}) => {
  const isShowTablesQuery = query.trim().toLowerCase() === 'show tables';

  return (
    <Space direction="vertical" style={{ width: '100%', overflow: 'auto' }} size={8}>
      <Typography.Title level={5} style={{ marginBottom: '4px', fontSize: '16px' }}>
        <FormattedMessage id="Results" />
      </Typography.Title>

      {error ? (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Typography.Title level={4} style={{ color: 'red', marginBottom: '8px' }}>
            <FormattedMessage id="Error executing query" />:
          </Typography.Title>
          <pre>{error}</pre>
        </Space>
      ) : queryResult && queryResult.length > 0 ? (
        <Space direction="vertical" style={{ width: '100%', overflow: 'auto' }} size={10}>
          {isShowTablesQuery && activeDataset && (
            <Alert
              type="info"
              message={
                <FormattedMessage id="Showing tables in dataset '{name}'" values={{ name: activeDataset.name }} />
              }
              showIcon
            />
          )}

          <Space direction="vertical" style={{ width: '100%' }} size={10}>
            <Space>
              <Text strong>
                <FormattedMessage id="Export as" />:
              </Text>
              <Radio.Group
                value={exportFormat}
                onChange={e => onExportFormatChange(e.target.value)}
                buttonStyle="solid"
                size="small"
              >
                <Radio.Button value="csv">CSV</Radio.Button>
                <Radio.Button value="json">JSON</Radio.Button>
                <Radio.Button value="tsv">TSV</Radio.Button>
              </Radio.Group>
              <Button icon={<DownloadOutlined />} onClick={onExport} size="small">
                <FormattedMessage id="Export" />
              </Button>
              <Button
                icon={<CopyOutlined />}
                onClick={() => onCopyToClipboard(JSON.stringify(queryResult, null, 2))}
                size="small"
              >
                <FormattedMessage id="Copy as JSON" />
              </Button>
            </Space>

            <Table
              dataSource={queryResult}
              columns={columns}
              rowKey={(record, index) => `${index}`}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                size: 'small',
              }}
              scroll={{ x: 'max-content' }}
              size="small"
              bordered
              onRow={record => {
                return {
                  onClick: () => {
                    // 当点击表格行时，如果是SHOW TABLES查询结果，则选择该表
                    if (isShowTablesQuery && record.table_name) {
                      onSelectTableRow(record);
                    }
                  },
                  style: {
                    cursor: isShowTablesQuery && record.table_name ? 'pointer' : 'default',
                  },
                };
              }}
            />

            <Text>
              <FormattedMessage id="Showing" /> {queryResult.length} <FormattedMessage id="records" />
            </Text>
          </Space>
        </Space>
      ) : (
        <Empty
          description={
            <Space direction="vertical" size={4}>
              <Text>
                <FormattedMessage id="No results to display" />
              </Text>
              <Text>
                <FormattedMessage id="Execute a query to see results" />
              </Text>
            </Space>
          }
        />
      )}
    </Space>
  );
};

/**
 * 主查询页面组件
 */
const QueryPage: React.FC = () => {
  const intl = useIntl();

  // 初始状态值
  const initialState: AppState = {
    datasets: [],
    tables: {},
    selectedDataset: null,
    selectedTable: null,
    activeDataset: null,
    query: '',
    queryResult: null,
    columns: [],
    exportFormat: 'csv',
    loading: false,
    executing: false,
    error: null,
  };

  // 使用单一的state对象来管理所有状态
  const [state, setState] = useState<AppState>(initialState);

  // 文本区域引用
  const textAreaRef = useRef<any>(null);

  // 解构state以便在组件中使用
  const {
    datasets,
    tables,
    selectedDataset,
    selectedTable,
    activeDataset,
    query,
    queryResult,
    columns,
    exportFormat,
    loading,
    executing,
    error,
  } = state;

  /**
   * 更新状态的工具函数 - 部分更新state
   */
  const updateState = (newState: Partial<AppState>) => {
    setState(prevState => ({ ...prevState, ...newState }));
  };

  /**
   * 初始化加载数据
   */
  useEffect(() => {
    loadData();
  }, []);

  /**
   * 加载数据集和表信息
   */
  const loadData = async (): Promise<void> => {
    try {
      updateState({ loading: true });

      // 加载所有数据集
      const allDatasets = await duckDBService.getAllDatasets();

      // 加载每个数据集的表
      const tablesByDataset: { [datasetId: string]: Table[] } = {};
      for (const dataset of allDatasets) {
        const datasetTables = await duckDBService.getTablesInDataset(dataset.id);
        tablesByDataset[dataset.id] = datasetTables;
      }

      updateState({
        datasets: allDatasets,
        tables: tablesByDataset,
        loading: false,
      });
    } catch (error) {
      message.error(<FormattedMessage id="Failed to load datasets" />);
      updateState({ loading: false });
    }
  };

  /**
   * 选择数据集
   */
  const handleDatasetSelect = (datasetId: string): void => {
    updateState({
      selectedDataset: datasetId,
      selectedTable: null,
    });

    const dataset = datasets.find(d => d.id === datasetId);
    if (dataset) {
      // 加载数据集中的所有表
      handleLoadDataset(datasetId);
    }
  };

  /**
   * 选择表
   */
  const handleTableSelect = (tableName: string): void => {
    updateState({ selectedTable: tableName });

    if (activeDataset) {
      const fullTableName = `${activeDataset.name}_${tableName}`;
      updateState({ query: `SELECT * FROM "${fullTableName}" LIMIT 100` });
    }
  };

  /**
   * 显示表命令
   */
  const handleShowTables = (): void => {
    if (selectedDataset) {
      updateState({ query: 'SHOW TABLES' });
      executeQuery();
    }
  };

  /**
   * 加载数据集
   */
  const handleLoadDataset = async (datasetId: string): Promise<void> => {
    try {
      updateState({ loading: true });

      // 加载数据集到DuckDB
      await duckDBService.loadDataset(datasetId);

      const dataset = datasets.find(d => d.id === datasetId);
      if (!dataset) {
        updateState({ loading: false });
        return;
      }

      // 设置当前活动数据集并准备执行SHOW TABLES查询
      updateState({
        activeDataset: dataset,
        query: 'SHOW TABLES',
        loading: false,
      });

      // 自动执行SHOW TABLES查询
      executeQuery();

      message.success(<FormattedMessage id="Dataset '{name}' loaded" values={{ name: dataset.name }} />);
    } catch (error) {
      message.error(<FormattedMessage id="Failed to load dataset" />);
      updateState({ loading: false });
    }
  };

  /**
   * 执行SQL查询
   */
  const executeQuery = async (): Promise<void> => {
    if (!query.trim()) {
      message.warning(<FormattedMessage id="Please enter a query" />);
      return;
    }

    try {
      updateState({
        executing: true,
        error: null,
      });

      // 确保选中的数据集已加载
      if (selectedDataset) {
        await duckDBService.loadDataset(selectedDataset);
      }

      // 对于'SHOW TABLES'查询，传递当前数据集ID以限制只显示该数据集的表
      const isShowTablesQuery = query.trim().toLowerCase() === 'show tables';
      const result = await duckDBService.executeQuery(
        query,
        isShowTablesQuery && selectedDataset ? selectedDataset : undefined,
      );

      // 处理结果数据
      const data = result.toArray();

      // 创建列定义
      const columnsData = result.schema.fields.map((field: Field) => ({
        title: field.name,
        dataIndex: field.name,
        key: field.name,
        ellipsis: true,
        render: (text: any) => {
          if (text === null) return <span style={{ color: '#999' }}>NULL</span>;
          return String(text);
        },
      }));

      // 更新查询结果和列
      updateState({
        queryResult: data,
        columns: columnsData,
        executing: false,
      });

      // 如果是SHOW TABLES查询，尝试设置表
      if (isShowTablesQuery && data.length > 0 && data[0].table_name) {
        // 表名可能会有前缀，例如"datasetname_tablename"
        const tableNames = data.map((row: QueryResult) => row.table_name);
        if (activeDataset) {
          const prefix = `${activeDataset.name}_`;
          const availableTables = tableNames.map((name: string) =>
            name.startsWith(prefix) ? name.substring(prefix.length) : name,
          );
          if (availableTables.length > 0) {
            updateState({ selectedTable: availableTables[0] });
          }
        }
      }

      message.success(
        <FormattedMessage id="Query successful, {count} records returned" values={{ count: data.length }} />,
      );
    } catch (error) {
      updateState({
        error: (error as Error).message,
        executing: false,
      });

      message.error(
        <FormattedMessage id="Query execution failed: {message}" values={{ message: (error as Error).message }} />,
      );
    }
  };

  /**
   * 清空查询语句
   */
  const clearQuery = (): void => {
    updateState({ query: '' });
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  };

  /**
   * 复制文本到剪贴板
   */
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

  /**
   * 导出数据
   */
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

  /**
   * 处理表格行点击事件
   */
  const handleSelectTableRow = (record: QueryResult): void => {
    if (activeDataset && record.table_name) {
      let tableName = record.table_name;
      // 如果表名有前缀，移除前缀
      if (tableName.startsWith(`${activeDataset.name}_`)) {
        tableName = tableName.substring(activeDataset.name.length + 1);
      }
      // 设置选中的表
      handleTableSelect(tableName);
      // 显示表内容
      updateState({ query: `SELECT * FROM "${record.table_name}" LIMIT 100` });
      executeQuery();
    }
  };

  /**
   * 修改查询文本
   */
  const handleQueryChange = (newQuery: string): void => {
    updateState({ query: newQuery });
  };

  /**
   * 修改导出格式
   */
  const handleExportFormatChange = (format: ExportFormat): void => {
    updateState({ exportFormat: format });
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={12}>
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        <Typography.Title level={2} style={{ fontSize: '24px', marginBottom: '4px' }}>
          <FormattedMessage id="SQL Query" />
        </Typography.Title>
        <Typography.Paragraph style={{ marginBottom: '8px' }}>
          <FormattedMessage id="Execute SQL queries on your datasets" />
        </Typography.Paragraph>
      </Space>

      {/* 数据集选择组件 */}
      <DatasetSelector
        datasets={datasets}
        selectedDataset={selectedDataset}
        loading={loading}
        onSelect={handleDatasetSelect}
        onShowTables={handleShowTables}
        onRefresh={loadData}
        activeDataset={activeDataset}
      />

      <Card size="small">
        <Space direction="vertical" style={{ width: '100%', height: '68vh' }} size={10}>
          {/* 提示信息 */}
          {!selectedDataset && (
            <Alert
              type="info"
              message={<FormattedMessage id="Please select a dataset" />}
              description={<FormattedMessage id="Select a dataset to start querying" />}
              showIcon
            />
          )}

          {/* 查询编辑器组件 */}
          <QueryEditor
            query={query}
            selectedDataset={selectedDataset}
            selectedTable={selectedTable}
            activeDataset={activeDataset}
            executing={executing}
            onChangeQuery={handleQueryChange}
            onExecute={executeQuery}
            onClear={clearQuery}
            textAreaRef={textAreaRef}
          />

          {/* 分隔线 */}
          <Divider style={{ margin: 0 }} />

          {/* 查询结果组件 */}
          <QueryResults
            error={error}
            queryResult={queryResult}
            columns={columns}
            query={query}
            activeDataset={activeDataset}
            exportFormat={exportFormat}
            onExportFormatChange={handleExportFormatChange}
            onExport={exportData}
            onCopyToClipboard={copyToClipboard}
            onSelectTableRow={handleSelectTableRow}
          />
        </Space>
      </Card>
    </Space>
  );
};

export default QueryPage;
