import React, { useEffect } from 'react';
import { history } from 'umi';
import { Button, notification, Steps as AntdSteps, Alert, Breadcrumb, Form } from 'antd';
import { useContext } from '../create-instance/useContext';
import ChooseEnginetype from './choose-enginetype';
import CreateSchema from '../create-instance/create-schema';
import Result from './result';
import ResultFailed from './result/result-failed';
import ResultSuccess from './result/result-success';
import { FormattedMessage } from 'react-intl';
import { createGraph } from './service';
import { initialStore, useStore } from './useContext';
const { GS_ENGINE_TYPE } = window;

/**
 * 左侧的操作按钮
 * @param props
 * @returns
 */
const LeftButton = (props: { currentStep: any; handlePrev: any; createInstaseResult: any }) => {
  const { currentStep, handlePrev, createInstaseResult } = props;

  if (currentStep === 0) {
    return null;
  }
  if (currentStep === 3 && !createInstaseResult) {
    return null;
  }
  if (currentStep > 0) {
    return (
      <Button style={{ margin: '0 8px', minWidth: '100px' }} onClick={handlePrev}>
        <FormattedMessage id="Previous" />
      </Button>
    );
  }
};
/**
 * 右侧的操作按钮
 * @param props
 * @returns
 */
const RightButton = (props: { currentStep: any; handleNext: any; handleSubmit: any; mode: 'create' | 'view' }) => {
  const { currentStep, handleNext, handleSubmit, mode } = props;
  if (currentStep === 0 || currentStep === 1) {
    return (
      <Button type="primary" onClick={handleNext} style={{ minWidth: '100px' }}>
        <FormattedMessage id="Next" />
      </Button>
    );
  }
  if (currentStep === 2) {
    if (mode === 'create' || GS_ENGINE_TYPE === 'groot') {
      return (
        <Button type="primary" onClick={handleSubmit} style={{ minWidth: '100px' }}>
          <FormattedMessage id="Confirm and create" />
        </Button>
      );
    } else {
      return (
        <Button
          type="primary"
          onClick={() => {
            history.push('/instance');
          }}
          style={{ minWidth: '100px' }}
        >
          <FormattedMessage id="Done" />
        </Button>
      );
    }
  }
  if (currentStep === 3) {
    return (
      <Button
        type="primary"
        onClick={() => {
          history.push('/instance');
        }}
        style={{ minWidth: '100px' }}
      >
        <FormattedMessage id="Done" />
      </Button>
    );
  }
  return null;
};

export interface ICreateGraph {
  mode?: 'view' | 'create';
  currentStep?: number;
  nodeList?: any;
  edgeList?: any;
  graphName: string;
}

const Steps: React.FunctionComponent<{ currentStep: number }> = () => {
  const { currentStep } = useStore();
  let steps = [
    { title: <FormattedMessage id="Graph Metadata" /> },
    { title: <FormattedMessage id="Define graph schema" /> },
    { title: <FormattedMessage id="Preview" /> },
    { title: <FormattedMessage id="Result" /> },
  ];
  // if (mode === 'view' && GS_ENGINE_TYPE === 'interactive') {
  //   steps = [{ title: <FormattedMessage id="View schema" /> }, { title: <FormattedMessage id="Preview" /> }];
  // }
  const items = steps.map(item => ({ key: item.title, title: item.title }));
  return <AntdSteps current={currentStep} items={items} />;
};

const CreateInstance: React.FunctionComponent<ICreateGraph> = props => {
  const { store, updateStore } = useContext();
  const { currentStep, createInstaseResult, storeType, nodeList, edgeList, graphName, mode } = store;
  useEffect(() => {
    let stepIndex = 1;
    const { nodeList = [], edgeList = [], graphName = '', mode = 'create' } = props;
    if (mode === 'create') {
      // 如果是空Schema或者是创建模式，才从第一步开始
      stepIndex = 0;
    }
    updateStore(draft => {
      draft.storeType = storeType;
      draft.mode = mode;
      draft.currentStep = stepIndex;
      draft.nodeActiveKey = nodeList.length && nodeList[0].id;
      draft.edgeActiveKey = edgeList.length && edgeList[0].id;
      draft.graphName = graphName;
      /** groot 查询数据回填 */
      draft.nodeList = nodeList;
      draft.edgeList = edgeList;
    });
    console.log(props);

    return () => {
      console.log('clear............');
      updateStore(draft => {
        Object.keys(initialStore).forEach(key => {
          //@ts-ignore
          draft[key] = initialStore[key];
        });
      });
    };
  }, []);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  /** 图创建失败提示框 */
  const openNotification = (result: string) => {
    api.error({
      message: 'Graph creation failed',
      description: result,
    });
  };
  const next = () => {
    if (form.getFieldsValue().graphName || mode === 'view') {
      updateStore(draft => {
        draft.currentStep = currentStep + 1;
      });
    }
  };

  // createGraph
  const handleSubmit = () => {
    //@ts-ignore
    createGraph(graphName, storeType, nodeList, edgeList)
      .then(() => {
        /** 成功true */
        updateStore(draft => {
          draft.currentStep = currentStep + 1;
          draft.createInstaseResult = true;
        });
      })
      .catch(error => {
        console.log(error.message);
        openNotification(error.message);
      });
  };
  const prev = () => {
    updateStore(draft => {
      draft.currentStep = currentStep - 1;
    });
  };

  const itemStyle: React.CSSProperties = {
    display: 'none',
    padding: '12px 0px',
  };
  const activeItemStyle: React.CSSProperties = {
    ...itemStyle,
    display: 'block',
  };

  return (
    <div style={{ padding: '12px 24px' }}>
      {contextHolder}
      <Breadcrumb
        items={[
          {
            title: (
              <a href="/instance">
                <FormattedMessage id="navbar.graphs" />
              </a>
            ),
          },
          {
            title: <FormattedMessage id="Creating a new graph" />,
          },
        ]}
      />
      <div style={{ padding: '24px 0px' }}>
        {GS_ENGINE_TYPE === 'interactive' && mode === 'view' && (
          <Alert
            message={
              <FormattedMessage
                id="Your graph instance is of type {enginetype} and cannot be modified after creation. Instead, you may choose to create a new graph instance."
                values={{ enginetype: GS_ENGINE_TYPE }}
              />
            }
            type="info"
            showIcon
            closable
            style={{ margin: '16px 0' }}
          />
        )}
        <Steps currentStep={currentStep} />

        <div>
          <div style={currentStep === 0 ? activeItemStyle : itemStyle}>
            <ChooseEnginetype form={form} />
          </div>
          <div style={currentStep === 1 ? activeItemStyle : itemStyle}>
            <CreateSchema />
          </div>
          <div style={currentStep === 2 ? activeItemStyle : itemStyle}>
            <Result />
          </div>
          <div style={currentStep === 3 ? activeItemStyle : itemStyle}>
            {createInstaseResult ? <ResultSuccess /> : <ResultFailed />}
          </div>
        </div>
        <div>
          <div>
            <LeftButton
              currentStep={currentStep}
              handlePrev={prev}
              createInstaseResult={createInstaseResult}
              mode={mode}
            />
            <RightButton currentStep={currentStep} handleNext={next} handleSubmit={handleSubmit} mode={mode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInstance;
