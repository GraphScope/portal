import React, { FunctionComponent, CSSProperties } from 'react';
import { Button, Space, Tooltip, Popconfirm, Checkbox, Flex, Typography } from 'antd';
import { PlusOutlined, createFromIconfontCN } from '@ant-design/icons';
import { EditTable } from '../edit-table';
import { MapConfigParamsType, PropertyConfigParamsType } from '../interface';
// 使用createFromIconfontCN创建一个IconFont组件，加载自定义图标库
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/a/font_4377140_eryoeoa0lk5.js',
});
const styles: { [x: string]: CSSProperties } = {
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

const Editor: FunctionComponent<MapConfigParamsType & PropertyConfigParamsType> = props => {
  // 解构props中的mapConfigParams和propertyConfigParams
  const { mapConfigParams, propertyConfigParams } = props;
  const { locales, selectedMapRowKeys, columns, dataSource, handleSelectAll, mapFromFileConfirm } = mapConfigParams;
  const { selectedRows, setConfigList, isMapFromFile, addNodeConfig, delEditTable } = propertyConfigParams;
  /** Map from file模块 */
  let MapFromFile = isMapFromFile && (
    <Popconfirm
      placement="leftTop"
      title={() => {
        return (
          <div style={{ width: '350px', padding: '0 12px' }}>
            <span>{locales.mapFromFile}</span>
            <Checkbox
              indeterminate={selectedMapRowKeys.length > 0 && selectedMapRowKeys.length < dataSource.length}
              checked={selectedMapRowKeys.length === dataSource.length}
              onChange={handleSelectAll}
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
            showHeader={false}
            bordered={false}
            columns={columns}
            dataSource={dataSource}
          />
        </div>
      }
      icon=""
      okText={<div style={{ width: '88px', height: '45px' }}>Confirm</div>}
      cancelText={<div style={{ width: '88px', height: '45px' }}>Cancel</div>}
      onConfirm={() => mapFromFileConfirm()}
    >
      <Button>Map from file</Button>
    </Popconfirm>
  );
  return (
    <>
      <Flex justify={'space-between'} style={{ padding: '12px 6px 4px 6px', height: '42px' }} align="center">
        <Typography.Text>{locales.properties}</Typography.Text>
        <>
          {selectedRows.length == 0 ? (
            <Space>
              <Tooltip title={locales.addProperty}>
              <Tooltip title="Add property">
                <Button icon={<PlusOutlined />} onClick={() => addNodeConfig()} size="small">
                  {locales.addProperty}
                </Button>
              </Tooltip>
              {MapFromFile}
            </Space>
          ) : (
            <Space>
              <span style={styles['sel-num']}>{selectedRows.length} selected</span>
              <IconFont type="icon-delete" onClick={() => delEditTable()} />
            </Space>
          )}
        </>
      </Flex>
      <EditTable
        rowKey="id"
        bordered={true}
        onChange={(newData: any) => {
          setConfigList([...newData]);
        }}
        {...propertyConfigParams}
      />
    </>
  );
};

export default Editor;
