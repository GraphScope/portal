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
  delimiter?: string;
  datatype?: 'odps' | 'csv';
}
const LoadConfig: React.FC<IModalType> = props => {
  const { open, isImportFinish, onFinish, onColse, delimiter, datatype } = props;
  return (
    <Modal title="" open={open} footer={null} closable={false} width={1000}>
      <SplitSection
        splitText="Result"
        span={10}
        leftSide={<LeftSide onFinish={onFinish} onColse={onColse} delimiter={delimiter} datatype={datatype} />}
        rightSide={<RightSide isImportFinish={isImportFinish} />}
      />
    </Modal>
  );
};

export default LoadConfig;
