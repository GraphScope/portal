import { Graph } from '@graphscope/studio-graph-editor';
import { Button, Popover } from 'antd';
import React, { useEffect, useState } from 'react';
import { BehaviorSubject, map } from 'rxjs';

export const Canvas = () => {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Graph graphId="edit"></Graph>
    </div>
  );
};
