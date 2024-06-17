import * as React from 'react';
import { Modal } from 'antd';
import LeftSide from './left-side';
import RightSide from './right-side';
import { SplitSection } from '@graphscope/studio-components';
import type { FieldType } from './left-side';

export interface IModalType {
  open: boolean;
  isImportFinish: boolean;
  onFinish: (values: FieldType) => void;
  onColse: () => void;
}
const LoadConfig: React.FC<IModalType> = props => {
  const { open, isImportFinish, onFinish, onColse } = props;
  return (
    <Modal title="" open={open} footer={null} closable={false} width={1000}>
      <SplitSection
        splitText=""
        span={10}
        leftSide={<LeftSide onFinish={onFinish} onColse={onColse} />}
        rightSide={<RightSide isImportFinish={isImportFinish} />}
      />
    </Modal>
  );
};

export default LoadConfig;
