import * as React from 'react';
import { Typography, Flex, Input, Space, Button, Row } from 'antd';
import { PropertiesList } from '@graphscope/studio-components';
import { useHandleChange } from './utils';
import LocationField from './location';
import SourceTarget from './source-target';
export interface IPropertiesSchemaProps {
  GS_ENGINE_TYPE: string;
  getPrimitiveTypes(): { label: string; value: string }[];
  data: any;
  type: 'nodes' | 'edges';
  view: string;
  uploadFile(file): { file_path: string };
}

const PropertiesSchema: React.FunctionComponent<IPropertiesSchemaProps> = props => {
  const { data, type, view } = props;
  const {
    id,
    data: { label },
    source,
    target,
    properties = [],
  } = data;

  const { handleChangeLabel, handleProperty } = useHandleChange({ type, id });

  const handleSubmit = () => {};
  const handleDelete = () => {
    console.log(id);
  };

  return (
    <div>
      <Flex vertical gap={12} style={{ margin: '0px 12px' }}>
        {view === 'import_data' ? (
          <LocationField {...props} />
        ) : (
          <>
            <Typography.Text>Label</Typography.Text>
            <Input value={label} onChange={handleChangeLabel} />
          </>
        )}
        {type === 'edges' && <SourceTarget source={source} target={target} />}
        <PropertiesList
          properties={properties}
          onChange={handleProperty}
          typeColumn={{ options: props.getPrimitiveTypes() }}
        />
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
