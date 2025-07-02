import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

// 简单的测试组件
const TestComponent = ({ message }: { message: string }) => (
  <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
    <h2>Storybook 测试组件</h2>
    <p>{message}</p>
  </div>
);

const meta = {
  title: 'Test/SimpleComponent',
  component: TestComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '这是一个简单的测试组件，用于验证 Storybook 配置是否正确。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: '要显示的消息',
    },
  },
} satisfies Meta<typeof TestComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: '🎉 Storybook 配置成功！',
  },
  parameters: {
    docs: {
      description: {
        story: '默认的测试组件展示。',
      },
    },
  },
};

export const Success: Story = {
  args: {
    message: '✅ 所有配置都正常工作！',
  },
  parameters: {
    docs: {
      description: {
        story: '成功状态的测试组件。',
      },
    },
  },
};

export const Welcome: Story = {
  args: {
    message: '欢迎使用 AI-Spider 项目的 Storybook！',
  },
  parameters: {
    docs: {
      description: {
        story: '欢迎页面的测试组件。',
      },
    },
  },
};
