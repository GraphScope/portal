import * as React from 'react';
import { Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import { PlayCircleOutlined } from '@ant-design/icons';
import Image from './image';
import { isDarkTheme } from '../Utils';
interface IEmptyProps {}

const Empty: React.FunctionComponent<IEmptyProps> = props => {
  const isDark = isDarkTheme();

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
        style={{
          position: 'absolute',
        }}
      >
        <FormattedMessage
          id=" Start sketching a model In GraphScope, a vertex label is a named grouping or categorization of nodes within the
          graph dataset"
          values={{
            icon: <PlayCircleOutlined />,
          }}
        />
      </Typography.Text>
    </div>
  );
};

export default Empty;
