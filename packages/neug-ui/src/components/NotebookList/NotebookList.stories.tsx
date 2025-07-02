import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { NotebookList, type Notebook } from './NotebookList';

const meta: Meta<typeof NotebookList> = {
  title: 'Components/NotebookList',
  component: NotebookList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '一个笔记本列表组件，支持添加、删除和选择笔记本。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onAddNotebook: { action: 'add notebook' },
    onDeleteNotebook: { action: 'delete notebook' },
    onSelectNotebook: { action: 'select notebook' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 示例数据
const sampleNotebooks: Notebook[] = [
  { id: '1', title: 'Untitled Notebook', isActive: true },
  { id: '2', title: 'Project Notes', isActive: false },
  { id: '3', title: 'Meeting Minutes', isActive: false },
  { id: '4', title: 'Ideas & Concepts', isActive: false },
];

// 基础用法
export const Default: Story = {
  args: {
    notebooks: sampleNotebooks,
  },
};

// 空状态
export const Empty: Story = {
  args: {
    notebooks: [],
  },
};

// 单个笔记本
export const SingleNotebook: Story = {
  args: {
    notebooks: [{ id: '1', title: 'My Notebook', isActive: true }],
  },
};

// 交互式示例
export const Interactive: Story = {
  render: () => {
    const InteractiveComponent = () => {
      const [notebooks, setNotebooks] = useState<Notebook[]>(sampleNotebooks);
      const [nextId, setNextId] = useState(5);

      const handleAddNotebook = () => {
        const newNotebook: Notebook = {
          id: nextId.toString(),
          title: 'Untitled Notebook',
          isActive: false,
        };
        setNotebooks(prev => [...prev.map(n => ({ ...n, isActive: false })), newNotebook]);
        setNextId(prev => prev + 1);
      };

      const handleDeleteNotebook = (id: string) => {
        setNotebooks(prev => prev.filter(n => n.id !== id));
      };

      const handleSelectNotebook = (id: string) => {
        setNotebooks(prev => prev.map(n => ({ ...n, isActive: n.id === id })));
      };

      return (
        <div className="w-64 p-4 border rounded-lg bg-background">
          <NotebookList
            notebooks={notebooks}
            onAddNotebook={handleAddNotebook}
            onDeleteNotebook={handleDeleteNotebook}
            onSelectNotebook={handleSelectNotebook}
          />
        </div>
      );
    };

    return <InteractiveComponent />;
  },
};

// 长标题测试
export const LongTitles: Story = {
  args: {
    notebooks: [
      { id: '1', title: 'This is a very long notebook title that should be truncated', isActive: true },
      { id: '2', title: 'Another long title for testing truncation behavior', isActive: false },
      { id: '3', title: 'Short', isActive: false },
    ],
  },
};

// 深色主题适配
export const DarkTheme: Story = {
  args: {
    notebooks: sampleNotebooks,
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className="w-64 p-4 border rounded-lg bg-background dark">
        <Story />
      </div>
    ),
  ],
};

// 自定义样式
export const CustomStyling: Story = {
  args: {
    notebooks: sampleNotebooks,
    className: 'max-w-xs',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className="w-80 p-6 border-2 border-dashed border-muted-foreground/20 rounded-xl bg-gradient-to-br from-background to-muted/20">
        <Story />
      </div>
    ),
  ],
};
