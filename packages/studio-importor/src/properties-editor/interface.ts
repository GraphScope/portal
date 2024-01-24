import { DefaultOptionType } from "antd/es/cascader";

// 定义EditColumnsType和IndexData类型
export type EditColumnsType<T> = {
    inputType?: string;
    prop: {
      options: Array<{ label: string; value: string }>;
      mode: 'multiple' | 'tags';
    };
  };
  export interface IndexData {
    id: string | number;
    index: string;
    name?: boolean;
    type?: string;
    column?: string;
    disable?: boolean;
  }
  export interface PropertyList {
    id: string | number;
    name?: string;
    type?: string;
    token?: string;
    primaryKey?: boolean;
    disable?: boolean;
  }
  export interface ConfigColumns {
    title: string;
    width?: string;
    dataIndex?: string;
    key?: string;
    editable?: boolean;
    editorConfig?: any;
    render?: any;
  }
  export interface IMapColumns {
    title?: string;
    width?: number;
    dataIndex: string;
    key: string;
    ellipsis?:boolean;
    render?: (name:string)=>any;
  }

  export interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: string;
    record: any;
    inputType: string;
    prop: { options: Array<any> };
    editorConfig: (record: any) => {inputType:string;prop:{
      options: DefaultOptionType[] | undefined;name:string;
}};
  }
  export interface EditableRowProps {
    index: number;
  }

export type MapConfigParamsType = {
  mapConfigParams: {
    selectedMapRowKeys:string[];
    handleSelectAll:(e)=>void;
    showHeader:boolean;
    columns:any;
    dataSource:any;
    mapFromFileConfirm:()=>void;
    handleSelectRow?:(selectedRowKeys:any)=>void;
  };
};
export type PropertyConfigParamsType = {
  propertyConfigParams: {
    selectedRows:string[];
    isMapFromFile?:boolean;
    addNodeConfig:()=>void;
    delEditTable:()=>void;
    columns:any;
    dataSource:PropertyList[];
    setConfigList:any;
    inputDoubleClick:(val:{id:string;})=>void;
    inputBlur:(val:{disable:boolean;})=>void;
    rowSelection:any;
    bordered?:boolean;
  };
};