import * as React from 'react';
import { Flex, Card, Typography, Row, Col } from 'antd';
import Link from 'next/link';
const { Meta } = Card;

interface IToolsProps {}

const tools = [
  {
    name: 'Visualizer',
    description: 'An online graph visualization tool',
    features: ['Supports importing CSV/JSON data for instant graph visual analysis'],
    module: '@graphscope/studio-graph',
    link: '/tools/visualizer',
    img: '/tools/visualizer.png',
  },
  {
    name: 'Graphy',
    description: 'Discovers associations in unstructured data',
    features: [
      'Leverages LLM and expert-guided customization to convert PDF files into graph data, revealing hidden relational value',
    ],
    note: 'Follow the GitHub documentation to start the Graphy server',
    module: '@graphscope/graphy',
    link: '/tools/graphy',
    img: '/tools/graphy.png',
  },
  {
    name: 'Draw-pattern',
    description: 'Hand-drawn graph mode tool',
    module: '@graphscope/studio-query',
    features: [
      'Leverages LLM and expert-guided customization to convert PDF files into graph data, revealing hidden relational value',
    ],
    img: '/query/recommand.png',
    link: '/tools/visualizer',
  },
  {
    name: 'Kuzu_Wasm',
    description: 'Graph database querying tool',
    features: ['Supports Cypher/Gremlin queries by connecting to the graph database locally from the browser'],
    module: '@graphscope/studio-query',
    img: '/query/recommand.png',
    link: '/tools/visualizer',
  },
  {
    name: 'Modeling',
    description: 'Visual modeling tool',
    features: ['Allows users to manually drag-and-drop for intuitive modeling'],
    module: '@graphscope/importor',
    img: '/query/recommand.png',
    link: '/tools/visualizer',
  },
  {
    name: 'Querying',
    description: 'Graph database querying tool',
    features: ['Supports Cypher/Gremlin queries by connecting to the graph database locally from the browser'],
    module: '@graphscope/studio-query',
    img: '/query/recommand.png',
    link: '/tools/visualizer',
  },
];

const Tools: React.FunctionComponent<IToolsProps> = props => {
  return (
    <Flex vertical align="center" gap={12} style={{ paddingTop: '50px' }}>
      <Typography.Title style={{ fontSize: '30px' }}>GraphScope Portal Online Tools</Typography.Title>
      <Typography.Text style={{ fontSize: '16px' }} type="secondary">
        Thanks to its multi-package management, GraphScope Portal is more than just a Web UI product under the
        GraphScope Flex architecture.
      </Typography.Text>
      <Typography.Text style={{ fontSize: '16px', paddingBottom: '24px' }} type="secondary">
        Its various submodules can also be independently deployed as small, specialized tools within the graph
        ecosystem, providing users with compact and refined product modules.
      </Typography.Text>
      <Row gutter={[16, 32]}>
        {tools.map((tool, index) => (
          <Col span={8} key={index}>
            {/** @ts-ignore */}
            <Link href={tool.link} target="_blank">
              <Card style={{ padding: '1px' }} hoverable cover={<img alt={tool.name} src={tool.img} />}>
                <Meta title={tool.description} description={tool.features[0]} />
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Flex>
  );
};

export default Tools;
