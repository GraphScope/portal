# NotebookList 组件

一个功能完整的笔记本列表组件，支持添加、删除和选择笔记本。

## 功能特性

- ✅ 显示笔记本列表
- ✅ 每个笔记本项带有图标
- ✅ 通过右上角 + 号添加新笔记本
- ✅ 悬停时显示更多操作图标（三个点）
- ✅ 下拉菜单删除功能
- ✅ 支持选择激活状态
- ✅ 响应式设计
- ✅ 支持深色主题
- ✅ 完全可定制的样式

## 使用方法

```tsx
import { NotebookList, type Notebook } from '@/components/NotebookList';

const notebooks: Notebook[] = [
  { id: '1', title: 'Untitled Notebook', isActive: true },
  { id: '2', title: 'Project Notes', isActive: false },
];

function App() {
  const handleAddNotebook = () => {
    // 添加新笔记本的逻辑
  };

  const handleDeleteNotebook = (id: string) => {
    // 删除笔记本的逻辑
  };

  const handleSelectNotebook = (id: string) => {
    // 选择笔记本的逻辑
  };

  return (
    <NotebookList
      notebooks={notebooks}
      onAddNotebook={handleAddNotebook}
      onDeleteNotebook={handleDeleteNotebook}
      onSelectNotebook={handleSelectNotebook}
    />
  );
}
```

## Props

| 属性               | 类型                   | 默认值 | 描述                 |
| ------------------ | ---------------------- | ------ | -------------------- |
| `notebooks`        | `Notebook[]`           | `[]`   | 笔记本列表数据       |
| `onAddNotebook`    | `() => void`           | -      | 添加笔记本的回调函数 |
| `onDeleteNotebook` | `(id: string) => void` | -      | 删除笔记本的回调函数 |
| `onSelectNotebook` | `(id: string) => void` | -      | 选择笔记本的回调函数 |
| `className`        | `string`               | -      | 自定义CSS类名        |

## Notebook 类型

```tsx
interface Notebook {
  id: string; // 唯一标识符
  title: string; // 笔记本标题
  isActive?: boolean; // 是否为激活状态
}
```

## 样式定制

组件使用 Tailwind CSS 4 和 shadcn/ui 组件库，支持以下主题变量：

- `--background`: 背景色
- `--foreground`: 前景色
- `--accent`: 强调色
- `--accent-foreground`: 强调色前景
- `--muted`: 静音色
- `--muted-foreground`: 静音色前景
- `--destructive`: 危险色

## 交互说明

1. **添加笔记本**: 点击右上角的 + 号按钮
2. **选择笔记本**: 点击任意笔记本项
3. **更多操作**: 悬停时显示更多操作图标（三个点）
4. **删除笔记本**: 点击更多操作图标，选择 "Delete notebook" 选项
5. **悬停效果**: 鼠标悬停时显示浅灰色阴影和操作按钮

## 示例

查看 `NotebookList.stories.tsx` 文件获取更多使用示例和演示。
