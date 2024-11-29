export interface NodeData {
  children: NodeData[];
  name: string;
}
export interface ICombo {
  id: string;
  cluster: string;
  x: number;
  y: number;
  r: number;
  color: string;
  children: string[];
}
