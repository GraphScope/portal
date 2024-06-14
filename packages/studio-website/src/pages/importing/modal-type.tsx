import * as React from 'react';
import LeftSide from './left-side';
import RightSide from './ringht-side';
import { SplitSection } from '@graphscope/studio-components';
import type { FieldType } from './left-side';

export interface IModalType {
  isImportFinish: boolean;
  handleFinish: (values: FieldType) => void;
  handleColse: () => void;
}
const { useState } = React;
const ModalType: React.FC<IModalType> = props => {
  const { isImportFinish, handleFinish, handleColse } = props;
  return (
    <>
      <SplitSection
        leftSide={<LeftSide isImportFinish={isImportFinish} handleFinish={handleFinish} handleColse={handleColse} />}
        rightSide={<RightSide isImportFinish={isImportFinish} handleColse={handleColse} />}
      />
    </>
  );
};

export default ModalType;
