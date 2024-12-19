import * as React from 'react';
import { Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import { PlayCircleOutlined } from '@ant-design/icons';
import Image from './image';
import { useStudioProvier } from '@graphscope/studio-components';

interface IEmptyProps {}

const Empty: React.FunctionComponent<IEmptyProps> = props => {
  const { isLight } = useStudioProvier();
  return (
    <div
      style={{
        fontSize: '14px',
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image isDark={!isLight} />
      <Typography.Text
        type="secondary"
        style={{
          position: 'absolute',
        }}
      >
        <FormattedMessage
          id="You can write cypher or gremlin queries, and then click the {icon} button to query data"
          values={{
            icon: <PlayCircleOutlined />,
          }}
        />
      </Typography.Text>
    </div>
  );
};

export default Empty;
