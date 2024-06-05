import * as React from 'react';
import { Typography, Flex, Space, Button, Tooltip } from 'antd';
import { useContext } from '../../../useContext';
import SwitchSource from './switch-source';
import { CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import useChange from './useChange';
import type { IPropertiesSchemaProps } from '../index';

// interface ILocationFieldProps {
//   handleUploadFile: () => { file_path: string };
// }

const { Text } = Typography;

const LocationField: React.FunctionComponent<IPropertiesSchemaProps> = props => {
  const { schema, type, uploadFile } = props;
  const {
    id,
    data: { filelocation, datatype, isBind },
  } = schema;

  const { onChangeType, onChangeValue, onChangeFocus, onChangeDataFields, deleteFile } = useChange({ type, id });

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
