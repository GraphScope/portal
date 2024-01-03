export interface IStatement {
  /** 语句ID */
  id: string;
  /** 语句名称 */
  name: string;
  /** 语句脚本 */
  script: string;
}

export type IStore<T> = T & {
  graphName: string;
  // nav
  nav: 'save' | 'info' | 'gpt' | 'store_procedure';
  /** 单击选中的语句,如果是 fLow 模式，则滚动定位到这条语句 ，如果是 Tabs 模式，则直接展示*/
  activeId: string;
  /** 查询的语句 */
  statements: IStatement[];
  /** 展示的模式 */
  mode: 'flow' | 'tabs';
};
