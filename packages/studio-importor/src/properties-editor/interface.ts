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
    render?: () => void;
  }

  export interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof any;
    record: any;
    inputType: string;
    prop: { options: Array<any> };
    editorConfig: (record: any) => void;
  }
  export interface EditableRowProps {
    index: number;
    onChange?: (newData: Array<any>) => void;
  }

export interface ImmerType {
    selectedRows: never[];
    selectedMapRowKeys: string[];
    configList: PropertyList[];
    mapfromfileList: PropertyList[];
    proSelectKey: never[];
    propertyOption:{label:string;value:string;}[];
    columnOption:{label:string;value:string;}[];
}