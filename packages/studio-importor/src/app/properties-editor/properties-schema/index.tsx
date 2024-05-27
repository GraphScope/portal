import * as React from 'react';
import { Typography, Flex, Input, Space, Button, Row } from 'antd';
import PropertiesEditor from '../../../properties-editor';
import { useContext } from '../../useContext';
import PropertiesList from '../../../components/PropertiesList';
interface IPropertiesSchemaProps {
  GS_ENGINE_TYPE: string;
  getPrimitiveTypes(): { label: string; value: string }[] | undefined;
  data: any;
  type: 'nodes' | 'edges';
}

const PropertiesSchema: React.FunctionComponent<IPropertiesSchemaProps> = props => {
  const { data, type } = props;
  const {
    id,
    data: { label },
    source,
    target,
    properties = [],
  } = data;

  const { store, updateStore } = useContext();
  const { nodes } = store;
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
  const handleChangeLabel = e => {
    const label = e.target.value;

    updateStore(draft => {
      draft.displayMode = 'table';
      if (type === 'edges') {
        draft.edges.forEach(item => {
          if (item.id === id) {
            item.data.label = label;
          }
        });
      }
      if (type === 'nodes') {
        draft.nodes.forEach(item => {
          if (item.id === id) {
            item.data.label = label;
          }
        });
      }
    });
  };

  const handleChange = e => {
    console.log('e|||||', e);
    updateStore(draft => {
      if (type === 'edges') {
        draft.edges.map(item => {
          if (item.id === id) {
            //@ts-ignore
            item.properties = e;
          }
        });
      }
      if (type === 'nodes') {
        draft.nodes.map(item => {
          if (item.id === id) {
            //@ts-ignore
            item.properties = e;
          }
        });
      }
    });
  };
  const handleSubmit = () => {};
  const handleDelete = () => {
    console.log(id);
  };
  return (
    <div>
      <Flex vertical gap={12} style={{ margin: '0px 12px' }}>
        <Typography.Text>Label</Typography.Text>
        <Input value={label} onChange={handleChangeLabel} />
        {type === 'edges' && (
          <>
            <Typography.Text>Source</Typography.Text>
            <Input value={source_label} disabled />
            <Typography.Text>Target</Typography.Text>
            <Input value={target_label} disabled />
          </>
        )}
        <PropertiesList properties={properties} onChange={handleChange} typeOptions={props.getPrimitiveTypes()} />
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
