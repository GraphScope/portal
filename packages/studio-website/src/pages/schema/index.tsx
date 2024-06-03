import * as React from 'react';
import ImportApp from '@graphscope/studio-importor';
import Section from '@/components/section';
import { SegmentedSection } from '@graphscope/studio-components';
import { createGraph, getPrimitiveTypes, uploadFile, createDataloadingJob } from './services';
interface ISchemaPageProps {}
const { GS_ENGINE_TYPE } = window;
const SchemaPage: React.FunctionComponent<ISchemaPageProps> = props => {
  return (
    <SegmentedSection style={{ padding: '12px', height: '100%', boxSizing: 'border-box' }}>
      <ImportApp
        /** 创建图模型 */
        //@ts-ignore
        createGraph={createGraph}
        /** 属性下拉选项值 */
        getPrimitiveTypes={getPrimitiveTypes}
        /** 绑定数据中上传文件 */
        uploadFile={uploadFile}
        /** 数据绑定 */
        createDataloadingJob={createDataloadingJob}
        GS_ENGINE_TYPE={GS_ENGINE_TYPE}
        appMode="DATA_MODELING"
      />
    </SegmentedSection>
  );
};

export default SchemaPage;
