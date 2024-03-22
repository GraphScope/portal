import * as React from 'react';
import { Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import { PlayCircleOutlined } from '@ant-design/icons';
interface IEmptyProps {}

const Empty: React.FunctionComponent<IEmptyProps> = props => {
  return (
    <div
      style={{
        fontSize: '14px',
        backgroundImage:
          'url(https://img.alicdn.com/imgextra/i3/O1CN01ioBjPd24ALzvMY66U_!!6000000007350-55-tps-915-866.svg)',
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <Typography.Text type="secondary">
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
