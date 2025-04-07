import React, { useState, useEffect } from "react";
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
} from "antd";
import { UploadOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import duckDBService from "../services/duckdbService";

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
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploadModalVisible, setUploadModalVisible] = useState<boolean>(false);
  const [previewModalVisible, setPreviewModalVisible] =
    useState<boolean>(false);
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
      message.error("加载数据集失败: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (values: {
    name: string;
    description: string;
  }): Promise<void> => {
    if (!uploadFile) {
      message.error("请选择要上传的 CSV 文件");
      return;
    }

    try {
      setLoading(true);

      await duckDBService.registerDataset(
        values.name,
        uploadFile,
        values.description
      );
      message.success("数据集上传成功");
      setUploadModalVisible(false);
      form.resetFields();
      setUploadFile(null);
      await loadDatasets();
    } catch (error) {
      message.error("上传失败: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (name: string): Promise<void> => {
    try {
      setLoading(true);
      await duckDBService.deleteDataset(name);
      message.success("数据集删除成功");
      await loadDatasets();
    } catch (error) {
      message.error("删除失败: " + (error as Error).message);
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
          if (text === null) return <span style={{ color: "#999" }}>NULL</span>;
          return String(text);
        },
      }));

      setPreviewColumns(columns);
      setPreviewData(data);
      setPreviewModalVisible(true);
    } catch (error) {
      message.error("预览数据失败: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "数据集名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "文件名",
      dataIndex: "fileName",
      key: "fileName",
    },
    {
      title: "记录数",
      dataIndex: "rowCount",
      key: "rowCount",
      render: (text: number) => text.toLocaleString(),
    },
    {
      title: "大小",
      dataIndex: "size",
      key: "size",
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
      title: "添加日期",
      dataIndex: "dateAdded",
      key: "dateAdded",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: Dataset) => (
        <Space size='small'>
          <Tooltip title='预览数据'>
            <Button
              icon={<EyeOutlined />}
              onClick={() => handlePreview(record)}
              size='small'
            />
          </Tooltip>
          <Tooltip title='删除数据集'>
            <Popconfirm
              title='确定要删除此数据集吗？'
              onConfirm={() => handleDelete(record.name)}
              okText='是'
              cancelText='否'
            >
              <Button icon={<DeleteOutlined />} danger size='small' />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>数据集管理</Title>
      <Paragraph>
        在这里您可以上传、管理和删除您的 CSV
        数据集。所有数据都存储在您的浏览器中。
      </Paragraph>

      <div style={{ marginBottom: 16 }}>
        <Button
          type='primary'
          icon={<UploadOutlined />}
          onClick={() => setUploadModalVisible(true)}
        >
          上传新数据集
        </Button>
      </div>

      <Card>
        <Spin spinning={loading}>
          <Table
            dataSource={datasets}
            columns={columns}
            rowKey='name'
            pagination={{ pageSize: 10 }}
            scroll={{ x: "max-content" }}
          />
        </Spin>
      </Card>

      {/* 上传数据集对话框 */}
      <Modal
        title='上传新数据集'
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout='vertical' onFinish={handleUpload}>
          <Form.Item
            name='name'
            label='数据集名称'
            rules={[
              { required: true, message: "请输入数据集名称" },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: "只允许字母、数字和下划线",
              },
            ]}
          >
            <Input placeholder='输入唯一的数据集名称' />
          </Form.Item>

          <Form.Item name='description' label='描述'>
            <Input.TextArea placeholder='输入数据集描述（可选）' />
          </Form.Item>

          <Form.Item label='CSV 文件' required>
            <Upload
              beforeUpload={(file) => {
                setUploadFile(file);
                return false;
              }}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' loading={loading}>
              上传
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 预览数据对话框 */}
      <Modal
        title={`预览数据: ${currentDataset?.name}`}
        open={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        width={800}
        footer={null}
      >
        <Table
          dataSource={previewData || []}
          columns={previewColumns}
          scroll={{ x: "max-content" }}
          pagination={{ pageSize: 10 }}
        />
      </Modal>
    </div>
  );
};

export default DatasetPage;
