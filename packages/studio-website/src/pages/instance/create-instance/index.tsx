import React, { memo, useEffect } from 'react';
import { history } from 'umi';
import { Button, message, Steps, theme, Alert, Breadcrumb } from 'antd';
import { useContext } from '../create-instance/useContext';
import ChooseEnginetype from './choose-enginetype';
import CreateSchema from '../create-instance/create-schema';
import Result from './result';
// const steps = [{ title: 'Choose EngineType' }, { title: 'Create Schema' }, { title: 'Result' }];
const steps = [{ title: '选择引擎' }, { title: '创建模型' }, { title: '创建结果' }];
const Lists: React.FunctionComponent = () => {
  const { store, updateStore } = useContext();
  const { isAlert, currentStep } = store;
  const next = () => {
    updateStore(async draft => {
      draft.currentStep = currentStep + 1;
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
            title: <a href="/instance">图实例</a>,
          },
          {
            title: <a href="/instance/create">创建图实例</a>,
          },
        ]}
      />
      <div style={{ backgroundColor: '#fff', padding: '16px', marginTop: '12px' }}>
        <Steps current={currentStep} items={items} />
        <div>
          <div style={currentStep === 0 ? activeItemStyle : itemStyle}>
            <ChooseEnginetype />
          </div>
          <div style={currentStep === 1 ? activeItemStyle : itemStyle}>
            <CreateSchema />
          </div>
          <div style={currentStep === 2 ? activeItemStyle : itemStyle}>
            <Result />
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
            <div style={{ marginTop: 24 }}>
              {currentStep > 0 && (
                <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                  上一步
                </Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button type="primary" onClick={() => next()}>
                  下一步
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button
                  type="primary"
                  onClick={() => {
                    message.success('Processing complete!').then(()=>history.push('/instance')) ;
                  }}
                >
                  确认创建
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default memo(Lists);
