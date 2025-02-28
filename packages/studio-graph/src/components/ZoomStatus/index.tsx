import * as React from 'react';
import { useContext } from '../../';
import { ForceGraphInstance } from 'force-graph';
import { Typography, Space, Flex } from 'antd';
interface IZoomStatusProps {
  style?: React.CSSProperties;
}

const ZoomStatus: React.FunctionComponent<IZoomStatusProps> = props => {
  const { style = {} } = props;
  const { store } = useContext();
  const { graph, data } = store;
  const [state, setStatus] = React.useState({
    zoom: '1',
  });
  React.useEffect(() => {
    if (graph && (graph as ForceGraphInstance).onZoom) {
      (graph as ForceGraphInstance).onZoom(zoom => {
        setStatus(preState => {
          return {
            ...preState,
            zoom: zoom.k.toFixed(2),
          };
        });
      });
    }
  }, [graph, data]);
  return (
    <Space size="large" style={{ minWidth: '320px', opacity: 0.5, ...style }}>
      <Typography.Text type="secondary" italic>
        Nodes: {data.nodes.length}
      </Typography.Text>
      <Typography.Text type="secondary" italic>
        Edges: {data.edges.length}
      </Typography.Text>
      <Typography.Text type="secondary" italic>
        Zoom Ratio: {state.zoom}
      </Typography.Text>
    </Space>
  );
};

export default ZoomStatus;
