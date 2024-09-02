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
  status: 'WAITING_EMBEDDING' | 'WAITING_EXTRACT' | 'WAITING_CLUSTER';
}

export interface IEntity {
  id: string;
  name: string;
  value: number;
  cost: number;
  summarized: boolean;
  count?: number;
}
