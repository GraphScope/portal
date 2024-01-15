import React, { memo, useEffect } from 'react';
import { Button, message, Steps, theme, Alert, Breadcrumb } from 'antd';
import { useContext } from '../create-instance/useContext';
import ChooseEnginetype from './choose-enginetype';
import CreateSchema from '../create-instance/create-schema';
import ConfigInfo from './confirm-info';
const steps = [{ title: 'Choose EngineType' }, { title: 'Create Schema' }, { title: 'Result' }];
const Lists: React.FunctionComponent = () => {
  const { store, updateStore } = useContext();
  const { isAlert, currentStep } = store;
  const next = () => {
    updateStore(draft => {
      draft.currentStep = currentStep + 1;
    });
    console.log(store.nodeList, store.nodeItems);
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
            <ConfigInfo />
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
                <Button type="primary" onClick={() => message.success('Processing complete!')}>
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
