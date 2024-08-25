import * as React from 'react';
import { Typography, Flex, Table } from 'antd';
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
      console.log('PropertiesPanel node', node);

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
  }, [emitter, dataMap]);
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
  const dataSource = Object.entries(properties).map(item => {
    const [key, value] = item;
    return {
      name: key,
      dse: value,
    };
  });
  const FirstRow = dataSource[0];
  const columns = Object.keys(FirstRow).map(key => {
    return {
      title: key,
      dataIndex: key,
      key: key,
    };
  });

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
      <Table
        style={{ height: '100%' }}
        showHeader={false}
        columns={columns}
        dataSource={dataSource}
        scroll={{ y: 410 }}
        pagination={false}
      />
    </div>
  );
};

PropertiesPanel.displayName = 'PropertiesPanel';

PropertiesPanel.defaultProps = {
  title: 'GraphScope',
};

export default PropertiesPanel;
