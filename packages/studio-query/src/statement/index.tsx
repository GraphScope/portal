import React, { useState } from 'react';
import { Space, Button } from 'antd';
import Toolbar from './toolbar';
import Editor from './editor';
import Result from './result';
import Container from './container';

export interface IStatementProps {
  /** 单击选中的语句 */
  activeId: string;
}

export interface IStatementState {
  /** 需要额外对比的语句 */
  compareIds: string[];
  /** 展示的模式 */
  compareDisplayMode: 'flow' | 'tabs';
}
const Statement: React.FunctionComponent<IStatementProps> = props => {
  return (
    <Container>
      <Editor />
      <Result />
    </Container>
  );
};

export default Statement;
