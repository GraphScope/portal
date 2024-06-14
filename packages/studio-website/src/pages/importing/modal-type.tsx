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
  const [state, updateState] = useState({
    finish: false,
  });
  const { finish } = state;

  return (
    <>
      <SplitSection
        leftSide={
          <LeftSide
            finish={finish}
            handleFinish={handleFinish}
            handleColse={handleColse}
            handleState={() => {
              updateState(preset => {
                return {
                  ...preset,
                  finish: true,
                };
              });
            }}
          />
        }
        rightSide={<RightSide isImportFinish={isImportFinish} finish={finish} />}
      />
    </>
  );
};

export default ModalType;
