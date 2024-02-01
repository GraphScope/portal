import { CypherSchemaData } from '../cypher-editor';
export interface IEditorProps {
  id: string;
  script?: string;
  schemaData?: CypherSchemaData;
  functions?: any;
  onClose?: (id: string) => void;
  onQuery: (value: { id: string; script: string }) => void;
  onSave?: (value: { id: string; script: string }) => void;
}
