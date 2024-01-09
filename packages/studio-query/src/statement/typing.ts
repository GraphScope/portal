export interface IEditorProps {
  id: string;
  script?: string;
  onClose?: (id: string) => void;
  onQuery: (value: { id: string; script: string }) => void;
  onSave?: (value: { id: string; script: string }) => void;
}
