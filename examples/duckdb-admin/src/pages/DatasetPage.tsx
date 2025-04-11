import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Table,
  Upload,
  Form,
  Input,
  Modal,
  message,
  Card,
  Spin,
  Tooltip,
  Popconfirm,
  Space,
  Tabs,
  Collapse,
  Empty,
} from 'antd';
import {
  UploadOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  TableOutlined,
  FolderOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import duckDBService from '../services/duckdbService';
import { FormattedMessage, useIntl } from 'react-intl';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;

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

interface PreviewData {
  [key: string]: any;
}

interface Field {
  name: string;
  type: string;
}

const DatasetPage: React.FC = () => {
  const intl = useIntl();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [tables, setTables] = useState<{ [datasetId: string]: Table[] }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [datasetModalVisible, setDatasetModalVisible] = useState<boolean>(false);
  const [tableModalVisible, setTableModalVisible] = useState<boolean>(false);
  const [previewModalVisible, setPreviewModalVisible] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<PreviewData[] | null>(null);
  const [previewColumns, setPreviewColumns] = useState<any[]>([]);
  const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);
  const [currentTable, setCurrentTable] = useState<Table | null>(null);
  const [datasetForm] = Form.useForm();
  const [tableForm] = Form.useForm();
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (): Promise<void> => {
    try {
      setLoading(true);
      const allDatasets = await duckDBService.getAllDatasets();
      setDatasets(allDatasets);

      const tablesByDataset: { [datasetId: string]: Table[] } = {};
      for (const dataset of allDatasets) {
        const datasetTables = await duckDBService.getTablesInDataset(dataset.id);
        tablesByDataset[dataset.id] = datasetTables;
      }
      setTables(tablesByDataset);
    } catch (error) {
      message.error(<FormattedMessage id="Failed to load datasets" />);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDataset = async (values: { name: string; description: string }): Promise<void> => {
    try {
      setLoading(true);

      await duckDBService.createDataset(values.name, values.description);
      message.success(<FormattedMessage id="Dataset created successfully" />);
      setDatasetModalVisible(false);
      datasetForm.resetFields();
      await loadData();
    } catch (error) {
      message.error(<FormattedMessage id="Dataset creation failed" />);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadTable = async (values: { name: string; description: string }): Promise<void> => {
    if (!uploadFile || !currentDataset) {
      message.error(<FormattedMessage id="Please select a CSV file to upload" />);
      return;
    }

    try {
      setLoading(true);

      await duckDBService.registerTable(currentDataset.id, values.name, uploadFile, values.description);
      message.success(<FormattedMessage id="Table uploaded successfully" />);
      setTableModalVisible(false);
      tableForm.resetFields();
      setUploadFile(null);
      await loadData();
    } catch (error) {
      message.error(<FormattedMessage id="Upload failed" />);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (datasetId: string, tableName: string): Promise<void> => {
    try {
      setLoading(true);

      const dataset = datasets.find(d => d.id === datasetId);
      if (!dataset) {
        throw new Error(`Dataset not found: ${datasetId}`);
      }

      const table = tables[datasetId]?.find(t => t.name === tableName);
      if (!table) {
        throw new Error(`Table not found: ${tableName}`);
      }

      setCurrentTable(table);

      const result = await duckDBService.getTablePreview(datasetId, tableName, 10);
      const data = result.toArray();

      const columns = result.schema.fields.map((field: any) => ({
        title: field.name,
        dataIndex: field.name,
        key: field.name,
        render: (text: any) => (text === null ? 'NULL' : String(text)),
      }));

      setPreviewData(data);
      setPreviewColumns(columns);
      setPreviewModalVisible(true);
    } catch (error) {
      message.error(<FormattedMessage id="Failed to load preview" />);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDataset = async (datasetId: string): Promise<void> => {
    try {
      setLoading(true);
      await duckDBService.deleteDataset(datasetId);
      message.success(<FormattedMessage id="Dataset deleted successfully" />);
      await loadData();
    } catch (error) {
      message.error(<FormattedMessage id="Failed to delete dataset" />);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTable = async (datasetId: string, tableName: string): Promise<void> => {
    try {
      setLoading(true);
      await duckDBService.deleteTable(datasetId, tableName);
      message.success(<FormattedMessage id="Table deleted successfully" />);
      await loadData();
    } catch (error) {
      message.error(<FormattedMessage id="Failed to delete table" />);
    } finally {
      setLoading(false);
    }
  };

  const tableColumns = [
    {
      title: <FormattedMessage id="Table Name" />,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: <FormattedMessage id="Description" />,
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: <FormattedMessage id="File Name" />,
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: <FormattedMessage id="Records" />,
      dataIndex: 'rowCount',
      key: 'rowCount',
      render: (text: number) => text.toLocaleString(),
    },
    {
      title: <FormattedMessage id="Size" />,
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => {
        const kb = size / 1024;
        if (kb < 1024) {
          return `${kb.toFixed(2)} KB`;
        } else {
          const mb = kb / 1024;
          return `${mb.toFixed(2)} MB`;
        }
      },
    },
    {
      title: <FormattedMessage id="Last Modified" />,
      dataIndex: 'dateAdded',
      key: 'dateAdded',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: <FormattedMessage id="Actions" />,
      key: 'action',
      render: (_: any, record: Table) => (
        <Space size="small">
          <Tooltip title={<FormattedMessage id="Preview Data" />}>
            <Button
              icon={<EyeOutlined />}
              onClick={() => handlePreview(record.datasetId, record.name)}
              size="small"
              type="text"
            />
          </Tooltip>
          <Tooltip title={<FormattedMessage id="Delete Table" />}>
            <Popconfirm
              title={<FormattedMessage id="Are you sure you want to delete this table?" />}
              onConfirm={() => handleDeleteTable(record.datasetId, record.name)}
              okText={<FormattedMessage id="Yes" />}
              cancelText={<FormattedMessage id="No" />}
            >
              <Button icon={<DeleteOutlined />} danger size="small" type="text" />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>
        <FormattedMessage id="Your Datasets" />
      </Title>
      <Paragraph>
        <FormattedMessage id="Manage your datasets and tables here" />
      </Paragraph>

      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setDatasetModalVisible(true)}>
          <FormattedMessage id="Create New Dataset" />
        </Button>
      </div>

      <Card>
        <Spin spinning={loading}>
          {datasets.length > 0 ? (
            <Collapse defaultActiveKey={datasets.length > 0 ? [datasets[0].id] : []}>
              {datasets.map(dataset => (
                <Panel
                  header={
                    <Space>
                      <FolderOutlined />
                      <span style={{ fontWeight: 'bold' }}>{dataset.name}</span>
                      <span>({dataset.tables.length} tables)</span>
                      {dataset.description && <span style={{ color: '#888' }}>- {dataset.description}</span>}
                    </Space>
                  }
                  key={dataset.id}
                  extra={
                    <Space onClick={e => e.stopPropagation()}>
                      <Button
                        type="primary"
                        size="small"
                        icon={<TableOutlined />}
                        onClick={e => {
                          e.stopPropagation();
                          setCurrentDataset(dataset);
                          setTableModalVisible(true);
                        }}
                      >
                        <FormattedMessage id="Add Table" />
                      </Button>
                      <Popconfirm
                        title={
                          <FormattedMessage id="Are you sure you want to delete this dataset and all its tables?" />
                        }
                        onConfirm={e => {
                          e?.stopPropagation();
                          handleDeleteDataset(dataset.id);
                        }}
                        okText={<FormattedMessage id="Yes" />}
                        cancelText={<FormattedMessage id="No" />}
                      >
                        <Button danger size="small" icon={<DeleteOutlined />} onClick={e => e.stopPropagation()}>
                          <FormattedMessage id="Delete Dataset" />
                        </Button>
                      </Popconfirm>
                    </Space>
                  }
                >
                  {tables[dataset.id] && tables[dataset.id].length > 0 ? (
                    <Table
                      dataSource={tables[dataset.id]}
                      columns={tableColumns}
                      rowKey="name"
                      pagination={{
                        pageSize: 5,
                        showSizeChanger: false,
                        hideOnSinglePage: true,
                        position: ['bottomCenter'],
                      }}
                      scroll={{ x: 'max-content' }}
                      size="middle"
                      bordered={false}
                    />
                  ) : (
                    <Empty description={<FormattedMessage id="No tables in this dataset" />}>
                      <Button
                        type="primary"
                        onClick={() => {
                          setCurrentDataset(dataset);
                          setTableModalVisible(true);
                        }}
                      >
                        <FormattedMessage id="Add Table" />
                      </Button>
                    </Empty>
                  )}
                </Panel>
              ))}
            </Collapse>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Paragraph>
                <FormattedMessage id="No datasets found" />
              </Paragraph>
              <Paragraph>
                <FormattedMessage id="Please create a dataset to get started" />
              </Paragraph>
            </div>
          )}
        </Spin>
      </Card>

      {/* Create Dataset Dialog */}
      <Modal
        title={<FormattedMessage id="Create New Dataset" />}
        open={datasetModalVisible}
        onCancel={() => setDatasetModalVisible(false)}
        footer={null}
      >
        <Form form={datasetForm} layout="vertical" onFinish={handleCreateDataset}>
          <Form.Item
            name="name"
            label={<FormattedMessage id="Dataset Name" />}
            rules={[
              { required: true, message: intl.formatMessage({ id: 'Please enter a dataset name' }) },
              { max: 50, message: intl.formatMessage({ id: 'Name cannot exceed 50 characters' }) },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: intl.formatMessage({ id: 'Name can only contain letters, numbers, and underscores' }),
              },
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: 'Enter dataset name' })} />
          </Form.Item>

          <Form.Item name="description" label={<FormattedMessage id="Description (Optional)" />}>
            <Input.TextArea
              placeholder={intl.formatMessage({ id: 'Enter optional description' })}
              rows={3}
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              <FormattedMessage id="Create Dataset" />
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Upload Table Dialog */}
      <Modal
        title={
          <FormattedMessage id="Upload Table to {datasetName}" values={{ datasetName: currentDataset?.name || '' }} />
        }
        open={tableModalVisible}
        onCancel={() => {
          setTableModalVisible(false);
          setUploadFile(null);
        }}
        footer={null}
      >
        <Form form={tableForm} layout="vertical" onFinish={handleUploadTable}>
          <Form.Item
            name="name"
            label={<FormattedMessage id="Table Name" />}
            rules={[
              { required: true, message: intl.formatMessage({ id: 'Please enter a table name' }) },
              { max: 50, message: intl.formatMessage({ id: 'Name cannot exceed 50 characters' }) },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: intl.formatMessage({ id: 'Name can only contain letters, numbers, and underscores' }),
              },
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: 'Enter table name' })} />
          </Form.Item>

          <Form.Item name="description" label={<FormattedMessage id="Description (Optional)" />}>
            <Input.TextArea
              placeholder={intl.formatMessage({ id: 'Enter optional description' })}
              rows={3}
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Form.Item
            label={<FormattedMessage id="CSV File" />}
            required
            tooltip={<FormattedMessage id="Upload a CSV file to create a table" />}
          >
            <Upload
              beforeUpload={file => {
                const isCsv = file.name.endsWith('.csv');
                if (!isCsv) {
                  message.error(<FormattedMessage id="Only CSV files are allowed" />);
                  return Upload.LIST_IGNORE;
                }
                setUploadFile(file);
                return false;
              }}
              onRemove={() => {
                setUploadFile(null);
                return true;
              }}
              fileList={uploadFile ? [{ uid: '1', name: uploadFile.name, size: uploadFile.size } as any] : []}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>
                <FormattedMessage id="Select File" />
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} disabled={!uploadFile}>
              <FormattedMessage id="Upload Table" />
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        title={<FormattedMessage id="Preview of {tableName}" values={{ tableName: currentTable?.name || '' }} />}
        open={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        footer={null}
        width={800}
      >
        {previewData && previewData.length > 0 ? (
          <Table
            dataSource={previewData}
            columns={previewColumns}
            rowKey={(_, index) => `${index}`}
            pagination={false}
            scroll={{ x: 'max-content' }}
            size="small"
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Paragraph>
              <FormattedMessage id="No data available for preview" />
            </Paragraph>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DatasetPage;
