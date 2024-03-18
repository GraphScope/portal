import { CypherSchemaData } from '../cypher-editor';
import type { IStatement } from '../app/context';
export interface IEditorProps {
  id: string;
  script?: string;
  language?: 'cypher' | 'gremlin';
  schemaData?: CypherSchemaData;
  functions?: any;
  onClose?: (id: string) => void;
  onQuery: (value: IStatement) => void;
  onSave?: (value: IStatement) => void;
}
