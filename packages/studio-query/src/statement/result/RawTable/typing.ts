// 通用属性类型
type PropertiesType = { [key: string]: string | number | number[] | string[] };

// 定义顶点或边的类型
interface VertexOrEdge {
  id?: string | number;
  label?: string;
  properties?: PropertiesType;
}

// Groot 数据类型
export interface GrootDataType {
  id: string;
  label: string;
  inV?: VertexOrEdge;
  outV?: VertexOrEdge;
  properties: PropertiesType;
}

// Interanctive 数据类型
export interface InteranctiveDataType {
  elementId: string;
  startNodeElementId?: string;
  endNodeElementId?: string;
  key?: string;
  labels?: string[];
  type?: string;
  data?: { [key: string]: string | string[] | { [key: string]: string } };
}
