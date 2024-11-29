import React from 'react';
import useStore from './useStore';
interface ICircleAnimationProps {
  statusValue: string[];
}
const CircleAnimation: React.FC<ICircleAnimationProps> = ({ statusValue }) => {
  const { getStatusColor } = useStore();
  const colors = [
    { color: 'blue', opacity: 1 },
    { color: 'grey', opacity: 0.9 },
    { color: 'green', opacity: 0.8 },
    { color: 'red', opacity: 0.6 },
    { color: 'orange', opacity: 0.4 },
  ];

  const circleStyle = (backgroundColor, opacity) => ({
    width: '15px',
    height: '15px',
    borderRadius: '50%',
    backgroundColor,
    opacity,
    marginLeft: '-6px',
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '6px' }}>
      {statusValue.map((item, index) => (
        <div key={index} style={circleStyle(getStatusColor(item), colors[index].opacity)} />
      ))}
    </div>
  );
};

export default CircleAnimation;
