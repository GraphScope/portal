import * as React from 'react';
import { Typography, Flex, Space } from 'antd';
const { Title } = Typography;
import { FormattedMessage } from 'react-intl';
import Legend from './legend';
import { useContext } from '../../hooks/useContext';

interface IOverviewProps {}

const StyleSetting: React.FunctionComponent<IOverviewProps> = props => {
  const { updateStore, store } = useContext();
  const { graph, schema } = store;
  const { nodes, edges } = schema;
  const onChange = value => {
    console.log('value', value);
    const { caption, color, label, size } = value;
    updateStore(draft => {
      //   draft.nodes.forEach(node => {
      //     if (node.label === label) {
      //       node.__style_color = color;
      //       node.__style_size = size;
      //       node.__style_caption = caption;
      //     }
      //   });
      draft.nodeStyle = {
        ...draft.nodeStyle,
        [label]: {
          color,
          size,
          caption,
        },
      };
    });

    // graph?.nodeColor(node => {
    //   console.log('node', node);
    //   if (node.label === label) {
    //     return color;
    //   }
    // });
  };

  return (
    <div>
      <Title level={5} style={{ marginTop: '6px' }}>
        <FormattedMessage id="Vertex Labels" />
      </Title>
      <Space wrap size={[0, 6]}>
        {nodes.map(item => {
          return <Legend key={item.label} {...item} type="node" onChange={onChange} />;
        })}
      </Space>
      <Title level={5}>
        <FormattedMessage id="Edge Labels" />
      </Title>
      <Space wrap size={[0, 6]}>
        {edges.map(item => {
          return <Legend key={item.label} {...item} type="edge" onChange={onChange} />;
        })}
      </Space>
    </div>
  );
};

export default React.memo(StyleSetting);
