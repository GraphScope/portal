import React, { ReactNode, useCallback, useMemo } from 'react';
import templates from './quickStartTemplate';
import { useTransform } from '../../hooks/transform/useTransform';

interface QuickStartProps {
  title: string;
  svgSrc: ReactNode;
  id: string;
}
export const QuickStartItem: React.FC<QuickStartProps> = ({ title, svgSrc, id }) => {
  const template = useMemo(() => templates.find(item => item.templateId === id), [templates]);
  const { transformNodes, transformEdges } = useTransform();

  const handleClick = useCallback(() => {
    if (template) {
      transformNodes(template.nodes);
      transformEdges(template.edges, template.nodes);
    }
  }, [template]);

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
