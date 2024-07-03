import React from 'react';
import ReactDOM from 'react-dom';
import ImportApp from '../app';
function getRandomId() {
  return 'gsp-importor-root-' + Math.random().toString(36).substr(2, 9);
}

const sdk = {
  render_modeling: props => {
    const { id = 'root' } = props || {};

    const defaultPrimitiveTypes = () => {
      return ['DT_DOUBLE', 'DT_STRING', 'DT_SIGNED_INT32', 'DT_SIGNED_INT64'].map(item => {
        return { label: item, value: item };
      });
    };
    const defaultQueryGraphSchema = async () => {
      return { nodes: [], edges: [] };
    };
    const {
      //@ts-ignore
      queryPrimitiveTypes = defaultPrimitiveTypes,
      //@ts-ignore
      queryGraphSchema = defaultQueryGraphSchema,
      //@ts-ignore
      appMode = 'DATA_MODELING',
    } = props;

    ReactDOM.render(
      <ImportApp queryPrimitiveTypes={queryPrimitiveTypes} queryGraphSchema={queryGraphSchema} appMode={appMode} />,
      document.getElementById(id),
    );
  },
};

export default sdk;
