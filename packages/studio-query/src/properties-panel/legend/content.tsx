import * as React from 'react';
import { Flex, Typography, Space, Tag, theme } from 'antd';
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
}

export type ILengendContentProps = ILegnedOption & {
  type: 'node' | 'edge';
  onChange: (val: ILegnedOption) => void;
};

const colors: string[] = [
  '#C2B8A2',
  '#EAD4E5',
  '#FCD8C2',
  '#C3E8F5',
  '#F16768',
  '#F0E9DF',
  '#D5EBD6',
  '#F8E1E9',
  '#B8D4F1',
  '#FFE7BD',
  '#F1C7D6',
  '#BBD5CD',
];
const sizes: number[] = Array.from({
  length: 10,
}).map((_item, index) => {
  return (index + 3) * 6;
});
const widths: number[] = Array.from({
  length: 10,
}).map((_item, index) => {
  return (index + 1) * 0.5;
});

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
  const { color, size, caption, properties, label, onChange, type } = props;
  const { token } = useToken();
  console.log('type', type);
  const handleChange = (type, item) => {
    console.log(type, item, label);
    onChange &&
      onChange({
        label,
        color,
        size,
        caption,
        properties,
        [type]: item,
      });
  };
  const activeStyle = `2px solid ${token.colorPrimary}`;
  return (
    <div>
      <Flex gap={12} style={{ padding: '6px 0px' }}>
        <Typography.Text>Color</Typography.Text>
        <Space>
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
          <Typography.Text>Size</Typography.Text>
          <Space size={8}>
            {sizes.map(item => {
              const isActive = size == item;
              return (
                <span
                  key={item}
                  onClick={() => handleChange('size', item)}
                  style={{
                    ...styles.color,
                    width: `${item / 3}px`,
                    height: `${item / 3}px`,
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
          <Typography.Text>LineWidth</Typography.Text>
          <Space>
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
        <Typography.Text>Caption</Typography.Text>
        <Space>
          {Object.keys(properties)?.map(item => {
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
    </div>
  );
};

export default LengendContent;
