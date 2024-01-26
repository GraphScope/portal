import React, { memo, useEffect } from 'react';
import { history } from 'umi';
import { Button, message, Steps, Alert, Breadcrumb, Form } from 'antd';
import { useContext } from '../create-instance/useContext';
import ChooseEnginetype from './choose-enginetype';
import CreateSchema from '../create-instance/create-schema';
import Result from './result';
import ResultFailed from './result/result-failed';
import ResultSuccess from './result/result-success';
import { FormattedMessage } from 'react-intl';
import { values } from 'lodash';
const steps = [
  { title: <FormattedMessage id="Choose Engine Type" /> },
  { title: <FormattedMessage id="Create Schema" /> },
  { title: <FormattedMessage id="Preview" /> },
  { title: <FormattedMessage id="Result" /> },
];
const CreateInstance: React.FunctionComponent = () => {
  const { store, updateStore } = useContext();
  const { isAlert, currentStep, createInstaseResult } = store;
  const [form] = Form.useForm();
  const next = () => {
    if (form.getFieldsValue().inputname) {
      updateStore(draft => {
        draft.currentStep = currentStep + 1;
      });
    } else {
      form.validateFields();
    }
  };

  const prev = () => {
    updateStore(draft => {
      draft.currentStep = currentStep - 1;
    });
  };

  const items = steps.map(item => ({ key: item.title, title: item.title }));
  const itemStyle: React.CSSProperties = {
    display: 'none',
  };
  const activeItemStyle: React.CSSProperties = {
    ...itemStyle,
    display: 'block',
  };
  useEffect(() => {
    console.log('unmount....');
    return () => {
      updateStore(draft => {
        draft.detail = false;
      });
    };
  }, []);

  return (
    <>
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
            title: (
              <a href="/instance/create">
                <FormattedMessage id="Create Instance" />
              </a>
            ),
          },
        ]}
      />
      <div style={{ padding: '16px', marginTop: '12px' }}>
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
            <div style={{ position: 'absolute', bottom: '12px', left: '24px' }}>
              {currentStep > 0 && (
                <>
                  {createInstaseResult ? null : (
                    <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                      <FormattedMessage id="Previous" />
                    </Button>
                  )}
                </>
              )}
              {currentStep < steps.length - 1 && (
                <Button type="primary" onClick={() => next()}>
                  <FormattedMessage id="Next" />
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <>
                  {currentStep == 3 ? (
                    <Button
                      type="primary"
                      onClick={() => {
                        history.push('/instance');
                      }}
                    >
                      <FormattedMessage id="Done" />
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      onClick={() => {
                        message.success('Processing complete!');
                      }}
                    >
                      <FormattedMessage id="Confirm Create" />
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default memo(CreateInstance);
