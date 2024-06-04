import * as React from 'react';
import ImportApp from '@graphscope/studio-importor';
import { SegmentedSection } from '@graphscope/studio-components';
import { createGraph, getPrimitiveTypes, uploadFile, createDataloadingJob } from './services';
import { TOOLS_MENU } from '../../layouts/const';
import { useContext } from '../../layouts/useContext';
import { history } from 'umi';
interface ISchemaPageProps {}
const { GS_ENGINE_TYPE } = window;
const SchemaPage: React.FunctionComponent<ISchemaPageProps> = props => {
  const { store } = useContext();
  const onChange = (value: any) => {
    history.push(value);
  };
  return (
    <SegmentedSection withNav={store.navStyle === 'inline'} options={TOOLS_MENU} value="/importing" onChange={onChange}>
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
        appMode="DATA_IMPORTING"
      />
    </SegmentedSection>
  );
};

export default SchemaPage;
