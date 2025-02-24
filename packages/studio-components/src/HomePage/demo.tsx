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
    title: 'Refreshes the World Record for the LDBC SNB Benchmark in both Performance and Data Scale',
    description: `
    LDBC released the latest results for the LDBC SNB Interactive benchmark test, where GraphScope Interactive leads the pack once again with a score exceeding 127,000 QPS (Queries Per Second), representing a more than 2.6 times improvement over the second place, which was the previous record holder!
  `,
    image: 'https://img.alicdn.com/imgextra/i1/O1CN01ptPGwB1KLpifRQal4_!!6000000001148-0-tps-1178-780.jpg',
    link: 'https://graphscope.io/blog/tech/2024/06/27/GraphScope-refreshes-the-world-record-for-the-LDBC-benchmark',
  },
  {
    title: 'Gopt ?',
    description: `
    LDBC released the latest results for the LDBC SNB Interactive benchmark test, where GraphScope Interactive leads the pack once again with a score exceeding 127,000 QPS (Queries Per Second), representing a more than 2.6 times improvement over the second place, which was the previous record holder!
  `,
    image: 'https://img.alicdn.com/imgextra/i1/O1CN01ptPGwB1KLpifRQal4_!!6000000001148-0-tps-1178-780.jpg',
  },
  {
    title: 'Visualization',
    description: `
    GraphScope provides a set of visualization tools that allow users to visualize their graphs in a variety of ways. It is built on top of Apache Arrow, which provides a columnar in-memory data format for efficient data processing.
    `,
    image: 'https://img.alicdn.com/imgextra/i2/O1CN01Kp7L9i1P6mmkYg0uo_!!6000000001792-0-tps-2290-1460.jpg',
  },
];

export default () => {
  return <HomeSite hero={hero} features={features} whychoose={whychooseus} installation={installation} />;
};
