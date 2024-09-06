import React, { ReactNode, useCallback, useMemo, useRef } from 'react';
import { useTransform } from '../../hooks/transform/useTransform';
import { useGenerateTemplate } from '../../hooks/generateTemplate/useGenerateTemplate';

interface QuickStartProps {
  title: string;
  svgSrc: ReactNode;
  id: string;
}
export const QuickStartItem: React.FC<QuickStartProps> = ({ title, svgSrc, id }) => {
  const { transformNodes, transformEdges } = useTransform();
  const { generateSelfLoop, generateTriangleLoop } = useGenerateTemplate();

  const handleClick = useCallback(() => {
    const triangleLoopData = generateTriangleLoop();
    const selfLoopData = generateSelfLoop();

    switch (id) {
      case 'triangle-loop':
        transformNodes(triangleLoopData.nodes);
        transformEdges(triangleLoopData.edges, triangleLoopData.nodes);
        break;
      case 'self-loop':
        transformNodes(selfLoopData.nodes);
        transformEdges(selfLoopData.edges, selfLoopData.nodes);
        break;
      default:
        break;
    }
  }, []);

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
      >
        {svgSrc}
      </div>
    </div>
  );
};
