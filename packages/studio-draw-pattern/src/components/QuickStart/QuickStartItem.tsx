import React, { ReactNode, useCallback, useMemo, useRef } from 'react';
import { useTransform } from '../../hooks/transform/useTransform';
import { useGenerateTemplate } from '../../hooks/generateTemplate/useGenerateTemplate';
import { useGraphStore } from '../../stores/useGraphStore';
import { useNodeStore } from '../../stores/useNodeStore';
import { useEdgeStore } from '../../stores/useEdgeStore';
import { usePropertiesStore } from '../../stores/usePropertiesStore';

interface QuickStartProps {
  title: string;
  svgSrc: ReactNode;
  id: string;
}
export const QuickStartItem: React.FC<QuickStartProps> = ({ title, svgSrc, id }) => {
  const { transformNodes, transformEdges } = useTransform();
  const {
    generateSelfLoop,
    generateTriangleLoop,
    generatePaperChallenge,
    generatePaperChallengeSolution,
    generatePaperCite,
    generateComplexPaperCite,
  } = useGenerateTemplate();

  const clearGraphStore = useGraphStore(state => state.clearGraphStore);
  const clearNode = useNodeStore(state => state.clearNode);
  const clearEdge = useEdgeStore(state => state.clearEdge);
  const clearProperties = usePropertiesStore(state => state.clearProperties);

  const handleClick = () => {
    // 每次 selection change 都要清空 store
    clearNode && clearNode();
    clearEdge && clearEdge();
    clearGraphStore();
    clearProperties();

    console.log('点击的模型', id);

    const generateDataFunctions: any = {
      'triangle-loop': generateTriangleLoop,
      'self-loop': generateSelfLoop,
      'paper-challenge': generatePaperChallenge,
      'paper-challenge-solution': generatePaperChallengeSolution,
      'paper-cite': generatePaperCite,
      'complex-paper-cite': generateComplexPaperCite,
    };

    const generateFunction = generateDataFunctions[id];

    if (generateFunction) {
      const data = generateFunction();
      transformNodes(data.nodes);
      transformEdges(data.edges, data.nodes);
    }
  };

  return (
    <div
      style={{ border: '1px solid #E3E3E3', borderRadius: '5px', padding: '0.8rem', cursor: 'pointer' }}
      onClick={handleClick}
    >
      {title}
      <div
        style={{
          height: '8rem',
          backgroundColor: '#F0F0F0',
          marginTop: '0.8rem',
          borderRadius: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={handleClick}
      >
        {svgSrc}
      </div>
    </div>
  );
};
