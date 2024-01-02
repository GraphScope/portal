import React, { useState } from 'react';
import { Space, Button } from 'antd';
import Toolbar from './toolbar';
import Editor from './editor';
import Result from './result';
import Container from './container';

export interface IStatementProps {}

export interface IStatementState {
  /** 单击选中的语句 */
  id: string;
  /** 需要额外对比的语句 */
  compareIds: string[];
  /** 展示的模式 */
  compareDisplayMode: 'flow' | 'tabs';
}
const Statement: React.FunctionComponent<IStatementProps> = props => {
  const [state, updateState] = useState<IStatementState>({
    id: '',
    compareIds: [],
    compareDisplayMode: 'tabs',
  });
  const { compareIds, id } = state;
  const instances = [id, ...compareIds];
  return instances.map(id => {
    return (
      <Container key={id}>
        <Toolbar />
        <Editor />
        <Result />
      </Container>
    );
  });
};

export default Statement;
