import React, { FunctionComponent, CSSProperties } from 'react';
import { Button, Space, Tooltip, Popconfirm, Checkbox, Flex, Typography } from 'antd';
import { PlusOutlined, createFromIconfontCN } from '@ant-design/icons';
import MapFromFileTable from './MapFromFileTable';
import { FormattedMessage } from 'react-intl';
import { DeleteOutlined } from '@ant-design/icons';

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

const Controller = props => {
  const {
    title,
    selectedRowKeys,
    isMapFromFile = true,
    dataSource,
    disabled,
    addProperty,
    delProperty,
    handleMapFromFile,
  } = props;
  const [state, updateState] = React.useState({
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

  /** Map from file模块 */
  let heder = isMapFromFile && (
    <Popconfirm
      placement="leftTop"
      title={() => {
        return (
          <div style={{ width: '350px', padding: '0 12px' }}>
            <span>Mapping From File</span>
          </div>
        );
      }}
      description={
        <div style={{ width: '350px' }}>
          <MapFromFileTable handleChange={file => handleFile(file)} properties={dataSource} />
        </div>
      }
      icon=""
      okText={<div style={{ width: '88px', height: '45px' }}>Confirm</div>}
      cancelText={<div style={{ width: '88px', height: '45px' }}>Cancel</div>}
      onConfirm={() => handleMapFromFile(selectedKeys)}
    >
      <Button>Map from file</Button>
    </Popconfirm>
  );
  return (
    <>
      <Flex justify={'space-between'} style={{ padding: '12px 6px 4px 6px', height: '42px' }} align="center">
        <FormattedMessage id={title} />
        <>
          {selectedRowKeys.length == 0 ? (
            <Space>
              <Tooltip title={<FormattedMessage id="Add Property" />}>
                <Button icon={<PlusOutlined />} disabled={disabled} onClick={() => addProperty()} size="small" />
              </Tooltip>
              {heder}
            </Space>
          ) : (
            <Space>
              <span style={styles['sel-num']}>{selectedRowKeys.length} selected</span>
              <Button size="small" type="text" onClick={() => delProperty()} icon={<DeleteOutlined />}></Button>
            </Space>
          )}
        </>
      </Flex>
    </>
  );
};

export default Controller;
