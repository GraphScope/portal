import * as React from 'react';
import { Typography, Flex, Space } from 'antd';
import { FormattedMessage } from 'react-intl';
const { Title } = Typography;
import { useContext } from '../../hooks/useContext';
import Legend from '../StyleSetting/legend';
export interface IPropertiesPanelProps {}

const PropertiesPanel: React.FunctionComponent<IPropertiesPanelProps> = props => {
  const { store, updateStore } = useContext();
  const { emitter } = store;
  const [data, setData] = React.useState<{
    id: string;
    properties: Record<string, any>;
    label: string;
  } | null>(null);

  React.useEffect(() => {
    emitter?.on('node:click', node => {
      console.log('PropertiesPanel node:click', node);
      //@ts-ignore
      setData(node);
    });

    return () => {
      emitter?.off('node:click');
    };
  }, [emitter]);
  if (!data) {
    return null;
  }
  const { properties = {}, label, id } = data;

  const onChange = val => {
    const { properties, ...params } = val;
    updateStore(draft => {
      draft.nodeStyle = {
        ...draft.nodeStyle,
        [id]: params,
      };
    });
  };

  return (
    <div>
      <Flex justify="space-between" style={{ margin: '12px 0px' }}>
        <Title level={5} style={{ margin: '0px' }}>
          <FormattedMessage id="Vertex Properties" />
        </Title>
        <Legend caption="id" properties={properties} label={label} color="red" type="node" onChange={onChange} />
      </Flex>

      <table
        style={{
          borderSpacing: '0px',
        }}
      >
        <tbody>
          {Object.keys(properties).map((key, i) => {
            return (
              <tr style={{ backgroundColor: i % 2 == 1 ? '' : '#F7F6F6' }} key={key}>
                <td style={{ minWidth: '80px', margin: '0px', padding: '4px' }}>{key}</td>
                <td style={{ minWidth: '120px', fontSize: '14px', padding: '4px' }}>{properties[key]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

PropertiesPanel.displayName = 'PropertiesPanel';

PropertiesPanel.defaultProps = {
  title: 'GraphScope',
};

export default PropertiesPanel;
