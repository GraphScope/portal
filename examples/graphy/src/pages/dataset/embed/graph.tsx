import * as React from 'react';

import ImportorApp from '@graphscope/studio-importor';
import { Button } from 'antd';
import { Toolbar, Utils } from '@graphscope/studio-components';
import RightSide from './right-side';
import ImportSchema from './import-schema';

import SaveButton from './save';

interface IModelingProps {}

const EmbedSchema: React.FunctionComponent<IModelingProps> = props => {
  return (
    <ImportorApp
      style={{
        height: 'calc(100vh - 100px)',
      }}
      appMode="DATA_MODELING"
      defaultCollapsed={{
        leftSide: true,
        rightSide: true,
      }}
      rightSide={<RightSide />}
      rightSideStyle={{
        width: '350px',
        padding: '0px 12px',
      }}
      // queryGraphSchema={queryGraphSchema}
      queryPrimitiveTypes={() => {
        return ['DT_DOUBLE', 'DT_STRING', 'DT_SIGNED_INT32', 'DT_SIGNED_INT64'].map(item => {
          return { label: item, value: item };
        });
      }}
    >
      <Toolbar style={{ top: '12px', right: '124px', left: 'unset' }} direction="horizontal">
        <SaveButton />
        <ImportSchema />
      </Toolbar>
    </ImportorApp>
  );
};

export default EmbedSchema;
