import React, { useState } from 'react';
import { NotebookList, type Notebook } from './NotebookList';

export const NotebookListDemo: React.FC = () => {
  const [notebooks, setNotebooks] = useState<Notebook[]>([
    { id: '1', title: 'Untitled Notebook', isActive: true },
    { id: '2', title: 'Project Notes', isActive: false },
    { id: '3', title: 'Meeting Minutes', isActive: false },
  ]);
  const [nextId, setNextId] = useState(4);

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
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">NotebookList 演示</h2>
      <div className="border rounded-lg p-4 bg-background">
        <NotebookList
          notebooks={notebooks}
          onAddNotebook={handleAddNotebook}
          onDeleteNotebook={handleDeleteNotebook}
          onSelectNotebook={handleSelectNotebook}
        />
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        <p>当前笔记本数量: {notebooks.length}</p>
        <p>激活的笔记本: {notebooks.find(n => n.isActive)?.title || '无'}</p>
      </div>
    </div>
  );
};
