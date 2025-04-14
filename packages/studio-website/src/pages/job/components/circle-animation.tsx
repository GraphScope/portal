import React from 'react';
import useStore from '../hooks/useStore';

interface ICircleAnimationProps {
  statusValue: string[]; // 状态值数组，用于动态生成圆圈的颜色
}

const CircleAnimation: React.FC<ICircleAnimationProps> = ({ statusValue }) => {
  const { getStatusColor } = useStore(); // 从自定义 Hook 中获取颜色生成函数
  const colors = [1, 0.9, 0.8, 0.6, 0.4]; // 定义透明度数组，用于生成不同透明度的圆圈

  /**
   * 生成圆圈样式的函数
   * @param backgroundColor - 圆圈的背景颜色
   * @param opacity - 圆圈的透明度
   * @returns 样式对象
   */
  const circleStyle = (backgroundColor: string, opacity: number) => ({
    width: '15px',
    height: '15px',
    borderRadius: '50%',
    backgroundColor, // 动态设置背景颜色
    opacity,
    marginLeft: '-6px',
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '6px',
      }}
    >
      {statusValue.map((item, index) => (
        // 遍历状态值数组，为每个状态生成一个圆圈
        <div
          key={index}
          style={circleStyle(
            getStatusColor(item), // 根据状态值获取对应的颜色
            colors[index % colors.length], // 根据索引循环使用透明度数组
          )}
        />
      ))}
    </div>
  );
};

export default CircleAnimation;
