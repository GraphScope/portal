import * as React from 'react';
import { Typography, Flex, Input, Space, Button, Row, Tooltip } from 'antd';
import PropertiesEditor from '../../../properties-editor';
import { useContext } from '../../useContext';
import PropertiesList from '../../../components/PropertiesList';
import SwitchSource from './switch-source';
import { CheckCircleOutlined, CaretUpOutlined, CaretDownOutlined, DeleteOutlined } from '@ant-design/icons';
import { useHandleChange } from './utils';
interface IPropertiesSchemaProps {
  GS_ENGINE_TYPE: string;
  getPrimitiveTypes(): { label: string; value: string }[];
  data: any;
  type: 'nodes' | 'edges';
  view: string;
  uploadFile(file): { file_path: string };
}
const { Text } = Typography;
const PropertiesSchema: React.FunctionComponent<IPropertiesSchemaProps> = props => {
  console.log('props', props);

  const { data, type, view } = props;
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
  const handleSubmit = () => {};
  const handleDelete = () => {
    console.log(id);
  };

  return (
    <div>
      <Flex vertical gap={12} style={{ margin: '0px 12px' }}>
        {view === 'import_data' ? (
          <div
            style={{
              // borderTop: `1px solid ${token.colorBorder}`,
              // background: primaryColor ? 'none' : '#FCFCFC',
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
                  uploadFile={props.uploadFile}
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
        ) : (
          <>
            <Typography.Text>Label</Typography.Text>
            <Input value={label} onChange={handleChangeLabel} />
          </>
        )}
        {type === 'edges' && (
          <>
            <Typography.Text>Source</Typography.Text>
            <Input value={source_label} disabled />
            <Typography.Text>Target</Typography.Text>
            <Input value={target_label} disabled />
          </>
        )}
        <PropertiesList properties={properties} onChange={handleProperty} typeOptions={props.getPrimitiveTypes()} />
        <Row justify="end">
          {props.GS_ENGINE_TYPE === 'groot' && (
            <Space>
              <Button size="small" type="primary" onClick={handleSubmit}>
                Submit
              </Button>
              <Button size="small" type="primary" danger ghost onClick={handleDelete}>
                Delete
              </Button>
            </Space>
          )}
        </Row>
      </Flex>
    </div>
  );
};

export default PropertiesSchema;
