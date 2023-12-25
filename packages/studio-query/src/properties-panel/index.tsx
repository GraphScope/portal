import * as React from 'react';
import Overview from './overview';
import Detial from './detail';
import Container from './container';

interface PropertiesPanelProps {
  mode: 'overview' | 'detail';
  overview: any;
  detail: any;
  onChange: () => string;
}

const PropertiesPanel: React.FunctionComponent<PropertiesPanelProps> = props => {
  const { mode, overview, detail, onChange } = props;
  const content = mode === 'detail' ? <Detial {...detail} /> : <Overview {...overview} onChange={onChange}/>;
  return <Container>{content}</Container>;
};

export default PropertiesPanel;
