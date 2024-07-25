import * as React from 'react';
import { Typography, Flex, Space } from 'antd';
import { FormattedMessage } from 'react-intl';
const { Title } = Typography;
import { useContext } from '../../hooks/useContext';
import Legend from '../StyleSetting/legend';
import { Utils } from '@graphscope/studio-components';
import { BgColorsOutlined } from '@ant-design/icons';
export interface IPropertiesPanelProps {}

const PropertiesPanel: React.FunctionComponent<IPropertiesPanelProps> = props => {
  const { store, updateStore } = useContext();
  const { emitter, nodeStyle, dataMap } = store;
  const [data, setData] = React.useState<{
    id: string;
    properties: Record<string, any>;
    label: string;
  } | null>(null);

  React.useEffect(() => {
    emitter?.on('node:click', (node: any) => {
      const { id } = node;
      const { neighbors, links } = dataMap[id];
      const slNodes = neighbors.reduce(
        (acc, curr) => {
          return {
            ...acc,
            [curr]: { hovering: true },
          };
        },
        {
          [id]: { selected: true },
        },
      );
      const slEdges = links.reduce((acc, curr) => {
        return {
          ...acc,
          [curr]: { selected: true },
        };
      }, {});
      if (node) {
        //@ts-ignore
        setData(node);
        updateStore(draft => {
          draft.nodeStatus = slNodes;
          draft.edgeStatus = slEdges;
        });
      }
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
      const newNodeStyle = {
        ...draft.nodeStyle,
        [id]: params,
      };
      draft.nodeStyle = newNodeStyle;
      Utils.storage.set(`GRAPH_${store.graphId}_STYLE`, {
        nodeStyle: newNodeStyle,
        edgeStyle: { ...draft.edgeStyle },
      });
    });
  };
  const style = nodeStyle[id] || nodeStyle[label];

  return (
    <div>
      <Flex justify="space-between" style={{ margin: '12px 0px' }}>
        <Title level={5} style={{ margin: '0px' }}>
          <FormattedMessage id="Vertex Properties" />
        </Title>

        <Legend
          // style
          {...style}
          label={label}
          type="node"
          properties={properties}
          onChange={onChange}
        />
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
