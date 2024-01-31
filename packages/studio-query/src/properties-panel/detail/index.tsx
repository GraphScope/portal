import * as React from 'react';
import { Tooltip, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import copy from 'copy-to-clipboard';
import Legend from '../legend';
import { Typography } from 'antd';
const { Title } = Typography;
interface DetialProps {
  label: string;
  data: any;
}

const Detial: React.FunctionComponent<DetialProps> = props => {
  const { label, data } = props;
  return (
    <div>
      <Title level={5} style={{ marginTop: '12px' }} copyable>
        Node properties
      </Title>
      {/* <Legend onChange={onChange} properties={data} label={label} /> */}
      <table>
        <tbody>
          {Object.keys(data).map((key, i) => {
            return (
              <tr style={{ backgroundColor: i % 2 == 0 ? '' : '#F7F6F6' }} key={key}>
                <td style={{ minWidth: '120px' }}>{key}</td>
                <td style={{ minWidth: '120px' }}>{data[key]}</td>
                <td>
                  <Tooltip title="复制">
                    <CopyOutlined
                      onClick={e => {
                        e.stopPropagation();
                        copy(data[key]);
                        message.success('复制成功');
                      }}
                      type="icon-fuzhi1"
                      style={{ marginRight: '8px', fontSize: '16px' }}
                    />
                  </Tooltip>
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
