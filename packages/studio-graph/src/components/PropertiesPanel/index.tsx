import * as React from 'react';
import { Typography, Flex, Table } from 'antd';
import { FormattedMessage } from 'react-intl';
const { Title } = Typography;
import { useContext } from '../../hooks/useContext';
import Legend from '../StyleSetting/legend';
import { Utils } from '@graphscope/studio-components';
import { BgColorsOutlined } from '@ant-design/icons';
export interface IPropertiesPanelProps {
  children: React.ReactNode;
}

const PropertiesPanel: React.FunctionComponent<IPropertiesPanelProps> = props => {
  const { store, updateStore } = useContext();
  const { nodeStyle, dataMap, nodeStatus, data } = store;
  const { children } = props;

  const selectNode = data.nodes.find(item => {
    const match = nodeStatus[item.id];
    if (match && match.selected) {
      return match;
    }
  });

  if (!selectNode) {
    return <div>{children}</div>;
  }

  const { label, properties = {}, id } = selectNode;

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
    <Flex vertical gap={12}>
      <Flex justify="space-between">
        <Title level={5} style={{ margin: '0px' }}>
          <FormattedMessage id="Vertex Properties" />
        </Title>
        <Legend {...style} label={label} type="node" properties={properties} onChange={onChange} />
      </Flex>
      <Table
        style={{ height: '100%', width: '100%' }}
        showHeader={false}
        columns={columns}
        dataSource={dataSource}
        scroll={{ y: 410 }}
        pagination={false}
      />
    </Flex>
  );
};

export default PropertiesPanel;
