export interface ISchema {
  nodes: {
    label: string;
    properties: Record<string, any>;
  }[];
  edges: {
    label: string;
    properties: Record<string, any>;
  }[];
}

export interface ConfigItem {
  /** 类型 */
  label: string;
  /** 数量统计 */
  count?: number;
  /** 颜色 */
  color: string;
  /** 大小 */
  size: number;
  /** 文本映射字段 */
  caption: string;
}
