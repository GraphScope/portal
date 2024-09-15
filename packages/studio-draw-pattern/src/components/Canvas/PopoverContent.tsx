import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, Table, Select } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Property } from '../../types/property';
import { useNodeStore } from '../../stores/useNodeStore';
import { usePropertiesStore } from '../../stores/usePropertiesStore';

interface PopoverContentProps {
  currentId?: string;
  onChange?: (value: { currentId: string; properties: Property[] }) => void;
}

const PopoverContent: React.FC<PopoverContentProps> = ({ currentId, onChange }) => {
  const properties = usePropertiesStore(state => state.properties);
  const [items, setItems] = useState<Property[]>(properties.find(item => item.belongId === currentId)?.data ?? []);

  useEffect(() => {
    console.log('id change', currentId);
  }, [currentId]);

  useEffect(() => {
    onChange && onChange({ currentId: currentId ?? '', properties: items });
  }, [items, currentId]);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), name: '', compare: '', value: '' }]);
  };

  const removeItem = (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
  };

  const handleChange = (id: string, key: keyof Property, value: string) => {
    const newItems = items.map(item => (item.id === id ? { ...item, [key]: value } : item));
    setItems(newItems);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (_: any, record: Property) => (
        <Input
          placeholder="Name"
          value={record.name}
          onChange={e => handleChange(record.id, 'name', e.target.value)}
          style={{ width: '100%' }}
        />
      ),
      width: '35%',
    },
    {
      title: 'Compare',
      dataIndex: 'compare',
      render: (_: any, record: Property) => (
        <Select
          defaultValue={record.compare}
          onChange={value => handleChange(record.id, 'compare', value)}
          style={{ width: '100%' }}
          options={[
            { value: '>', label: '>' },
            { value: '=', label: '=' },
            { value: '<', label: '<' },
          ]}
          className="nospan nodrag"
        />
      ),
      width: '20%',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      render: (_: any, record: Property) => (
        <Input
          placeholder="Value"
          value={record.value}
          onChange={e => handleChange(record.id, 'value', e.target.value)}
          style={{ width: '100%' }}
        />
      ),
      width: '35%',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_: any, record: Property) => (
        <Button type="text" icon={<DeleteOutlined />} onClick={() => removeItem(record.id)} />
      ),
      width: '10%',
    },
  ];

  return (
    <Form layout="vertical">
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <h3>Properties</h3>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={addItem}>
            Add
          </Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={items}
        pagination={false}
        rowKey="id" // 使用唯一的 id 作为 rowKey
        bordered
      />
    </Form>
  );
};

export default PopoverContent;
