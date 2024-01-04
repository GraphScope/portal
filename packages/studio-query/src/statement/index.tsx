import React, { useState, memo } from 'react';
import { Space, Button } from 'antd';

import Editor from './editor';
import Result from './result';
import Container from './container';
import { IEditorProps } from './typing';

export type IStatementProps = IEditorProps & {};

const Statement: React.FunctionComponent<IStatementProps> = props => {
  const { onQuery, onClose, onSave, script, id } = props;
  return (
    <Container>
      <Editor id={id} script={script} onClose={onClose} onQuery={onQuery} onSave={onSave} />
      <Result />
    </Container>
  );
};

export default memo(Statement);
