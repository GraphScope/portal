import * as React from 'react';
import { Flex, Typography, Space, Tag } from 'antd';

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
const sizes: number[] = [10, 20, 30, 40, 50, 60];

const widths: number[] = [1, 2, 3, 4, 5, 6];

const styles = {
  color: {
    width: '16px',
    height: '16px',
    display: 'inline-block',
    borderRadius: '50%',
    cursor: 'pointer',
  },
};
const LengendContent: React.FunctionComponent<ILengendContentProps> = props => {
  const { color, size, caption, properties, label, onChange } = props;
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
  return (
    <div>
      <Flex>
        <Typography.Text>Color</Typography.Text>
        <Space>
          {colors.map(item => {
            return (
              <span
                key={item}
                onClick={() => handleChange('color', item)}
                style={{
                  ...styles.color,
                  backgroundColor: item,
                }}
              ></span>
            );
          })}
        </Space>
      </Flex>
      <Flex>
        <Typography.Text>Size</Typography.Text>
        <Space>
          {sizes.map(item => {
            return (
              <span
                key={item}
                onClick={() => handleChange('size', item)}
                style={{
                  ...styles.color,
                  background: '#ddd',
                }}
              ></span>
            );
          })}
        </Space>
      </Flex>
      <Flex>
        <Typography.Text>Caption</Typography.Text>
        <Space>
          {Object.keys(properties)?.map(item => {
            return (
              <Tag
                key={item}
                style={caption == item ? styles['tag-style'] : styles['tag-active']}
                onClick={() => handleChange('caption', item)}
              >
                {item}
              </Tag>
            );
          })}
        </Space>
      </Flex>
    </div>
  );
};

export default LengendContent;
