import { create } from 'zustand';

export interface Notebook {
  id: string;
  name: string;
  cells: QueryCell[];
  createdAt: Date;
  updatedAt: Date;
}

export interface QueryCell {
  id: string;
  sql: string;
  result?: QueryResult;
  status: 'idle' | 'running' | 'success' | 'error';
  error?: string;
}

export interface QueryResult {
  columns: string[];
  rows: any[][];
  rowCount: number;
  executionTime: number;
}

export interface Database {
  id: string;
  name: string;
  tables: Table[];
}

export interface Table {
  name: string;
  columns: Column[];
  rowCount: number;
}

export interface Column {
  name: string;
  type: string;
  nullable: boolean;
}

interface NeugStore {
  // Notebooks
  notebooks: Notebook[];
  activeNotebookId: string | null;

  // Databases
  databases: Database[];

  // Active cell
  activeCellId: string | null;

  // UI state
  leftPanelWidth: number;
  rightPanelWidth: number;

  // Actions
  createNotebook: (name: string) => void;
  deleteNotebook: (id: string) => void;
  renameNotebook: (id: string, name: string) => void;
  setActiveNotebook: (id: string) => void;

  addCell: (notebookId: string) => void;
  deleteCell: (notebookId: string, cellId: string) => void;
  updateCellSql: (notebookId: string, cellId: string, sql: string) => void;
  setActiveCell: (cellId: string) => void;

  addDatabase: (database: Database) => void;
  removeDatabase: (id: string) => void;

  setLeftPanelWidth: (width: number) => void;
  setRightPanelWidth: (width: number) => void;

  // Computed
  activeNotebook: Notebook | null;
  activeCell: QueryCell | null;
}

// 示例数据
const sampleDatabase: Database = {
  id: 'sample-db',
  name: '示例数据库',
  tables: [
    {
      name: 'users',
      rowCount: 1000,
      columns: [
        { name: 'id', type: 'INTEGER', nullable: false },
        { name: 'name', type: 'VARCHAR', nullable: false },
        { name: 'email', type: 'VARCHAR', nullable: true },
        { name: 'age', type: 'INTEGER', nullable: true },
        { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      ],
    },
    {
      name: 'orders',
      rowCount: 5000,
      columns: [
        { name: 'id', type: 'INTEGER', nullable: false },
        { name: 'user_id', type: 'INTEGER', nullable: false },
        { name: 'amount', type: 'DECIMAL', nullable: false },
        { name: 'status', type: 'VARCHAR', nullable: false },
        { name: 'order_date', type: 'TIMESTAMP', nullable: false },
      ],
    },
  ],
};

const sampleNotebook: Notebook = {
  id: 'sample-notebook',
  name: '示例 Notebook',
  cells: [
    {
      id: 'sample-cell-1',
      sql: 'SELECT * FROM users LIMIT 10',
      status: 'success',
      result: {
        columns: ['id', 'name', 'email', 'age', 'created_at'],
        rows: [
          [1, '张三', 'zhangsan@example.com', 25, '2024-01-01 10:00:00'],
          [2, '李四', 'lisi@example.com', 30, '2024-01-02 11:00:00'],
          [3, '王五', 'wangwu@example.com', 28, '2024-01-03 12:00:00'],
          [4, '赵六', 'zhaoliu@example.com', 35, '2024-01-04 13:00:00'],
          [5, '钱七', 'qianqi@example.com', 27, '2024-01-05 14:00:00'],
          [6, '孙八', 'sunba@example.com', 32, '2024-01-06 15:00:00'],
          [7, '周九', 'zhoujiu@example.com', 29, '2024-01-07 16:00:00'],
          [8, '吴十', 'wushi@example.com', 31, '2024-01-08 17:00:00'],
          [9, '郑十一', 'zhengshiyi@example.com', 26, '2024-01-09 18:00:00'],
          [10, '王十二', 'wangshier@example.com', 33, '2024-01-10 19:00:00'],
        ],
        rowCount: 10,
        executionTime: 45,
      },
    },
    {
      id: 'sample-cell-2',
      sql: 'SELECT status, COUNT(*) as count FROM orders GROUP BY status',
      status: 'success',
      result: {
        columns: ['status', 'count'],
        rows: [
          ['pending', 1500],
          ['processing', 2000],
          ['completed', 1200],
          ['cancelled', 300],
        ],
        rowCount: 4,
        executionTime: 23,
      },
    },
  ],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-15'),
};

export const useStore = create<NeugStore>((set, get) => ({
  // Initial state
  notebooks: [sampleNotebook],
  activeNotebookId: 'sample-notebook',
  databases: [sampleDatabase],
  activeCellId: 'sample-cell-1',
  leftPanelWidth: 280,
  rightPanelWidth: 320,

  // Computed
  get activeNotebook() {
    const { notebooks, activeNotebookId } = get();
    return notebooks.find(n => n.id === activeNotebookId) || null;
  },

  get activeCell() {
    const { activeNotebook, activeCellId } = get();
    if (!activeNotebook || !activeCellId) return null;
    return activeNotebook.cells.find(c => c.id === activeCellId) || null;
  },

  // Actions
  createNotebook: (name: string) => {
    const newNotebook: Notebook = {
      id: crypto.randomUUID(),
      name,
      cells: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set(state => ({
      notebooks: [...state.notebooks, newNotebook],
      activeNotebookId: newNotebook.id,
    }));
  },

  deleteNotebook: (id: string) => {
    set(state => ({
      notebooks: state.notebooks.filter(n => n.id !== id),
      activeNotebookId: state.activeNotebookId === id ? null : state.activeNotebookId,
    }));
  },

  renameNotebook: (id: string, name: string) => {
    set(state => ({
      notebooks: state.notebooks.map(n => (n.id === id ? { ...n, name, updatedAt: new Date() } : n)),
    }));
  },

  setActiveNotebook: (id: string) => {
    set({ activeNotebookId: id, activeCellId: null });
  },

  addCell: (notebookId: string) => {
    const newCell: QueryCell = {
      id: crypto.randomUUID(),
      sql: '',
      status: 'idle',
    };

    set(state => ({
      notebooks: state.notebooks.map(n =>
        n.id === notebookId ? { ...n, cells: [...n.cells, newCell], updatedAt: new Date() } : n,
      ),
      activeCellId: newCell.id,
    }));
  },

  deleteCell: (notebookId: string, cellId: string) => {
    set(state => ({
      notebooks: state.notebooks.map(n =>
        n.id === notebookId ? { ...n, cells: n.cells.filter(c => c.id !== cellId), updatedAt: new Date() } : n,
      ),
      activeCellId: state.activeCellId === cellId ? null : state.activeCellId,
    }));
  },

  updateCellSql: (notebookId: string, cellId: string, sql: string) => {
    set(state => ({
      notebooks: state.notebooks.map(n =>
        n.id === notebookId
          ? {
              ...n,
              cells: n.cells.map(c => (c.id === cellId ? { ...c, sql } : c)),
              updatedAt: new Date(),
            }
          : n,
      ),
    }));
  },

  setActiveCell: (cellId: string) => {
    set({ activeCellId: cellId });
  },

  addDatabase: (database: Database) => {
    set(state => ({
      databases: [...state.databases, database],
    }));
  },

  removeDatabase: (id: string) => {
    set(state => ({
      databases: state.databases.filter(d => d.id !== id),
    }));
  },

  setLeftPanelWidth: (width: number) => {
    set({ leftPanelWidth: width });
  },

  setRightPanelWidth: (width: number) => {
    set({ rightPanelWidth: width });
  },
}));
