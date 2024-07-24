import * as React from 'react';
import { useContext } from '../../hooks/useContext';
export interface IPropertiesPanelProps {}

const PropertiesPanel: React.FunctionComponent<IPropertiesPanelProps> = props => {
  const { store } = useContext();
  const { emitter } = store;
  const [data, setData] = React.useState({});
  React.useEffect(() => {
    console.log('PropertiesPanel effect.......');
    emitter?.on('node:click', node => {
      console.log('PropertiesPanel node:click', node);
      //@ts-ignore
      setData(node);
    });

    return () => {
      emitter?.off('node:click');
    };
  }, [emitter]);

  return <div>xxxxx{JSON.stringify(data, null, 2)}</div>;
};

PropertiesPanel.displayName = 'PropertiesPanel';

PropertiesPanel.defaultProps = {
  title: 'GraphScope',
};

export default PropertiesPanel;
