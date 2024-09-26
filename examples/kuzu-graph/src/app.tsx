import ReactDOM from 'react-dom/client';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { SegmentedTabs } from '@graphscope/studio-components';
import DataImport from './components/import-data';
import { QueryStatement } from '@graphscope/studio-query';

interface IAppProps {}
const App: React.FunctionComponent<IAppProps> = props => {
  const navigate = useNavigate();
  const items = [
    {
      label: 'Importor',
      key: 'modeling',
      children: <DataImport />,
    },
    {
      label: 'Querying',
      key: 'querying',
      children: <QueryStatement />,
    },
  ];
  return <SegmentedTabs items={items} block />;
};

export default App;
