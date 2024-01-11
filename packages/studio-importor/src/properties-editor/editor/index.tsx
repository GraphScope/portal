import React, { forwardRef, memo, FunctionComponent } from 'react';
import { Button, Space, Tooltip, Popconfirm, Checkbox } from 'antd';
import { PlusOutlined, createFromIconfontCN } from '@ant-design/icons';
import { EditTable } from '../edit-table';
import {MapConfigParamsType,PropertyConfigParamsType} from '../interface'
// 使用createFromIconfontCN创建一个IconFont组件，加载自定义图标库
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/a/font_4377140_eryoeoa0lk5.js',
});
const styles = {
  'properties-head': {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '0',
  },
  'sel-num': {
    paddingRight: '12px',
    borderRight: '1px solid #e5e6e8',
  },
};

const Editor: FunctionComponent<MapConfigParamsType & PropertyConfigParamsType> = memo(
  forwardRef((props, ref) => {
    // 解构props中的mapConfigParams和propertyConfigParams
    const { mapConfigParams, propertyConfigParams } = props;
    return (
      <>
        <div>
          <div style={styles['properties-head']}>
            <h4>Properties</h4>
            <div>
              {propertyConfigParams?.selectedRows.length == 0 ? (
                <Space>
                  {propertyConfigParams?.isMapFromFile ? (
                    <Popconfirm
                      placement="leftTop"
                      title={() => {
                        return (
                          <div style={{ width: '350px', padding: '0 12px' }}>
                            <span>Map from file</span>
                            <Checkbox
                              indeterminate={
                                mapConfigParams?.selectedMapRowKeys.length > 0 &&
                                mapConfigParams?.selectedMapRowKeys.length < mapConfigParams?.dataSource.length
                              }
                              checked={
                                mapConfigParams?.selectedMapRowKeys.length === mapConfigParams?.dataSource.length
                              }
                              onChange={mapConfigParams?.handleSelectAll}
                              style={{ float: 'right' }}
                            >
                              Select all
                            </Checkbox>
                          </div>
                        );
                      }}
                      description={
                        <div style={{ width: '350px' }}>
                          <EditTable
                            rowKey="mapfromfile"
                            bordered={false}
                            showHeader={mapConfigParams?.showHeader}
                            columns={mapConfigParams?.columns}
                            dataSource={mapConfigParams?.dataSource}
                          />
                        </div>
                      }
                      icon=""
                      okText={<div style={{ width: '88px', height: '45px' }}>Confirm</div>}
                      cancelText={<div style={{ width: '88px', height: '45px' }}>Cancel</div>}
                      onConfirm={() => mapConfigParams?.mapFromFileConfirm()}
                    >
                      <Button>Map from file</Button>
                    </Popconfirm>
                  ) : null}
                  <Tooltip title="Add property">
                    <Button type="dashed" block onClick={() => propertyConfigParams?.addNodeConfig()}>
                      <PlusOutlined />
                    </Button>
                  </Tooltip>
                </Space>
              ) : (
                <Space>
                  <span style={styles['sel-num']}>{propertyConfigParams?.selectedRows.length} selected</span>
                  <IconFont type="icon-delete" onClick={() => propertyConfigParams?.delEditTable()} />
                </Space>
              )}
            </div>
          </div>
          <EditTable
            ref={ref}
            columns={propertyConfigParams?.columns}
            dataSource={propertyConfigParams?.dataSource}
            rowKey="id"
            onChange={(newData: any) => {
              propertyConfigParams?.setConfigList([...newData]);
            }}
            inputDoubleClick={propertyConfigParams?.inputDoubleClick}
            inputBlur={propertyConfigParams?.inputBlur}
            bordered={true}
            rowSelection={{
              ...propertyConfigParams?.rowSelection,
            }}
          />
        </div>
      </>
    );
  }),
);

export default Editor;
