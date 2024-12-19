import StatementQuery from './query-statement';
import React from 'react';
import ReactDOM from 'react-dom';

export default {
  render_query_statement: config => {
    const { id = 'root' } = config || {};
    ReactDOM.render(<StatementQuery {...config} />, document.getElementById(id));
  },
};
