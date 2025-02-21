import React from 'react';
import HomeSite from '.';
import * as Icons from '../Icons';
import { GithubOutlined } from '@ant-design/icons';

const hero = {
  title: 'An Intuitive Graph Data Management Tool for GraphScope',
  description:
    'It offers one-stop access to data modeling, importing, querying, and monitoring, catering to both Interactive and Insight engines within the Flex architecture',
  actions: [
    {
      title: 'Try it online',
      link: 'https://gsp.vercel.app',
      icon: null,
      primary: true,
    },
    {
      title: 'Github',
      link: 'https://github.com/GraphScope/portal',
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
  return <HomeSite hero={hero} features={features} />;
};
