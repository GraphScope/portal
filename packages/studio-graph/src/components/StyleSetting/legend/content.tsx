import * as React from 'react';
import { Flex, Typography, Space, Tag, theme, Radio } from 'antd';
import { FormattedMessage } from 'react-intl';
import { sizes, widths, colors } from '../../../graph/const';
const { useToken } = theme;
export interface ILegnedOption {
  /** 属性 */
  properties: Record<string, any>;
  /** 类型 */
  label: string;
  /** 数量统计 */
  count?: number;
  /** 颜色 */
  color: string;
  /** 大小 */
  size: number;
  /** 文本映射字段 */
  caption: string;
  /** 是否隐藏文字 */
  captionStatus?: 'hidden' | 'display';
  /** 标识是节点还是边 */
  type: 'node' | 'edge';
}

export type ILengendContentProps = ILegnedOption & {
  type: 'node' | 'edge';
  onChange: (val: ILegnedOption) => void;
};

const styles = {
  color: {
    width: '16px',
    height: '16px',
    display: 'block',
    borderRadius: '50%',
    cursor: 'pointer',
  },
};

const LengendContent: React.FunctionComponent<ILengendContentProps> = props => {
  const { color, size, caption, properties, label, onChange, type, captionStatus } = props;
  const { token } = useToken();
  let _properties = properties;

  if (Array.isArray(properties)) {
    _properties = properties.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.name]: curr[type],
      };
    }, {});
  }
  console.log('captionStatus', captionStatus);

  const handleChange = (key, value) => {
    onChange &&
      onChange({
        type,
        label,
        color,
        size,
        caption,
        properties,
        [key]: value,
      });
  };
  const activeStyle = `2px solid ${token.colorPrimary}`;
  return (
    <div style={{ maxWidth: '220px', overflow: 'hidden', padding: '12px' }}>
      <Flex gap={12} style={{ padding: '6px 0px' }}>
        <Typography.Text style={{ flexShrink: 0 }}>
          <FormattedMessage id="Color" />
        </Typography.Text>
        <Space wrap>
          {colors.map(item => {
            const isActive = color == item;
            return (
              <span
                key={item}
                onClick={() => handleChange('color', item)}
                style={{
                  ...styles.color,
                  backgroundColor: item,
                  boxSizing: 'border-box',
                  border: isActive ? activeStyle : 'none',
                }}
              ></span>
            );
          })}
        </Space>
      </Flex>
      {type === 'node' && (
        <Flex gap={12} style={{ padding: '6px 0px' }}>
          <Typography.Text style={{ flexShrink: 0 }}>
            <FormattedMessage id="Size" />
          </Typography.Text>
          <Space size={8} wrap>
            {sizes.map(item => {
              const isActive = size == item;
              const nodeRelSize = 4;
              const padAmount = 2;

              const R = Math.sqrt(Math.max(0, item)) * nodeRelSize + padAmount;

              return (
                <span
                  key={item}
                  onClick={() => handleChange('size', item)}
                  style={{
                    ...styles.color,
                    width: `${2 * R}px`,
                    height: `${2 * R}px`,
                    background: '#ddd',
                    boxSizing: 'border-box',
                    border: isActive ? activeStyle : 'none',
                  }}
                ></span>
              );
            })}
          </Space>
        </Flex>
      )}
      {type === 'edge' && (
        <Flex gap={12} style={{ padding: '6px 0px' }}>
          <Typography.Text style={{ flexShrink: 0 }}>
            <FormattedMessage id="LineWidth" />
          </Typography.Text>
          <Space wrap>
            {widths.map(item => {
              const isActive = size == item;
              return (
                <span
                  key={item}
                  onClick={() => handleChange('size', item)}
                  style={{
                    cursor: 'pointer',
                    width: `${item * 5}px`,
                    height: `16px`,
                    background: '#ddd',
                    display: 'block',
                    boxSizing: 'border-box',
                    border: isActive ? activeStyle : 'none',
                  }}
                ></span>
              );
            })}
          </Space>
        </Flex>
      )}
      <Flex gap={12} style={{ padding: '6px 0px' }}>
        <Typography.Text style={{ flexShrink: 0 }}>
          <FormattedMessage id="Caption" />
        </Typography.Text>
        <Space wrap>
          {Object.keys(_properties)?.map(item => {
            const isActive = caption == item;
            return (
              <span
                key={item}
                style={{
                  fontSize: '12px',
                  color: token.colorTextSecondary,
                  display: 'block',
                  borderRadius: '6px',
                  padding: '0px 4px',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  background: token.colorBgBlur,
                  border: isActive ? activeStyle : '1px solid #ddd',
                }}
                onClick={() => handleChange('caption', item)}
              >
                {item}
              </span>
            );
          })}
        </Space>
      </Flex>
      <Flex gap={12} style={{ padding: '6px 0px' }}>
        <Typography.Text style={{ flexShrink: 0 }}>
          <FormattedMessage id="Hidden Caption" />
        </Typography.Text>
        <Space wrap>
          <Radio.Group
            value={captionStatus}
            onChange={e => {
              handleChange('captionStatus', e.target.value);
            }}
          >
            <Radio value="hidden">hidden</Radio>
            <Radio value="display">display</Radio>
          </Radio.Group>
        </Space>
      </Flex>
    </div>
  );
};

export default LengendContent;
