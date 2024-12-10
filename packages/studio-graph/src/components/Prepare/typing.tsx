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

export interface StyleConfig {
  /** 类型 */
  label: string;
  /** 数量统计 */
  count?: number;
  /** 颜色 */
  color: string;
  /** 大小 */
  size: number;
  /** 文本映射字段 */
  caption: string[];
  /** 是否显示文字 */
  icon: string;
}
export interface StatusConfig {
  /** 是否选中 */
  selected?: boolean;
  /** 是否悬停 */
  hovering?: boolean;
}
