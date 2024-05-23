import * as React from 'react';
import { Typography, Flex, Input } from 'antd';
import PropertiesEditor from '../../../properties-editor';
import { updateStore, useContext } from '../../useContext';
import PropertiesList from '../../../components/PropertiesList';
interface IPropertiesSchemaProps {
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
  console.log('dara', props, data);
  const { store } = useContext();
  const { nodes } = store;
  let source_label, target_label;
  if (source && target) {
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
      if (source && target) {
        draft.edges.map(item => {
          if (item.id === id) {
            item.data.label = label;
          }
        });
      } else {
        draft.nodes.map(item => {
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
      if (source && target) {
        draft.edges.map(item => {
          if (item.id === id) {
            item.properties = e;
          }
        });
      } else {
        draft.nodes.map(item => {
          if (item.id === id) {
            item.properties = e;
          }
        });
      }
    });
  };
  return (
    <div>
      <Flex vertical gap={12} style={{ margin: '0px 12px' }}>
        <Typography.Text>Label</Typography.Text>
        <Input value={label} onChange={handleChangeLabel} />
        {source && target && (
          <>
            <Typography.Text>Source</Typography.Text>
            <Input value={source_label} disabled />
            <Typography.Text>Target</Typography.Text>
            <Input value={target_label} disabled />
          </>
        )}
        <PropertiesList properties={properties} onChange={handleChange} />
      </Flex>
    </div>
  );
};

export default PropertiesSchema;
