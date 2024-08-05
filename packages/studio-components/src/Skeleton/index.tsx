import React from 'react';
import { Skeleton } from 'antd';
interface ISkeletonComponent {
  active?: boolean;
  children: React.ReactNode;
}
const SkeletonComponent: React.FC<ISkeletonComponent> = props => {
  const { active = true, children } = props;
  //   return <Skeleton.Node active={active}>{children}</Skeleton.Node>;
  return <>{children}</>;
};

export default SkeletonComponent;
