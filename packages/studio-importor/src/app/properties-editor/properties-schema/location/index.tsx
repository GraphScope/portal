import * as React from 'react';
import { Typography, Flex, Input, Space, Button, Row, Tooltip } from 'antd';
import { useContext } from '../../../useContext';
import { PropertiesList, SegmentedTabs } from '@graphscope/studio-components';
import SwitchSource from './switch-source';
import { CheckCircleOutlined, CaretUpOutlined, CaretDownOutlined, DeleteOutlined } from '@ant-design/icons';
import { useHandleChange } from '../utils';
import type { IPropertiesSchemaProps } from '../index';

// interface ILocationFieldProps {
//   handleUploadFile: () => { file_path: string };
// }

const { Text } = Typography;

const LocationField: React.FunctionComponent<IPropertiesSchemaProps> = props => {
  const { data, type, view, uploadFile } = props;
  const {
    id,
    data: { label },
    source,
    target,
    properties = [],
    filelocation,
    datatype,
    isBind,
  } = data;

  const { store } = useContext();
  const { nodes } = store;
  const {
    onChangeType,
    onChangeValue,
    onChangeFocus,
    onChangeDataFields,
    deleteFile,
    handleChangeLabel,
    handleProperty,
  } = useHandleChange({ type, id });
  let source_label, target_label;
  if (type === 'edges') {
    nodes.forEach(item => {
      if (item.id === source) {
        source_label = item.data.label;
      }
      if (item.id === target) {
        target_label = item.data.label;
      }
    });
  }

  return (
    <div
      style={{
        borderRadius: '0px 0px 8px 8px',
      }}
    >
      <Flex vertical gap={8}>
        <Text>Location</Text>
        <Flex justify="space-between" align="center">
          <SwitchSource
            filelocation={filelocation}
            currentType={datatype}
            onChangeType={onChangeType}
            onChangeValue={onChangeValue}
            onChangeFocus={onChangeFocus}
            onChangeDataFields={onChangeDataFields}
            uploadFile={uploadFile}
          />
          <Space size={0}>
            {filelocation && (
              <Tooltip title="delete and re-upload">
                <Button type="text" size="small" icon={<DeleteOutlined onClick={deleteFile} />}></Button>
              </Tooltip>
            )}
            <Tooltip
              // title={
              //   isBind ? <FormattedMessage id="Bound data source" /> : <FormattedMessage id="Unbound data source" />
              // }
              title="Bound data source"
            >
              <Button
                type="text"
                size="small"
                icon={<CheckCircleOutlined style={{ color: isBind ? '#53C31C' : '#ddd' }} />}
              ></Button>
            </Tooltip>
          </Space>
        </Flex>
      </Flex>
    </div>
  );
};

export default LocationField;
