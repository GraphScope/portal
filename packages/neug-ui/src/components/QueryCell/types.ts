export interface QueryCellProps {
  /** 数据库列表 */
  databaseList: string[];
  /** 当前选中的数据库 */
  currentDatabase: string;
  /** 编辑器内容 */
  value: string;
  /** 编辑器内容变更回调 */
  onChange: (val: string) => void;
  /** 运行按钮回调 */
  onRun?: () => void;
  /** 删除 notebook 回调 */
  onDelete?: () => void;
  /** 其他透传属性 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
