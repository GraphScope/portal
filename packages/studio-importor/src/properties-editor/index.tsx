import React, { useState, type FC } from 'react';
import {  Checkbox } from 'antd'
import { createFromIconfontCN } from '@ant-design/icons';
import { uniqueId } from 'lodash';
import { EditType } from './components/edit-table'
import Editor from './components/editor'

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
    disabled?: boolean;
}
const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/a/font_4377140_eryoeoa0lk5.js',
});
const styles = {
    "properties-head": {
        display: 'flex',
        justifyContent: 'space-between',
        margin: '0'
    },
    "sel-num": {
        paddingRight: '12px',
        borderRight: '1px solid #e5e6e8'
    }
}
const PropertiesEditor: FC<{ title: string }> = props => {
    const [configList, setConfigList] = useState([])
    const [selectedRows, setSelectedRows] = useState([])
    const nodeConfigColumns: EditColumnsType<IndexData> = [
        {
            title: 'Name',
            width: '15%',
            dataIndex: 'name',
            key: 'name',
            editable: true,
            editorConfig: (record: IndexData) => {
                return {
                    inputType: EditType.INPUT,
                    prop: {
                        disabled: false,
                    },
                };
            },
        },
        {
            title: 'Type',
            dataIndex: 'type',
            width: '40%',
            key: 'type',
            editable: true,
            editorConfig: (record: IndexData) => {
                return {
                    inputType: EditType.SELECT,
                    prop: {
                        options: [],
                        disabled: record.disabled,
                    },
                };
            },
        },
        {
            title: 'Column',
            dataIndex: 'column',
            width: '25%',
            key: 'column',
            editable: true,
            editorConfig: (record: IndexData) => {
                // if (!record.index) {
                //     record.isUnique = false;
                // }
                return {
                    inputType: EditType.SELECT,
                    prop: {
                        options: [
                            {
                                label: '否',
                                value: false,
                            },
                            { label: '是', value: true },
                        ],
                        disabled: record.disabled,
                    },
                };
            },
        },
        {
            title: 'ID',
            dataIndex: 'operate',
            key: 'operate',
            render: (_, record: any) => {
                return (
                    <>
                        {/* <IconFont type="icon-yuechi" /> */}
                        <IconFont type="icon-yuechi1" />
                    </>
                )
            }
        },
    ];
    const addNodeConfig = () => {
        const list = [...configList];
        list.push({ id: uniqueId(`index_`), index: `#${configList.length + 1}` });
        setConfigList(list)
    };
    // 多选
    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows) => {
            setSelectedRows(selectedRows)
        },
    };
    const [selectedMapRowKeys, setSelectedMapRowKeys] = useState([]);
    const data = [
        { id: 1, name: 'John Doe', age: 25 },
        { id: 2, name: 'Jane Smith', age: 30 },
        { id: 3, name: 'Bob Johnson', age: 35 },
    ]
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedMapRowKeys(data.map((item) => item.id));
        } else {
            setSelectedMapRowKeys([]);
        }
    };

    const handleSelectRow = (selectedRowKeys) => {
        setSelectedMapRowKeys(selectedRowKeys);
    };
    const mapcolumns = [
        {
            dataIndex: 'id',
            key: 'id',
            width: 35,
            render: (id) => (
                <Checkbox
                    checked={selectedMapRowKeys.includes(id)}
                    onChange={(e) => handleSelectRow(e.target.checked ? [...selectedMapRowKeys, id] : selectedMapRowKeys.filter((key) => key !== id))}
                />
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
        },
        {
            title: 'Contents',
            dataIndex: 'Contents',
            key: 'Contents',
        },
    ];
    const delEditTable = () => { 
        let result = []
        configList.map(item => selectedRows.map(v=> {
            if(item.id !==v.id){
                result.push(item) 
            }
        }))
        setSelectedRows([])
        setConfigList(result)

    }
    const mapFromFileConfirm = () => { }
    const mapConfigParams = {
        dataSource: data,
        columns: mapcolumns,
        showHeader: false,
        bordered: false,
        selectedMapRowKeys: selectedMapRowKeys,
        handleSelectAll: handleSelectAll,
        handleSelectRow: handleSelectRow,
        mapFromFileConfirm:mapFromFileConfirm
    }
    const propertyConfigParams = {
        dataSource: configList,
        columns: nodeConfigColumns,
        bordered: true,
        pagination: false,
        rowSelection: rowSelection,
        setConfigList: setConfigList,
        selectedRows: selectedRows,
        addNodeConfig: addNodeConfig,
        delEditTable: delEditTable
    }
    return <Editor mapConfigParams={mapConfigParams} propertyConfigParams={propertyConfigParams} />
}

export default PropertiesEditor;
