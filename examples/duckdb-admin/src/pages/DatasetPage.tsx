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
} from 'antd';
import { UploadOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import duckDBService from '../services/duckdbService';
import { FormattedMessage, useIntl } from 'react-intl';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

interface Dataset {
  name: string;
  description: string;
  fileName: string;
  rowCount: number;
  size: number;
  dateAdded: string;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [uploadModalVisible, setUploadModalVisible] = useState<boolean>(false);
  const [previewModalVisible, setPreviewModalVisible] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<PreviewData[] | null>(null);
  const [previewColumns, setPreviewColumns] = useState<any[]>([]);
  const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);
  const [form] = Form.useForm();
  const [uploadFile, setUploadFile] = useState<File | null>(null);

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

  const handleUpload = async (values: { name: string; description: string }): Promise<void> => {
    if (!uploadFile) {
      message.error(<FormattedMessage id="Please select a CSV file to upload" />);
      return;
    }

    try {
      setLoading(true);

      await duckDBService.registerDataset(values.name, uploadFile, values.description);
      message.success(<FormattedMessage id="Dataset uploaded successfully" />);
      setUploadModalVisible(false);
      form.resetFields();
      setUploadFile(null);
      await loadDatasets();
    } catch (error) {
      message.error(<FormattedMessage id="Upload failed" />);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (name: string): Promise<void> => {
    try {
      setLoading(true);
      await duckDBService.deleteDataset(name);
      message.success(<FormattedMessage id="Dataset deleted successfully" />);
      await loadDatasets();
    } catch (error) {
      message.error(<FormattedMessage id="Delete failed" />);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (dataset: Dataset): Promise<void> => {
    try {
      setLoading(true);
      setCurrentDataset(dataset);
      const result = await duckDBService.getPreviewData(dataset.name);

      // 处理预览数据
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

      setPreviewColumns(columns);
      setPreviewData(data);
      setPreviewModalVisible(true);
    } catch (error) {
      message.error(<FormattedMessage id="Failed to preview data" />);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: <FormattedMessage id="Dataset Name" />,
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
      render: (_: any, record: Dataset) => (
        <Space size="small">
          <Tooltip title={<FormattedMessage id="Preview Data" />}>
            <Button icon={<EyeOutlined />} onClick={() => handlePreview(record)} size="small" type="text" />
          </Tooltip>
          <Tooltip title={<FormattedMessage id="Delete Dataset" />}>
            <Popconfirm
              title={<FormattedMessage id="Are you sure you want to delete this dataset?" />}
              onConfirm={() => handleDelete(record.name)}
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
        <FormattedMessage id="Manage your CSV datasets here" />
      </Paragraph>

      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<UploadOutlined />} onClick={() => setUploadModalVisible(true)}>
          <FormattedMessage id="Upload New Dataset" />
        </Button>
      </div>

      <Card>
        <Spin spinning={loading}>
          {datasets.length > 0 ? (
            <Table
              dataSource={datasets}
              columns={columns}
              rowKey="name"
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                hideOnSinglePage: true,
                position: ['bottomCenter'],
              }}
              scroll={{ x: 'max-content' }}
              size="middle"
              bordered={false}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Paragraph>
                <FormattedMessage id="No datasets found" />
              </Paragraph>
              <Paragraph>
                <FormattedMessage id="Please upload a dataset to get started" />
              </Paragraph>
            </div>
          )}
        </Spin>
      </Card>

      {/* Upload Dataset Dialog */}
      <Modal
        title={<FormattedMessage id="Upload New Dataset" />}
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpload}>
          <Form.Item
            name="name"
            label={<FormattedMessage id="Dataset Name" />}
            rules={[
              {
                required: true,
                message: <FormattedMessage id="Please enter a dataset name" />,
              },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: <FormattedMessage id="Only letters, numbers and underscores are allowed" />,
              },
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: 'Enter a unique name for your dataset' })} />
          </Form.Item>

          <Form.Item name="description" label={<FormattedMessage id="Description" />}>
            <Input.TextArea placeholder={intl.formatMessage({ id: 'Enter dataset description (optional)' })} />
          </Form.Item>

          <Form.Item
            name="file"
            label={<FormattedMessage id="Select CSV file" />}
            rules={[
              {
                required: true,
                message: <FormattedMessage id="Please select a CSV file" />,
              },
            ]}
          >
            <Upload
              accept=".csv"
              beforeUpload={file => {
                setUploadFile(file);
                return false;
              }}
              fileList={
                uploadFile ? [{ uid: '1', name: uploadFile.name, size: uploadFile.size, type: uploadFile.type }] : []
              }
              onRemove={() => setUploadFile(null)}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>
                <FormattedMessage id="Select File" />
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space>
              <Button type="primary" htmlType="submit" disabled={!uploadFile}>
                <FormattedMessage id="Upload" />
              </Button>
              <Button onClick={() => setUploadModalVisible(false)}>
                <FormattedMessage id="Cancel" />
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Preview Data Dialog */}
      <Modal
        title={
          currentDataset
            ? intl.formatMessage({ id: 'Preview of' }) + `: ${currentDataset.name}`
            : intl.formatMessage({ id: 'Preview' })
        }
        open={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        width="90%"
        footer={[
          <Button key="close" onClick={() => setPreviewModalVisible(false)}>
            <FormattedMessage id="Close" />
          </Button>,
        ]}
      >
        <Spin spinning={loading}>
          {previewData && previewData.length > 0 ? (
            <Table
              dataSource={previewData}
              columns={previewColumns}
              rowKey={(_, index) => `row-${index}`}
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                hideOnSinglePage: true,
                position: ['bottomCenter'],
              }}
              scroll={{ x: 'max-content' }}
              size="small"
              bordered={false}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Paragraph>
                <FormattedMessage id="No preview data available" />
              </Paragraph>
            </div>
          )}
        </Spin>
      </Modal>
    </div>
  );
};

export default DatasetPage;
