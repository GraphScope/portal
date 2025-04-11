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
    <Card style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        {/* 数据集选择器 */}
        <div style={{ minWidth: '250px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
            <FormattedMessage id="Dataset" />:
          </label>
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
                <span>
                  <DatabaseOutlined /> {dataset.name}
                  {dataset.tables.length > 0 && (
                    <Badge count={dataset.tables.length} size="small" style={{ marginLeft: '8px' }} />
                  )}
                </span>
              </Select.Option>
            ))}
          </Select>
        </div>

        <div>
          <Button type="primary" onClick={onShowTables} icon={<SearchOutlined />} disabled={!selectedDataset}>
            <FormattedMessage id="Show Tables" />
          </Button>
        </div>

        <div>
          <Button onClick={onRefresh} icon={<ReloadOutlined />} disabled={loading}>
            <FormattedMessage id="Refresh" />
          </Button>
        </div>

        {activeDataset && (
          <Tag color="blue">
            <FormattedMessage id="Active Dataset" />: {activeDataset.name}
          </Tag>
        )}
      </div>
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
    <div style={{ padding: '10px 0', display: 'flex', flexDirection: 'column' }}>
      <Title level={5}>
        <FormattedMessage id="Query" />
      </Title>
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 16 }}>
        {selectedDataset && (
          <div style={{ marginBottom: 8 }}>
            <Space wrap>
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
          </div>
        )}

        <TextArea
          value={query}
          onChange={e => onChangeQuery(e.target.value)}
          placeholder={intl.formatMessage({ id: 'Enter your SQL query here' })}
          style={{ height: '120px', fontFamily: 'monospace', resize: 'none' }}
          ref={textAreaRef}
        />

        <div style={{ marginTop: 10 }}>
          <Space>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={onExecute}
              loading={executing}
              disabled={!selectedDataset}
            >
              <FormattedMessage id="Execute Query" />
            </Button>
            <Button icon={<ClearOutlined />} onClick={onClear} disabled={!query}>
              <FormattedMessage id="Clear" />
            </Button>
          </Space>
        </div>
      </div>
    </div>
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
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <Title level={5}>
        <FormattedMessage id="Results" />
      </Title>

      {error ? (
        <div className="error-message">
          <Title level={4} style={{ color: 'red' }}>
            <FormattedMessage id="Error executing query" />:
          </Title>
          <pre>{error}</pre>
        </div>
      ) : queryResult && queryResult.length > 0 ? (
        <div style={{ overflow: 'auto' }}>
          {isShowTablesQuery && activeDataset && (
            <Alert
              type="info"
              message={
                <FormattedMessage id="Showing tables in dataset '{name}'" values={{ name: activeDataset.name }} />
              }
              style={{ marginBottom: 16 }}
              showIcon
            />
          )}

          <div style={{ marginBottom: 16 }}>
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
    </div>
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
    <div>
      <Title level={2}>
        <FormattedMessage id="SQL Query" />
      </Title>
      <Paragraph>
        <FormattedMessage id="Execute SQL queries on your datasets" />
      </Paragraph>

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

      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', height: '70vh' }}>
          {/* 提示信息 */}
          {!selectedDataset && (
            <Alert
              type="info"
              message={<FormattedMessage id="Please select a dataset" />}
              description={<FormattedMessage id="Select a dataset to start querying" />}
              showIcon
              style={{ marginBottom: 16 }}
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
          <Divider style={{ margin: '0 0 16px 0' }} />

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
        </div>
      </Card>
    </div>
  );
};

export default QueryPage;
