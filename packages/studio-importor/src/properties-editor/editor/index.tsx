import React from 'react';
import { Button, Space, Tooltip, Popconfirm, Checkbox } from 'antd';
import { PlusOutlined, createFromIconfontCN } from '@ant-design/icons';
import { EditTable } from '../edit-table';
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
const Editor = (props: { mapConfigParams: any; propertyConfigParams: any },ref) => {
  // 解构props中的mapConfigParams和propertyConfigParams
  const { mapConfigParams, propertyConfigParams } = props;
  return (
    <>
      <div>
        <p style={styles['properties-head']}>
          <h3>Properties</h3>
          {propertyConfigParams?.selectedRows.length == 0 ? (
            <Space>
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
                        checked={mapConfigParams?.selectedMapRowKeys.length === mapConfigParams?.dataSource.length}
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
                      bordered={mapConfigParams?.bordered}
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
        </p>
        <EditTable
          columns={propertyConfigParams?.columns}
          dataSource={propertyConfigParams?.dataSource}
          rowKey="id"
          onChange={(newData: any) => {
            propertyConfigParams?.setConfigList([...newData]);
          }}
          bordered={true}
          pagination={false}
          rowSelection={{
            ...propertyConfigParams?.rowSelection,
          }}
        />
      </div>
    </>
  );
};

export default Editor;
