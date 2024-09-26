import { Button, Tooltip } from 'antd';
import React, { useState } from 'react';
import { SaveOutlined } from '@ant-design/icons';
import { useContext as useModeling } from '@graphscope/studio-importor';
import { createGraph, importGraph } from './services';
import localforage from 'localforage';

import { useNavigate } from 'react-router-dom';

interface SaveModelingProps {}

const SaveModeling: React.FunctionComponent<SaveModelingProps> = props => {
  const navigate = useNavigate();
  const [state, setState] = useState<{
    isLoading: boolean;
    open: boolean;
    status: string;
  }>({
    isLoading: false,
    open: false,
    status: 'success',
  });

  const { store: modelingStore } = useModeling();
  const { nodes, edges, csvFiles } = modelingStore;

  const handleSave = async () => {
    setState(preState => {
      return {
        ...preState,
        isLoading: true,
      };
    });
    const schema = { nodes, edges };
    const graph_id = await createGraph({
      //@ts-ignore
      nodes: schema.nodes,
      //@ts-ignore
      edges: schema.edges,
    });
    //@ts-ignore

    const csvFiles = (await localforage.getItem('DRAFT_GRAPH_FILES')) as File[];
    const res = await importGraph(csvFiles);
    console.log('res', res);

    setState(preState => {
      return {
        ...preState,
        isLoading: false,
        open: true,
      };
    });
    navigate(`/?tab=importing`);
  };

  return (
    <Tooltip title={'Save Modeling'}>
      <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
        Save Modeling
      </Button>
    </Tooltip>
  );
};

export default SaveModeling;
