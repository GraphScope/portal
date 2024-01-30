import * as React from 'react';
import Overview from './overview';
import Detial from './detail';

export interface IDetail {
  type: 'node' | 'edge';
  label: string;
  data: Record<string, any>;
}
import type { ILegnedOption } from './legend/content';
interface PropertiesPanelProps {
  mode: 'overview' | 'detail';
  overview: any;
  detail: IDetail;
  onChange: (params: ILegnedOption) => void;
}

const PropertiesPanel: React.FunctionComponent<PropertiesPanelProps> = props => {
  const { mode, overview, detail, onChange } = props;
  if (mode === 'detail') {
    return <Detial {...detail} />;
  }
  return <Overview {...overview} onChange={onChange} />;
};

export default PropertiesPanel;
