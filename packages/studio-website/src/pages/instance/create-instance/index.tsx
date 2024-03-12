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
import { transOptionsToSchema } from '@/components/utils/schema';
import { cloneDeep } from 'lodash';
import { initialStore, useStore } from './useContext';

/**
 * 左侧的操作按钮
 * @param props
 * @returns
 */
const LeftButton = (props: { currentStep: any; handlePrev: any; createInstaseResult: any; mode: any }) => {
  const { currentStep, handlePrev, createInstaseResult, mode } = props;

  if (currentStep === 0) {
    return null;
  }
  if (currentStep === 1 && mode === 'view') {
    return null;
  }
  if (currentStep === 3 && !createInstaseResult) {
    return null;
  }
  if (currentStep > 0) {
    return (
      <Button style={{ marginRight: '8px', minWidth: '100px' }} onClick={handlePrev}>
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
    if (mode === 'create') {
      return (
        <Button type="primary" onClick={handleSubmit} style={{ minWidth: '100px' }}>
          <FormattedMessage id="Confirm Create" />
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
  engineType?: string;
  currentStep?: number;
  nodeList?: any;
  edgeList?: any;
  graphName: string;
}

const Steps: React.FunctionComponent<{ currentStep: number }> = () => {
  const { currentStep, mode, engineType } = useStore();
  let steps = [
    { title: <FormattedMessage id="Graph Metadata" /> },
    { title: <FormattedMessage id="Create Schema" /> },
    { title: <FormattedMessage id="Preview" /> },
    { title: <FormattedMessage id="Result" /> },
  ];
  if (mode === 'view' && engineType === 'interactive') {
    steps = [{ title: <FormattedMessage id="View Schema" /> }, { title: <FormattedMessage id="Preview" /> }];
  }
  const items = steps.map(item => ({ key: item.title, title: item.title }));
  return <AntdSteps current={currentStep} items={items} />;
};

const CreateInstance: React.FunctionComponent<ICreateGraph> = props => {
  const { store, updateStore } = useContext();
  const { currentStep, createInstaseResult, nodeList, edgeList, engineType, storeType, graphName, mode } = store;
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

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
    const schemaJSON = transOptionsToSchema(cloneDeep({ nodes: nodeList, edges: edgeList }));

    const data = {
      name: String(graphName).trim(),
      store_type: storeType,
      stored_procedures: {
        directory: 'plugins',
      },
      schema: schemaJSON,
    };
    createGraph(data)
      .then(res => {
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

  useEffect(() => {
    if (props.mode === 'view') {
      // 预览模式下，需要从props中把默认参数回填回来
      const { nodeList, edgeList, graphName } = props;
      updateStore(draft => {
        Object.keys(props).forEach(key => {
          //@ts-ignore
          draft[key] = props[key];
        });
        draft.currentStep = 1;
        draft.nodeActiveKey = nodeList[0].id;
        draft.edgeActiveKey = edgeList[0].id;
        draft.graphName = graphName;
      });
    }
    return () => {
      updateStore(draft => {
        Object.keys(initialStore).forEach(key => {
          //@ts-ignore
          draft[key] = initialStore[key];
        });
      });
    };
  }, []);
  /** 图创建失败提示框 */
  const openNotification = (result: string) => {
    api.error({
      message: 'Graph creation failed',
      description: result,
    });
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
            title: <FormattedMessage id="Create Instance" />,
          },
        ]}
      />
      <div style={{ padding: '24px 0px' }}>
        {engineType === 'interactive' && mode === 'view' && (
          <Alert
            message="您的图实例类型为 Interactive，一旦创建则不支持修改图模型，您可以选择新建图实例"
            type="info"
            showIcon
            closable
            style={{ margin: '0px 0px 16px' }}
          />
        )}
        <Steps currentStep={currentStep} />

        <div style={{ height: 'calc(100vh - 260px)', overflowY: 'scroll' }}>
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
  );
};

export default CreateInstance;
