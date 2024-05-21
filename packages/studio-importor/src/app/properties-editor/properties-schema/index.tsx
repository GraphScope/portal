import * as React from 'react';
import { Typography, Flex, Input } from 'antd';
import PropertiesEditor from '../../../properties-editor';
import { updateStore } from '../../useContext';
import PropertiesList from '../../../components/PropertiesList';
interface IPropertiesSchemaProps {
  data: any;
  type: 'nodes' | 'edges';
}

const PropertiesSchema: React.FunctionComponent<IPropertiesSchemaProps> = props => {
  const { data, type } = props;
  const { label, properties = [] } = data;
  console.log('dara', props, data);
  const handleChangeLabel = e => {
    updateStore(draft => {
      const match = draft;
    });
  };
  const handleChange = e => {
    console.log('e|||||', e);
  };
  return (
    <div>
      <Flex vertical gap={12} style={{ margin: '0px 12px' }}>
        <Typography.Text>Label</Typography.Text>
        <Input value={label} onChange={handleChangeLabel} />
        <PropertiesList properties={properties} onChange={handleChange} />
      </Flex>
    </div>
  );
};

export default PropertiesSchema;
