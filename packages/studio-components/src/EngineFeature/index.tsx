import * as React from 'react';
interface IGrootCaseProps {
  children: React.ReactNode;
  match: SupportFeature;
}

export type SupportFeature =
  /** 是否支持多图 */
  | 'MULTIPLE_GRAPHS'
  /** 是否支持批量创建图模型 */
  | 'BATCH_CREATE_SCHEMA'
  /** schema是否支持更新修改 */
  | 'SCHEMA_UPDATE'
  /** 是否支持CSV导图 */
  | 'LOAD_CSV_DATA'
  /** 是否支持查询多版本 */
  | 'QUERY_MULTIPLE_VERSIONS'
  /** 是否支持下载数据导入的任务配置*/
  | 'DOWNLOAD_DATA_TASK_CONFIG'
  /** 是否支持批量导入数据 */
  | 'BATCH_LOAD_DATA';

type Features = {
  [K in SupportFeature]: boolean;
};

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
  //interactive
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

const EngineFeature: React.FunctionComponent<IGrootCaseProps> = props => {
  const { children, match } = props;
  const feature = getSupportFeature();
  const support = feature[match];
  return (
    <div
      style={{
        display: support ? 'display' : 'none',
      }}
    >
      {children}
    </div>
  );
};

export default EngineFeature;
