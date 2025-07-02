import React, { useState } from 'react';
import { QueryCell } from './index';

export default {
  title: 'Components/QueryCell',
  component: QueryCell,
};

const databaseList = ['neo4j', 'memgraph', 'tigergraph'];

export const Default = () => (
  <QueryCell databaseList={databaseList} currentDatabase="neo4j" value={''} onChange={() => {}} />
);

export const DarkMode = () => (
  <div className="dark bg-neutral-900 p-4">
    <QueryCell
      databaseList={databaseList}
      currentDatabase="memgraph"
      value={'MATCH (n) RETURN n;'}
      onChange={() => {}}
    />
  </div>
);

export const Interactive = () => {
  const [val, setVal] = useState('MATCH (n) RETURN n;');
  return (
    <QueryCell
      databaseList={databaseList}
      currentDatabase="tigergraph"
      value={val}
      onChange={setVal}
      onRun={() => alert('运行查询')}
      onDelete={() => alert('删除 notebook')}
    />
  );
};
