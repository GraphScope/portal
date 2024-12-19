export interface Property {
  name: string;
  value: string | number;
  type?: string;
  compare: string;
  id: string;
  statement?: string;
}

export interface PropertySet {
  belongId: string;
  belongType: 'node' | 'edge';
  data: Property[];
}
