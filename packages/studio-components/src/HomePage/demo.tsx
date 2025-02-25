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
  // video: 'https://img.alicdn.com/imgextra/i4/O1CN01dA6GaL1S0mRJPUL5f_!!6000000002185-0-tps-3092-1878.jpg',
};
const features = [
  {
    icon: Icons.Database,

    title: 'Data Modeling',
    description: ['Build graph models manually or automatically on a free-form canvas.'],
  },

  {
    icon: Icons.Qps,
    title: 'Data Querying',
    description: ['Execute queries using Cypher/Gremlin languages with visualized results.'],
  },
  {
    icon: Icons.Explorer,
    title: 'Data Exploration',
    description: ['Low-barrier, interactive graph analysis driven by user interactions.'],
  },
  {
    icon: Icons.Model,
    title: 'Open Architecture',
    description: ['Supports multiple query engines and extensible components for integration and custom development.'],
  },
];

const installation = [
  {
    type: 'docker',
    description: `# Pull the GraphScope Portal  Docker image

docker pull ghcr.io/graphscope/portal:latest

# Start server

docker run -d -p 8888:8888 --name my-portal ghcr.io/graphscope/portal:latest
`,
  },

  {
    type: 'source code',
    description: `# git clone repo

git clone https://github.com/GraphScope/portal.git

# Compile front-end assets

npm run ci

# Start the server

cd packages/studio-website/server
npm run dev
`,
  },
  {
    type: 'npm',
    description: `npm install @graphscope/studio-website

# usage
import GraphScopePortal from '@graphscope/studio-site';

const App = () => {
  return <GraphScopePortal />;
};
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
`,
  },
  {
    type: 'python',
    description: `# install gs-visual-tool
  
pip install gs-visual-tool

# Usage

import gs_visual_tool
gs_visual_tool.querying()
`,
  },
];

const whychooseus = [
  {
    title: 'Build Graph Models Freely Like on a Whiteboard – Simple and Efficient',
    description:
      "Traditional data modeling often requires tedious template configurations. GraphScope Portal's Data Modeling module offers a free-form canvas where users can intuitively design graph models as if sketching on a whiteboard, with real-time WYSIWYG editing. For structured CSV data, it provides one-click auto-import modeling and supports manual refinements, significantly boosting modeling efficiency.",
    link: '',
    image: 'https://img.alicdn.com/imgextra/i3/O1CN01TDJNPL1S4u0LV8mYS_!!6000000002194-0-tps-2568-1598.jpg',
  },
  {
    image: 'https://img.alicdn.com/imgextra/i4/O1CN012dvMJg21NEPA3Cvsy_!!6000000006972-0-tps-2904-1590.jpg',
    title: 'Powerful Interactive Querying with Multi-Language Support and Visualization',
    description:
      "GraphScope Portal's Data Querying module features a robust editor with Cypher/Gremlin syntax autocompletion, highlighting, and version control. Users can save queries, review history, get schema-driven recommendations, and leverage LLM-powered natural language queries. Results are dynamically visualized in graphs, tables, and other rich formats.",
  },
  {
    title: 'Zero-Code Data Exploration Driven by Intuitive Interactions',
    description:
      'The Exploration module offers search tools, style/layout analysis, statistical profiling, clustering, and pathfinding components. Users bypass query scripting entirely – simple UI interactions automatically generate query snippets for instant, on-the-fly graph data exploration.',
    image: 'https://img.alicdn.com/imgextra/i2/O1CN01RpqYMD1r1ZWAxtdiX_!!6000000005571-0-tps-2906-1608.jpg',
  },
  {
    title: 'Open Source, Open Architecture – Built for Flexibility',
    description:
      'GraphScope Portal supports modular decoupling for web and Python integrations. Customize language settings, themes, color schemes, and UI details for any deployment scenario. With fully open-sourced code and extensible APIs, openness drives every design decision.',
    image: 'https://img.alicdn.com/imgextra/i4/O1CN01XTFlj724luaxOvSSc_!!6000000007432-0-tps-1642-762.jpg',
  },
];

export default () => {
  return <HomeSite hero={hero} features={features} whychoose={whychooseus} installation={installation} />;
};
