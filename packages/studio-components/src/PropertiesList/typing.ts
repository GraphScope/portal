export interface Property {
  /** 数据字段 */
  token: any;
  /** name 是否可以修改 */
  disable?: boolean;
  /** 唯一标识 */
  id: string;
  /** 唯一标识 */
  key: string;
  /** 属性名 */
  name: string;
  /** 属性类型 */
  type: string;
  /** 索引 */
  index: number;
  /** 是否是主键 */
  primaryKey: boolean;
}
export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}
