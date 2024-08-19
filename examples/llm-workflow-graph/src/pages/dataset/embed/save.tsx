import * as React from 'react';

import { useContext } from '@graphscope/studio-importor';
import { Button } from 'antd';
import { Toolbar, Utils } from '@graphscope/studio-components';

const SaveButton = () => {
  const { store } = useContext();
  const { nodes, edges } = store;

  const handleClick = async () => {
    console.log(nodes, edges);
  };

  return (
    <Button type="primary" onClick={handleClick}>
      Embed Graph
    </Button>
  );
};

export default SaveButton;
