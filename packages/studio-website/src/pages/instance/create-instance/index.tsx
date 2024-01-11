import React, { useState ,memo} from 'react';
import { Button, message, Steps, theme, Alert, Breadcrumb } from 'antd';
import { useContext } from '../create-instance/valtio/createGraph';
import ChooseEnginetype from '../create-instance/choose-enginetype';
import CreateSchema from '../create-instance/create-schema';
import ConfigInfo from '../create-instance/confirm-info';

const Lists: React.FunctionComponent = () => {
  const { store } = useContext();
  const { isAlert } = store;
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const steps = [
    {
      title: 'Choose EngineType',
      content: <ChooseEnginetype />,
    },
    {
      title: 'Create Schema',
      content: <CreateSchema />,
    },
    {
      title: 'Result',
      content: <ConfigInfo />,
    },
  ];
  const next = () => {
    setCurrent(current + 1);
    console.log(store.nodeList, store.nodeItems);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map(item => ({ key: item.title, title: item.title }));

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
      <Steps current={current} items={items} />
      <div>{steps[current].content}</div>
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
          {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              上一步
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              下一步
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={() => message.success('Processing complete!')}>
              确认创建
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default memo(Lists);
