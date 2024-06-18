import { Button, Modal } from 'antd';
import * as React from 'react';
import { useContext } from '../../layouts/useContext';
import { useContext as useImporting } from '@graphscope/studio-importor';
import { submitDataloadingJob, bindDatasourceInBatch } from './services';
import type { FieldType } from './load-config/left-side';
import LoadConfig from './load-config';
import { set } from 'lodash';

interface StartImportingProps {
  onClick?: () => void;
}
const { useState } = React;
const StartImporting: React.FunctionComponent<StartImportingProps> = props => {
  const { store } = useContext();
  const { store: importingStore } = useImporting();
  const { appMode, nodes, edges } = importingStore;
  const { graphId } = store;

  const [state, updateState] = useState<{
    open: boolean;
    isImportFinish: boolean;
    datatype?: 'odps' | 'csv';
    delimiter?: string;
  }>({
    open: false,
    /** 是否导入完成 */
    isImportFinish: false,
    datatype: 'csv',
    delimiter: ',',
  });
  const { open, isImportFinish, delimiter, datatype } = state;

  const handleBound = async () => {
    const bindStatus = await bindDatasourceInBatch(graphId || '', {
      nodes: nodes,
      edges: edges,
    });
    const firstNode = nodes[0];
    const { delimiter, datatype } = firstNode.data;
    console.log('bindStatus', bindStatus);
    updateState(preset => {
      return {
        ...preset,
        open: true,
        delimiter,
        datatype,
      };
    });
  };
  const handleClick = async (values: FieldType) => {
    /** loading config */
    // console.log(values);
    // //先绑定数据
    // const bindStatus = await bindDatasourceInBatch(graphId || '', {
    //   nodes: nodes,
    //   edges: edges,
    // });
    // 再倒入数据
    const res = await submitDataloadingJob(
      graphId || '',
      {
        nodes,
        edges,
      },
      values,
    );
    console.log('res', res);
    updateState(preset => {
      return {
        ...preset,
        isImportFinish: true,
      };
    });
  };

  if (appMode === 'DATA_IMPORTING') {
    return (
      <>
        <Button type="primary" onClick={handleBound}>
          Start importing
        </Button>
        <LoadConfig
          delimiter={delimiter}
          datatype={datatype}
          open={open}
          isImportFinish={isImportFinish}
          onFinish={handleClick}
          onColse={() =>
            updateState(preset => {
              return {
                ...preset,
                open: false,
              };
            })
          }
        />
      </>
    );
  }
  return null;
};

export default StartImporting;
