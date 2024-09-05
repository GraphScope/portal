import React, { useState } from 'react';
import { ConfigProvider, Table } from 'antd';
import type { TableColumnsType } from 'antd';

interface DataType {
  key: React.Key;
  title: string;
  authors: string;
  year: string;
  citations: string;
  references: string;
  similarity_to_origin: string;
}
interface IListViewProps {
  onRowChange: (val: DataType) => void;
}
const data = [
  {
    key: '1',
    title:
      'Demonstrating Rigor Using Thematic Analysis: A Hybrid Approach of Inductive and Deductive Coding and Theme Development',
    authors: 'J. Fereday, E. Muir‐Cochrane',
    year: '2006',
    citations: '8500',
    references: '27',
    similarity_to_origin: '100',
  },
  {
    key: '2',
    title: 'Transforming Qualitative Information: Thematic Analysis and Code Development',
    authors: 'R. Boyatzis',
    year: '1998',
    citations: '13064',
    references: '0',
    similarity_to_origin: '13.6',
  },
  {
    key: '3',
    title: 'Research and scholarly methods: Thematic analysis',
    authors: 'O. Colins, E. Broekaert, S. Vandevelde, G. van Hove',
    year: '2000',
    citations: '800',
    references: '22',
    similarity_to_origin: '10',
  },
];
function ellipsisText(text: string, maxLength = 100) {
  if (text.length > maxLength) {
    return `${text.substring(0, maxLength)}...`;
  }
  return text;
}

const ListView: React.FC<IListViewProps> = props => {
  const { onRowChange } = props;
  const [state, updateState] = useState({
    currentIndex: '0',
  });
  const { currentIndex } = state;
  const columns: TableColumnsType<DataType> = [
    {
      title: 'Title',
      sorter: (a, b) => a.title.length - b.title.length,
      render: (all: DataType) => {
        const { key, title } = all;
        return <span style={{ color: currentIndex === key ? '#035282' : '#020202' }}>{ellipsisText(title)}</span>;
      },
      width: '40%',
    },
    {
      title: 'Authors',
      dataIndex: 'authors',
      sorter: (a, b) => a.authors.length - b.authors.length,
      width: '25%',
    },
    {
      title: 'Year',
      dataIndex: 'year',
      sorter: (a, b) => Number(a.year) - Number(b.year),
      width: '5%',
    },
    {
      title: 'Citations',
      dataIndex: 'citations',
      sorter: (a, b) => Number(a.citations) - Number(b.citations),
      width: '8%',
    },
    {
      title: 'References',
      dataIndex: 'references',
      sorter: (a, b) => Number(a.references) - Number(b.references),
      width: '10%',
    },
    {
      title: 'Similarity to origin',
      dataIndex: 'similarity_to_origin',
      sorter: (a, b) => Number(a.similarity_to_origin) - Number(b.similarity_to_origin),
      width: '8%',
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: '#fff',
            headerFilterHoverBg: '#fff',
            headerColor: '#035282',
            headerSplitColor: 'none',
            colorText: '#727272',
          },
        },
      }}
    >
      <Table
        style={{ padding: '24px' }}
        sticky
        columns={columns}
        dataSource={data}
        pagination={false}
        onRow={record => {
          return {
            onClick: event => {
              console.log('onRow', record);
              onRowChange && onRowChange(record);
            },
            onDoubleClick: event => {},
            onContextMenu: event => {},
            onMouseEnter: event => {
              onRowChange && onRowChange(record);
              updateState(preset => {
                return { ...preset, currentIndex: record.key as string };
              });
            }, // 鼠标移入行
            onMouseLeave: event => {
              updateState(preset => {
                return { ...preset, currentIndex: '' };
              });
            },
          };
        }}
      />
    </ConfigProvider>
  );
};

export default ListView;
