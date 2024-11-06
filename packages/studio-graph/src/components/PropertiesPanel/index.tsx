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
  style?: React.CSSProperties;
}

const getSelectElement = (data, { nodeStatus, edgeStatus }) => {
  let type = 'node';
  const selectNode = data.nodes.find(item => {
    const match = nodeStatus[item.id];
    if (match && match.selected) {
      return match;
    }
  });
  if (selectNode) {
    return {
      type,
      selectElement: selectNode,
    };
  }
  const selectEdge = data.edges.find(item => {
    const match = edgeStatus[item.id];
    if (match && match.selected) {
      return match;
    }
  });
  if (selectEdge) {
    type = 'edge';
    return {
      type,
      selectElement: selectEdge,
    };
  }
  return {
    type,
    selectElement: null,
  };
};
const getDataByProperties = properties => {
  const dataSource = Object.entries(properties).map(item => {
    const [key, value] = item;
    return {
      name: key,
      dse: value,
    };
  });

  const FirstRow = dataSource[0];
  let columns: any[] = [];
  if (FirstRow) {
    columns = Object.keys(FirstRow).map(key => {
      return {
        title: key,
        dataIndex: key,
        key: key,
      };
    });
  }

  return {
    dataSource,
    columns,
  };
};

const PropertiesPanel: React.FunctionComponent<IPropertiesPanelProps> = props => {
  const { store, updateStore } = useContext();
  const { nodeStyle, nodeStatus, data, edgeStatus } = store;
  const { children } = props;
  const { selectElement, type } = getSelectElement(data, { nodeStatus, edgeStatus });

  if (!selectElement) {
    return <div style={{ height: '100%' }}>{children}</div>;
  }

  const { label, properties = {}, id } = selectElement;
  const { dataSource, columns } = getDataByProperties(properties);

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

  const title = type === 'node' ? 'Vertex Properties' : 'Edge Properties';

  return (
    <Flex
      vertical
      gap={12}
      style={{
        padding: '12px 0px',
        ...(props.style || {}),
      }}
    >
      <Flex justify="space-between">
        <Title level={5} style={{ margin: '0px' }}>
          <FormattedMessage id={title} />
        </Title>
        <Legend {...style} label={label} type={type as 'node' | 'edge'} properties={properties} onChange={onChange} />
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
