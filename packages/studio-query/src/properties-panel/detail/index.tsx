import * as React from 'react';
import { Space, Tooltip, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import copy from 'copy-to-clipboard';
import Legend from '../legend';
import { Typography, Flex } from 'antd';
const { Title, Text } = Typography;
interface DetialProps {
  label: string;
  data: any;
}

const Detial: React.FunctionComponent<DetialProps> = props => {
  const { label, data } = props;
  return (
    <div>
      <Title level={5} style={{ marginTop: '12px' }}>
        Node properties
      </Title>
      {/* <Legend onChange={onChange} properties={data} label={label} /> */}

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
                <td style={{ minWidth: '120px', fontSize: '14px', padding: '4px' }}>{data[key]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(Detial);
