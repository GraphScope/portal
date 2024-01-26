import React from 'react';
import { Segmented } from 'antd';
import Stage from './stage';
type StagesImportPackagesProps = {
    onChange(val:boolean): void;
};
const StagesImportPackages: React.FunctionComponent<StagesImportPackagesProps> = props => {
    const {onChange}=props
    return (
    <>
        <Segmented options={[{label:'Dataworks 上构建数据导入流程',value:'dataworks'},{label:'周期性导入 ODPS 表',value:'stage'}]} />
        <Stage onChange={ onChange }/>
    </>
  );
};
export default StagesImportPackages;