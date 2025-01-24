import * as React from 'react';
import { Flex, Typography, Select } from 'antd';
import { useContext, GraphSchema } from '@graphscope/studio-graph';
import type { ItentionType } from './index';
import AddNodes from './AddNodes';
import { Utils } from '@graphscope/studio-components';
interface IAdjustSchemaProps {
  value: GraphSchema;
  onChange: (value: GraphSchema) => void;
}

const AdjustSchema: React.FunctionComponent<IAdjustSchemaProps> = props => {
  const { value, onChange } = props;
  const { store } = useContext();
  const { schema } = store;
  const { nodes } = value;
  const nodeSchemaMap = React.useMemo(() => {
    return schema.nodes.reduce((acc, cur) => {
      acc[cur.label] = cur;
      return acc;
    }, {});
  }, [schema]);

  return (
    <div>
      {nodes.map(item => {
        const { label, properties = [] } = item;
        if (!nodeSchemaMap[label]) {
          return <></>;
        }
        const options = nodeSchemaMap[label].properties.map(p => {
          return {
            label: p.name,
            value: p.name,
          };
        });
        const value = properties.map(p => {
          return p.name;
        });
        return (
          <Flex vertical gap={12} key={item.id}>
            <Flex justify="space-between" align="center">
              <Typography.Text italic type="secondary">
                {label}
              </Typography.Text>
              <AddNodes label={label} />
            </Flex>
            <Select
              options={options}
              mode="multiple"
              value={value}
              onChange={propertyKeys => {
                const sourceSchema = Utils.fakeSnapshot(props.value);
                sourceSchema.nodes.forEach(node => {
                  if (node.label === label) {
                    node.properties = propertyKeys.map(p => {
                      return { name: p };
                    });
                  }
                });
                onChange(sourceSchema);
              }}
            ></Select>
          </Flex>
        );
      })}
    </div>
  );
};

export default AdjustSchema;
