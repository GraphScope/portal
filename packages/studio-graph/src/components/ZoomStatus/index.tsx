import * as React from 'react';
import { useContext } from '../../';
import { ForceGraphInstance } from 'force-graph';
import { Typography, Space } from 'antd';
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
    <div style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 998, padding: '12px', ...style }}>
      <Space size="large">
        <Typography.Text type="secondary">Node Counts: {data.nodes.length}</Typography.Text>
        <Typography.Text type="secondary">Edge Counts: {data.edges.length}</Typography.Text>
        <Typography.Text type="secondary">Zoom Ratio: {state.zoom}</Typography.Text>
      </Space>
    </div>
  );
};

export default ZoomStatus;
