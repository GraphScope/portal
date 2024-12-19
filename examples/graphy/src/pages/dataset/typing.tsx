export interface IDataset {
  id: string;
  entity: IEntity[];
  extract: {};
  schema: {
    nodes: {
      id: string;
      label: string;
      prompt: string;
    }[];
    edges: {
      id: string;
      label: string;
      source: string;
      target: string;
      prompt?: string;
    }[];
  };
  status: 'initialized' | 'waiting_workflow_config' | 'waiting_extract' | 'extracting';
  refreshList?: () => any;
}

export interface IEntity {
  id: string;
  name: string;
  value: number;
  cost: number;
  summarized: boolean;
  count?: number;
}
