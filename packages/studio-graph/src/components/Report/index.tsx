import * as React from 'react';
import { Tooltip, Button, Collapse, CollapseProps } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { useContext } from './../../hooks/useContext';
import { TypingText } from '@graphscope/studio-components';
interface IReportProps {}

const Report: React.FunctionComponent<IReportProps> = props => {
  const handleClick = () => {};
  const { store } = useContext();
  const { data } = store;
  const items: CollapseProps['items'] = [
    {
      key: 'Analysis Data',
      label: 'Analysis Data',
      children: (
        <p>
          <code>{JSON.stringify(data, null, 2)}</code>
        </p>
      ),
    },

    {
      key: 'LLM Report',
      label: 'LLM Report',
      children: <p>{<></>}</p>,
    },
  ];

  return (
    <div>
      <Collapse items={items} defaultActiveKey={['1']} />
    </div>
  );
};

export default Report;
