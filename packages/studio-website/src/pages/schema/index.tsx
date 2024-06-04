import * as React from 'react';
import ImportApp from '@graphscope/studio-importor';
import Section from '@/components/section';
import { SegmentedSection } from '@graphscope/studio-components';
import { TOOLS_MENU } from '../../layouts/const';
import { useContext } from '../../layouts/useContext';
import { history } from 'umi';
import { createGraph, getPrimitiveTypes, uploadFile, createDataloadingJob } from './services';
interface ISchemaPageProps {}
const { GS_ENGINE_TYPE } = window;
const SchemaPage: React.FunctionComponent<ISchemaPageProps> = props => {
  const { store } = useContext();
  const onChange = (value: any) => {
    history.push(value);
  };
  return (
    <SegmentedSection withNav={store.navStyle === 'inline'} options={TOOLS_MENU} value="/modeling" onChange={onChange}>
      <ImportApp
        /** 创建图模型 */
        //@ts-ignore
        createGraph={createGraph}
        /** 属性下拉选项值 */
        getPrimitiveTypes={() => {
          return ['DT_DOUBLE', 'DT_STRING', 'DT_SIGNED_INT32', 'DT_SIGNED_INT64'].map(item => {
            return { label: item, value: item };
          });
        }}
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
