export default {
  // 用于请求 endpoint
  'GET /query_endpoint': {
    success: true,
    data: {
      gremlin_endpoint: 'ws://127.0.0.1:12312/gremlin',
      cypher_endpoint: 'ws://127.0.0.1:12312/gremlin',
    },
  },
};
