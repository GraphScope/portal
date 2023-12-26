import * as React from 'react';
import { Tooltip, Button, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import copy from 'copy-to-clipboard';
import Legend from '../legend';
interface DetialProps {
  label: string;
  data: any;
  onChange?: () => any;
}

const Detial: React.FunctionComponent<DetialProps> = props => {
  const { label, data, onChange } = props;
  return (
    <div>
      <h3 style={{ marginBottom: '10px' }}>
        Node properties{' '}
        <CopyOutlined
          onClick={e => {
            e.stopPropagation();
            copy(data);
            message.success('复制成功');
          }}
          type="icon-fuzhi1"
          style={{ marginRight: '8px', fontSize: '16px' }}
        />
      </h3>
      <Legend cutomer="cutomer" onChange={onChange} properties={data} label={label}/>
      <table>
        <tbody>
          {Object.entries(data).map(([key, value], i) => {
            return (
              <tr style={{ backgroundColor: i % 2 == 0 ? '' : '#F7F6F6' }}>
                <td style={{ minWidth: '120px' }}>{key}</td>
                <td style={{ minWidth: '120px' }}>{value}</td>
                <td>
                  {' '}
                  <Tooltip title="复制">
                    <CopyOutlined
                      onClick={e => {
                        e.stopPropagation();
                        copy(value);
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

export default Detial;
