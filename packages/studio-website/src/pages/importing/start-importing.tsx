import { Button, Modal } from 'antd';
import * as React from 'react';
import { useContext } from '../../layouts/useContext';
import { useContext as useImporting } from '@graphscope/studio-importor';
import { submitDataloadingJob, bindDatasourceInBatch } from './services';
import type { FieldType } from './load-config/left-side';
import { SplitSection } from '@graphscope/studio-components';
import LeftSide from './load-config/left-side';
import RightSide from './load-config/right-side';

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
    result?: {
      status: 'success' | 'error';
      message: string;
    };
    datatype?: 'odps' | 'csv';
    delimiter?: string;
  }>({
    open: false,
    /** 是否导入完成 */
    result: undefined,
    datatype: 'csv',
    delimiter: ',',
  });
  const { open, result, delimiter, datatype } = state;

  const handleBound = async () => {
    const bindStatus = await bindDatasourceInBatch(graphId || '', {
      nodes: nodes,
      edges: edges,
    });
    const firstNode = nodes[0];
    const { delimiter, datatype } = firstNode.data;

    updateState(preset => {
      return {
        ...preset,
        open: true,
        delimiter,
        datatype,
      };
    });
  };
  const onFinish = async (values: FieldType) => {
    let _status: string, _message: string;
    const res = await submitDataloadingJob(
      graphId || '',
      {
        nodes,
        edges,
      },
      values,
    )
      .then((res: any) => {
        if (res.status === 200) {
          _status =
            'The data loading task has been successfully created. You can view detailed logs in the jobs center.';
          _message = ``;
          return res.data && res.data.job_id;
        }
        _status = 'error';
        _message = res.message;
      })
      .catch(error => {
        _status = 'error';
        _message = error.response.data;
      });

    console.log('res', res);
    updateState(preset => {
      return {
        ...preset,
        result: {
          status: _status as 'success' | 'error',
          message: _message,
        },
      };
    });
  };
  const onColse = () => {
    updateState(preset => {
      return {
        ...preset,
        open: false,
        result: undefined,
      };
    });
  };

  if (appMode === 'DATA_IMPORTING') {
    return (
      <>
        <Button type="primary" onClick={handleBound}>
          Start importing
        </Button>
        <Modal title="" open={open} footer={null} closable={false} width={1000}>
          <SplitSection
            splitText=""
            span={12}
            leftSide={<LeftSide onFinish={onFinish} onColse={onColse} delimiter={delimiter} datatype={datatype} />}
            rightSide={result ? <RightSide message={state.result?.message} status={state.result?.status} /> : null}
          />
        </Modal>
      </>
    );
  }
  return null;
};

export default StartImporting;
