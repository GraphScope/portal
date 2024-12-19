export interface Property {
  /** 属性名 */
  name: string;
  /** 唯一标识 */
  key?: string;
  /** 数据字段 */
  token?: any;
  /** 索引 */
  index?: number;
  /** name 是否可以修改 */
  disable?: boolean;
  /** 属性类型 */
  type?: string;
  /** 是否是主键 */
  primaryKey?: boolean;
}
export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}
