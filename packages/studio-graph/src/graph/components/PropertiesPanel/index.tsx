import * as React from 'react';
import { useGraph } from '../../context';
export interface IPropertiesPanelProps {}

const PropertiesPanel: React.FunctionComponent<IPropertiesPanelProps> = props => {
  const { emitter } = useGraph();
  const [data, setData] = React.useState({});
  React.useEffect(() => {
    console.log('PropertiesPanel effect.......');
    emitter?.on('node:click', node => {
      console.log('PropertiesPanel node:click', node);
      setData(node);
    });

    return () => {
      emitter?.off('node:click');
    };
  }, [emitter]);

  return <div>{JSON.stringify(data, null, 2)}</div>;
};

PropertiesPanel.displayName = 'PropertiesPanel';

PropertiesPanel.defaultProps = {
  title: 'GraphScope',
};

export default PropertiesPanel;
