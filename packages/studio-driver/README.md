# Studio Driver

`@graphscope/studio-driver` aims to encapsulate the functionalities of `neo4j-driver` and `gremlin`, allowing developers to initiate graph query requests directly from both the server and client sides. This library provides a unified interface for interacting with graph databases, simplifying the process of sending and handling queries in web applications.

## Browser

```jsx | pure
import { queryGraph, CypherDriver, GremlinDriver } from '@graphscope/studio-driver';

const query_initiation = 'Browser'; // Browser or Server

const onClick = async () => {
  const _params = {
    endpoint: 'http://localhost:8182',
    script: 'Match (n) return n',
    language: 'cypher',
  };

  if (query_initiation === 'Browser') {
    return queryGraph(_params);
  }
  if (query_initiation === 'Server') {
    return await fetch('/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(_params),
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          return res.data;
        }
        return {
          nodes: [],
          edges: [],
        };
      });
  }
};
const App = () => {
  return <button onClick={onClick}>query data</button>;
};
```

## Node.js

```js | pure
const express = require('express');
const { CypherDriver, GremlinDriver, queryGraph } = require('@graphscope/studio-driver');
const app = express();
app.use(express.json());
app.post('/query', async (req, res) => {
  const { script, language, endpoint } = req.body;
  const data = await queryGraph({ script, language, endpoint }, { debugger: false });
  res.send({
    success: true,
    data: data,
  });
});
app.listen(3000, () => {});
```

- endpoint: The URL of your graph database endpoint.
- script: The query script to run (e.g., Cypher or Gremlin script).
- language: The query language (either 'cypher' or 'gremlin').
