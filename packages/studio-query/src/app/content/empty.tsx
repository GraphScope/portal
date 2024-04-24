import * as React from 'react';
import { Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import { PlayCircleOutlined } from '@ant-design/icons';
import Image from './image';
interface IEmptyProps {}

const Empty: React.FunctionComponent<IEmptyProps> = props => {
  const isDark = JSON.parse(localStorage.getItem('GS_STUDIO_themeColor') || '') === 'darkAlgorithm';
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
      <Image isDark={isDark} />
      <Typography.Text
        type="secondary"
        style={{ position: 'absolute', top: '50%', left: '35%', color: isDark ? '#D4D4D4' : '#838487' }}
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
