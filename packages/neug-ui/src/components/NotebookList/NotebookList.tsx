import React from 'react';
import { Plus, MoreVertical, Trash2, BookOpen } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface Notebook {
  id: string;
  title: string;
  isActive?: boolean;
}

export interface NotebookListProps {
  notebooks?: Notebook[];
  onAddNotebook?: () => void;
  onDeleteNotebook?: (id: string) => void;
  onSelectNotebook?: (id: string) => void;
  className?: string;
}

export const NotebookList: React.FC<NotebookListProps> = ({
  notebooks = [],
  onAddNotebook,
  onDeleteNotebook,
  onSelectNotebook,
  className,
}) => {
  const handleAddNotebook = () => {
    if (onAddNotebook) {
      onAddNotebook();
    }
  };

  const handleDeleteNotebook = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteNotebook) {
      onDeleteNotebook(id);
    }
  };

  const handleSelectNotebook = (id: string) => {
    if (onSelectNotebook) {
      onSelectNotebook(id);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">Notebooks</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleAddNotebook}
          className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Notebook List */}
      <div className="space-y-1">
        {notebooks.map(notebook => (
          <div
            key={notebook.id}
            className={cn(
              'group relative flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-all duration-200',
              'hover:bg-accent/50 hover:shadow-sm',
              notebook.isActive && 'bg-accent text-accent-foreground',
              !notebook.isActive && 'text-muted-foreground hover:text-foreground',
            )}
            onClick={() => handleSelectNotebook(notebook.id)}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm truncate">{notebook.title}</span>
            </div>

            {/* More Options Icon - Always present, visible on hover */}
            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    onClick={e => e.stopPropagation()}
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={e => {
                      e.stopPropagation();
                      handleDeleteNotebook(notebook.id, e);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete notebook
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}

        {notebooks.length === 0 && <div className="px-3 py-2 text-sm text-muted-foreground">暂无笔记本</div>}
      </div>
    </div>
  );
};
