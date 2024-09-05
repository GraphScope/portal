import * as React from 'react';

import { useContext } from '@graphscope/studio-importor';
import { Button } from 'antd';
import { Toolbar, Utils } from '@graphscope/studio-components';
import { updateEmbedSchema, getEmbedSchema } from '../service';
import { useNavigate } from 'react-router-dom';

const SaveButton = () => {
  const { store, updateStore } = useContext();
  const { nodes, edges } = store;
  const navigate = useNavigate();
  React.useEffect(() => {
    const datasetId = Utils.getSearchParams('id');
    getEmbedSchema(datasetId).then(res => {
      console.log(res);
      if (res) {
        updateStore(draft => {
          draft.nodes = res.nodes || [];
          draft.edges = res.edges || [];
        });
      }
    });
  }, []);

  const handleClick = async () => {
    console.log(nodes, edges);
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
