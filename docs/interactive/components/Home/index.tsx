import React from 'react';

import { Icons, HomePage } from '@graphscope/studio-components';
import { GithubOutlined } from '@ant-design/icons';

const hero = {
  title: 'A High-Performance, Graph-native Engine for Massive Concurrent Queries',
  description: undefined,
  actions: [
    {
      title: 'Try it online',
      link: 'https://gsp.vercel.app',
      icon: null,
      primary: true,
    },
    {
      title: 'Github',
      link: 'https://github.com/alibaba/graphscope',
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
      'Horisontally Scalable',
    ],
  },
  {
    icon: Icons.Explorer,
    title: 'Visualization Toolkit',
    description: [
      'User-friendly web interface that simplifies managing graph data',
      'Graph visualization in miniseconds',
      'Self-developed Exploration Tool',
    ],
  },
];

const installation = [
  {
    type: 'python',
    description: `pip3 install gsctl
# Deploy the interactive service in local mode
gsctl instance deploy --type interactive
`,
  },
  {
    type: 'docker',
    description: `# Pull the GraphScope Interactive Docker image
docker pull registry.cn-hongkong.aliyuncs.com/graphscope/interactive:0.29.3-arm64

# Start the GraphScope Interactive service
docker run -d --name gs --label flex=interactive -p 8080:8080 -p 7777:7777 -p 10000:10000 -p 7687:7687 registry.cn-hongkong.aliyuncs.com/graphscope/interactive:0.29.3-arm64 --enable-coordinator
`,
  },
];

const whychooseus = [
  {
    keyword: 'performance',
    title: 'Refreshes the World Record for the LDBC SNB Benchmark',
    description: `
    LDBC released the latest results for the LDBC SNB Interactive benchmark test, where GraphScope Interactive leads the pack once again with a score exceeding 127,000 QPS (Queries Per Second), representing a more than 2.6 times improvement over the second place, which was the previous record holder!
  `,
    image: 'https://img.alicdn.com/imgextra/i1/O1CN01ptPGwB1KLpifRQal4_!!6000000001148-0-tps-1178-780.jpg',
    link: 'https://graphscope.io/blog/tech/2024/06/27/GraphScope-refreshes-the-world-record-for-the-LDBC-benchmark',
  },
  {
    title: 'GOpt: A Graph-Native Query Optimization Framework',
    description: `
   GOpt is a graph-native query optimizer designed to accelerate query execution. It excels in handling hybrid scenarios that combine complex graph pattern matching with relational operations on large graphs. GOpt is not aware of the underlying storage data and focuses solely on computation on top of the data, which makes it easy and fast to be integrated into other graph or relational databases. The LDBC benchmark results show that GOpt significantly outperforms Neo4j. On the Neo4j execution engine, GOpt is 8.8x faster than Neo4j’s plan. Even more impressive, on the GraphScope execution engine, GOpt achieves a speedup of 33x. This makes GOpt a powerful choice for optimizing graph database performance.
  `,
    image: 'https://img.alicdn.com/imgextra/i1/O1CN01OlTDO81z8SOmNGNxw_!!6000000006669-0-tps-1708-1562.jpg',
  },
  {
    keyword: 'user-experience',
    title: 'Effortless Graph Exploration with Intuitive Tools',
    description: `
      GraphScope Interactive redefines graph exploration with its powerful and efficient engine. Seamlessly integrated with GraphScope Portal, a web-based interface for real-time query execution and visualization, it empowers users to unlock insights from complex graphs with ease. Focus on your data, not the complexity.GraphScope Interactive makes advanced graph analytics accessible to everyone.
    `,
    image: 'https://img.alicdn.com/imgextra/i4/O1CN01dA6GaL1S0mRJPUL5f_!!6000000002185-0-tps-3092-1878.jpg',
    link: 'https://github.com/GraphScope/portal',
  },
];
export default () => {
  return <HomePage hero={hero} features={features} installation={installation} whychoose={whychooseus} />;
};
