import React from 'react';

import { Icons, HomePage } from '@graphscope/studio-components';
import { GithubOutlined } from '@ant-design/icons';

const hero = {
  title: 'A High-Performance, Graph-native Engine for Massive Concurrent Queries',
  description: undefined,
  actions: [
    {
      title: 'Try it online',
      link: null,
      icon: null,
      primary: true,
    },
    {
      title: 'Github',
      link: null,
      icon: <GithubOutlined />,
    },
  ],
};
const features = [
  {
    icon: Icons.Model,
    title: 'Graph Modeling',
    description: [
      'Property Graph Data Model',
      'Cypher Query Language, Extensible for Other Query Language, e.g. GQL, Gremlin',
    ],
  },
  {
    icon: Icons.Database,
    title: 'Graph-native Storage and Query Optimization',
    description: [
      'Graph-native Adjacency List | No KV/Relational Wrapper',
      'Vectorized Storage and Compressed Result',
      // 'Self-developed graph query optimization with optimality guarantee',
    ],
  },
  {
    icon: Icons.Qps,
    title: 'Tens of thousands of Queries per Second',
    description: [
      'Record-breaking LDBC Benchmarking Resutls',
      'Multi-core Concurrent Query Execution',
      // 'Horisontally Scalable',
    ],
  },
  {
    icon: Icons.Explorer,
    title: 'Visualization Toolkit',
    description: ['Graph visualization in miniseconds', 'Self-developed Exploration Tool', 'LLM integration'],
  },
];

export default () => {
  return <HomePage hero={hero} features={features} />;
};
