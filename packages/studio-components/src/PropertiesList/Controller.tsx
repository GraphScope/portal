import React, { FunctionComponent, CSSProperties } from 'react';
import { Button, Space, Tooltip, Popconfirm, Checkbox, Flex, Typography } from 'antd';
import { PlusOutlined, createFromIconfontCN } from '@ant-design/icons';
import MapFromFileTable from './MapFromFileTable';
import type { Property } from './typing';
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
interface IControllerProps {
  title: string;
  selectedRowKeys: React.Key[];
  isMapFromFile?: boolean;
  dataSource: any[];
  disabled?: boolean;
  addProperty: () => void;
  delProperty: () => void;
  handleMapFromFile: (keys: Property[]) => void;
}
const Controller: React.FC<IControllerProps> = props => {
  const {
    title,
    selectedRowKeys,
    isMapFromFile = false,
    dataSource,
    disabled,
    addProperty,
    delProperty,
    handleMapFromFile,
  } = props;
  const [state, updateState] = React.useState<{ selectedKeys: React.Key[] }>({
    selectedKeys: [],
  });
  const { selectedKeys } = state;
  /** 需要map propertylist */
  const handleFile = file => {
    updateState(preset => {
      return {
        ...preset,
        selectedKeys: file,
      };
    });
  };
  const indeterminate = selectedKeys.length > 0 && selectedKeys.length < dataSource.length;
  const checkAll = dataSource.length > 0 && dataSource.length === selectedKeys.length;
  const onCheckAllChange = e => {
    const newSet = e.target.checked ? dataSource.map(item => item) : [];
    handleFile(newSet);
  };
  /** Map from file模块 */
  let heder = isMapFromFile && (
    <Popconfirm
      placement="leftTop"
      title={() => {
        return (
          <Flex style={{ width: '350px', paddingBottom: '6px' }} justify="space-between">
            <span>Mapping From File</span>
            <Checkbox indeterminate={indeterminate} checked={checkAll} onChange={onCheckAllChange}>
              Select all
            </Checkbox>
          </Flex>
        );
      }}
      description={
        <div style={{ width: '350px' }}>
          <MapFromFileTable
            handleChange={file => handleFile(file)}
            properties={dataSource}
            selectedKeys={selectedKeys}
          />
        </div>
      }
      icon=""
      okText={<div style={{ width: '60px' }}>Confirm</div>}
      cancelText={<div style={{ width: '60px' }}>Cancel</div>}
      onConfirm={() => handleMapFromFile(selectedKeys)}
    >
      <Button>Map from file</Button>
    </Popconfirm>
  );
  return (
    <>
      <Flex justify={'space-between'} style={{ padding: '12px 6px 4px 6px', height: '42px' }} align="center">
        {title}
        <>
          {selectedRowKeys.length == 0 ? (
            <Space>
              <Tooltip title="Add Property">
                <Button icon={<PlusOutlined />} disabled={disabled} onClick={() => addProperty()} size="small" />
              </Tooltip>
              {heder}
            </Space>
          ) : (
            <Space>
              <span style={styles['sel-num']}>{selectedRowKeys.length} selected</span>
              <IconFont type="icon-delete" onClick={() => delProperty()} />
            </Space>
          )}
        </>
      </Flex>
    </>
  );
};

export default Controller;
