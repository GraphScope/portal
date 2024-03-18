export default {
  // 用于请求 endpoint
  'GET /query_endpoint': {
    success: true,
    data: {
      gremlin_endpoint: 'ws://127.0.0.1:12312/gremlin',
      cypher_endpoint: 'neo4j://47.242.172.5:7688',
    },
  },
};
