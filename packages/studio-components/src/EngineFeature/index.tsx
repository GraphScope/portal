import * as React from 'react';

/**
 * @interface IGrootCaseProps - 引擎特性组件属性接口
 * @property {React.ReactNode} children - 子节点
 * @property {SupportFeature} match - 匹配的特性
 */
interface IGrootCaseProps {
  children: React.ReactNode;
  match: SupportFeature;
}

/**
 * @enum SupportFeature - 支持的特性枚举
 * @value MULTIPLE_GRAPHS - 是否支持多图
 * @value BATCH_CREATE_SCHEMA - 是否支持批量创建图模型
 * @value SCHEMA_UPDATE - schema是否支持更新修改
 * @value LOAD_CSV_DATA - 是否支持CSV导图
 * @value QUERY_MULTIPLE_VERSIONS - 是否支持查询多版本
 * @value DOWNLOAD_DATA_TASK_CONFIG - 是否支持下载数据导入的任务配置
 * @value BATCH_LOAD_DATA - 是否支持批量导入数据
 */
export type SupportFeature =
  | 'MULTIPLE_GRAPHS'
  | 'BATCH_CREATE_SCHEMA'
  | 'SCHEMA_UPDATE'
  | 'LOAD_CSV_DATA'
  | 'QUERY_MULTIPLE_VERSIONS'
  | 'DOWNLOAD_DATA_TASK_CONFIG'
  | 'BATCH_LOAD_DATA';

/**
 * @type Features - 特性类型
 */
type Features = {
  [K in SupportFeature]: boolean;
};

/**
 * @function getSupportFeature - 获取支持的特性
 * @returns {Features} - 支持的特性对象
 */
export const getSupportFeature = (): Features => {
  if (window.GS_ENGINE_TYPE === 'groot') {
    return {
      BATCH_CREATE_SCHEMA: false,
      LOAD_CSV_DATA: false,
      MULTIPLE_GRAPHS: false,
      QUERY_MULTIPLE_VERSIONS: false,
      SCHEMA_UPDATE: true,
      DOWNLOAD_DATA_TASK_CONFIG: true,
      BATCH_LOAD_DATA: false,
    };
  }
  if (window.GS_ENGINE_TYPE === 'gart') {
    return {
      BATCH_CREATE_SCHEMA: true,
      LOAD_CSV_DATA: false,
      MULTIPLE_GRAPHS: false,
      QUERY_MULTIPLE_VERSIONS: true,
      SCHEMA_UPDATE: false,
      DOWNLOAD_DATA_TASK_CONFIG: false,
      BATCH_LOAD_DATA: true,
    };
  }
  // interactive
  return {
    BATCH_CREATE_SCHEMA: true,
    LOAD_CSV_DATA: true,
    MULTIPLE_GRAPHS: true,
    QUERY_MULTIPLE_VERSIONS: false,
    SCHEMA_UPDATE: false,
    DOWNLOAD_DATA_TASK_CONFIG: false,
    BATCH_LOAD_DATA: true,
  };
};

/**
 * @function EngineFeature - 引擎特性组件
 * @param {IGrootCaseProps} props - 组件属性
 * @returns {JSX.Element} - 渲染的 JSX 元素
 */
const EngineFeature: React.FunctionComponent<IGrootCaseProps> = props => {
  const { children, match } = props;
  const feature = getSupportFeature();
  const support = feature[match];
  return (
    <div
      style={{
        display: support ? 'block' : 'none',
      }}
    >
      {children}
    </div>
  );
};

export default EngineFeature;
