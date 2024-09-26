import * as React from 'react';
import ImportorApp from '@graphscope/studio-importor';
import { Toolbar } from '@graphscope/studio-components';
import Save from './save';
interface IDataImportProps {}

const DataImport: React.FunctionComponent<IDataImportProps> = props => {
  return (
    <div style={{ height: '300px' }}>
      <ImportorApp
        appMode="DATA_MODELING"
        defaultCollapsed={{
          leftSide: true,
          rightSide: true,
        }}
        /** 属性下拉选项值 */
        queryPrimitiveTypes={() => {
          return ['DT_DOUBLE', 'DT_STRING', 'DT_SIGNED_INT32', 'DT_SIGNED_INT64'].map(item => {
            return { label: item, value: item };
          });
        }}
      >
        <Toolbar style={{ top: '12px', left: '24px', right: 'unset' }} direction="horizontal">
          <Save />
        </Toolbar>
      </ImportorApp>
    </div>
  );
};

export default DataImport;
