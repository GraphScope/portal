import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Typography } from 'antd';
const { Title } = Typography;
interface DetialProps {
  label: string;
  data: any;
}

const Detial: React.FunctionComponent<DetialProps> = props => {
  const { data } = props;
  return (
    <div>
      <Title level={5} style={{ margin: '6px 0px 12px 0px' }}>
        <FormattedMessage id="Node properties" />
      </Title>

      <table
        style={{
          borderSpacing: '0px',
        }}
      >
        <tbody>
          {Object.keys(data).map((key, i) => {
            return (
              <tr style={{ backgroundColor: i % 2 == 1 ? '' : '#F7F6F6' }} key={key}>
                <td style={{ minWidth: '80px', margin: '0px', padding: '4px' }}>{key}</td>
                <td style={{ display: 'flex', flexWrap: 'wrap', minWidth: '120px', fontSize: '14px', padding: '4px' }}>
                  {data[key]}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(Detial);
