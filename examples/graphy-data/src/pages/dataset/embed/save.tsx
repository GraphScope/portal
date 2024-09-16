import * as React from 'react';

import { useContext } from '@graphscope/studio-importor';
import { Button } from 'antd';
import { Toolbar, Utils } from '@graphscope/studio-components';
import { updateEmbedSchema, getEmbedSchema } from '../service';
import { useNavigate } from 'react-router-dom';
import { transformDataToSchema } from './transform';
const SaveButton = () => {
  const { store, updateStore } = useContext();
  const { nodes, edges } = store;
  const navigate = useNavigate();
  React.useEffect(() => {
    const datasetId = Utils.getSearchParams('id');
    getEmbedSchema(datasetId).then(res => {
      if (res) {
        const { nodes, edges } = transformDataToSchema(res);
        console.log(res, nodes);
        updateStore(draft => {
          draft.nodes = nodes;
          draft.edges = edges;
        });
      }
    });
  }, []);

  const handleClick = async () => {
    const datasetId = Utils.getSearchParams('id');
    await updateEmbedSchema(datasetId, {
      nodes: nodes,
      edges: edges,
    });
    navigate('/dataset');
  };

  return (
    <Button type="primary" onClick={handleClick}>
      Embed Graph
    </Button>
  );
};

export default SaveButton;
