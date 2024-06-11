import type { Property } from '@graphscope/studio-components';

export interface ISchemaNode {
  id: string;
  data: {
    label: string;
    properties?: Property[];
    [key: string]: any;
  };
  position: {
    x: number;
    y: number;
  };
  type: string;
  [key: string]: any;
}

export interface ISchemaEdge {
  source: string;
  target: string;
  id: string;
  data: {
    label: string;
    properties?: Property[];
    [key: string]: any;
  };
  type: string;
  [key: string]: any;
}

export interface ISchemaOptions {
  nodes: ISchemaNode[];
  edges: ISchemaEdge[];
}
