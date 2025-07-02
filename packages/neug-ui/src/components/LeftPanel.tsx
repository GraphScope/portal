import React from 'react';
import { useStore } from '../store/useStore';
import { Button } from './ui/button';
import { BookOpen, Database, Plus, ChevronRight, ChevronDown, Trash2 } from 'lucide-react';

export const LeftPanel: React.FC = () => {
  const { notebooks, activeNotebookId, databases, createNotebook, setActiveNotebook, deleteNotebook } = useStore();

  const [expandedDatabases, setExpandedDatabases] = React.useState<Set<string>>(new Set());

  const toggleDatabase = (dbId: string) => {
    const newExpanded = new Set(expandedDatabases);
    if (newExpanded.has(dbId)) {
      newExpanded.delete(dbId);
    } else {
      newExpanded.add(dbId);
    }
    setExpandedDatabases(newExpanded);
  };

  return (
    <div className="h-full flex flex-col bg-background border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold">neug WebUI</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Notebooks Section */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-muted-foreground">Notebooks</h3>
            <Button variant="ghost" size="sm" onClick={() => createNotebook(`Notebook ${notebooks.length + 1}`)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1">
            {notebooks.map(notebook => (
              <div
                key={notebook.id}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent ${
                  activeNotebookId === notebook.id ? 'bg-accent' : ''
                }`}
                onClick={() => setActiveNotebook(notebook.id)}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm truncate">{notebook.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={e => {
                    e.stopPropagation();
                    deleteNotebook(notebook.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Databases Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-muted-foreground">Databases</h3>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1">
            {databases.map(database => (
              <div key={database.id}>
                <div
                  className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent"
                  onClick={() => toggleDatabase(database.id)}
                >
                  <div className="flex items-center gap-2">
                    {expandedDatabases.has(database.id) ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{database.name}</span>
                  </div>
                </div>

                {expandedDatabases.has(database.id) && (
                  <div className="ml-6 space-y-1">
                    {database.tables.map(table => (
                      <div
                        key={table.name}
                        className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent/50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">📊</span>
                          <span className="text-xs">{table.name}</span>
                          <span className="text-xs text-muted-foreground">({table.rowCount})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
