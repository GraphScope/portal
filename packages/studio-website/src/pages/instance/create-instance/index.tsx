import React, { memo, useEffect } from 'react';
import { history } from 'umi';
import { Button, notification, Steps, Alert, Breadcrumb, Form } from 'antd';
import { useContext } from '../create-instance/useContext';
import ChooseEnginetype from './choose-enginetype';
import CreateSchema from '../create-instance/create-schema';
import Result from './result';
import ResultFailed from './result/result-failed';
import ResultSuccess from './result/result-success';
import { FormattedMessage } from 'react-intl';
import { createGraph } from './service';
import { transOptionsToSchema } from './create-schema/utils';
import { cloneDeep } from 'lodash';
import { initialStore } from './useContext';
const steps = [
  { title: <FormattedMessage id="Choose Engine Type" /> },
  { title: <FormattedMessage id="Create Schema" /> },
  { title: <FormattedMessage id="Preview" /> },
  { title: <FormattedMessage id="Result" /> },
];
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
      <Button style={{ margin: '0 8px' }} onClick={handlePrev}>
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
const RightButton = (props: { currentStep: any; handleNext: any; handleSubmit: any }) => {
  const { currentStep, handleNext, handleSubmit } = props;
  if (currentStep === 0 || currentStep === 1) {
    return (
      <Button type="primary" onClick={handleNext}>
        <FormattedMessage id="Next" />
      </Button>
    );
  }
  if (currentStep === 2) {
    return (
      <Button type="primary" onClick={handleSubmit}>
        <FormattedMessage id="Confirm Create" />
      </Button>
    );
  }
  if (currentStep === 3) {
    return (
      <Button
        type="primary"
        onClick={() => {
          history.push('/instance');
        }}
      >
        <FormattedMessage id="Done" />
      </Button>
    );
  }
};

const CreateInstance: React.FunctionComponent = () => {
  const { store, updateStore } = useContext();
  const { isAlert, currentStep, createInstaseResult, nodeList, edgeList, engineInput, engineType, engineDirected } =
    store;
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const next = () => {
    if (form.getFieldsValue().inputname) {
      updateStore(draft => {
        draft.currentStep = currentStep + 1;
      });
    } else {
      form.validateFields();
    }
  };
  // createGraph
  const handleSubmit = () => {
    console.log(nodeList, edgeList, engineInput, engineType, engineDirected);
    //@ts-ignore
    const schemaJSON = transOptionsToSchema(cloneDeep({ nodes: nodeList, edges: edgeList }));
    console.log('schemaJSON', schemaJSON);
    const data = {
      name: String(engineInput).trim(),
      store_type: engineType,
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

  const items = steps.map(item => ({ key: item.title, title: item.title }));
  const itemStyle: React.CSSProperties = {
    display: 'none',
    padding: '12px 0px',
  };
  const activeItemStyle: React.CSSProperties = {
    ...itemStyle,
    display: 'block',
  };

  useEffect(() => {
    console.log('unmount....');
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
        <Steps current={currentStep} items={items} />
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
          {isAlert ? (
            <Alert
              message="您的图实例类型为 Interactive，一旦创建则不支持修改图模型，您可以选择新建图实例"
              type="info"
              showIcon
              closable
              style={{ margin: '16px 0' }}
            />
          ) : (
            <div style={{}}>
              <LeftButton currentStep={currentStep} handlePrev={prev} createInstaseResult={createInstaseResult} />
              <RightButton currentStep={currentStep} handleNext={next} handleSubmit={handleSubmit} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(CreateInstance);
