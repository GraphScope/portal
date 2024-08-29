import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Table } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface Item {
  name: string;
  compare: string;
  value: string;
}

const PopoverContent: React.FC = () => {
  const [items, setItems] = useState<Item[]>([{ name: 'property_0', compare: '', value: '' }]);

  const addItem = () => {
    setItems([...items, { name: '', compare: '', value: '' }]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleChange = (index: number, key: keyof Item, value: string) => {
    const newItems = [...items];
    newItems[index][key] = value;
    setItems(newItems);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (_: any, record: Item, index: number) => (
        <Input
          placeholder="Name"
          value={record.name}
          onChange={e => handleChange(index, 'name', e.target.value)}
          style={{ width: '100%' }}
        />
      ),
      width: '35%',
    },
    {
      title: 'Compare',
      dataIndex: 'compare',
      render: (_: any, record: Item, index: number) => (
        <Input
          placeholder="Compare"
          value={record.compare}
          onChange={e => handleChange(index, 'compare', e.target.value)}
          style={{ width: '100%' }}
        />
      ),
      width: '20%',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      render: (_: any, record: Item, index: number) => (
        <Input
          placeholder="Value"
          value={record.value}
          onChange={e => handleChange(index, 'value', e.target.value)}
          style={{ width: '100%' }}
        />
      ),
      width: '35%',
    },
    {
      dataIndex: 'actions',
      render: (_: any, record: Item, index: number) => (
        <Button type="text" icon={<DeleteOutlined />} onClick={() => removeItem(index)}></Button>
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
        rowKey={(record, index) => index.toString()}
        bordered
      />
    </Form>
  );
};

export default PopoverContent;
