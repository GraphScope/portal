import * as React from 'react';
import { Tag, Popconfirm, Button, Space } from 'antd';

interface ILegendProps {
  type: string;
  count: string;
  label?: string;
  properties: any;
  onChange: () => object;
}

const PopconfirmCom: React.FunctionComponent<ILegendProps> = (props, { children }) => {
  const { type, label, count, properties, onChange } = props;
  // 随机生成颜色
  const getRandomColor = () => {
    return `#${((Math.random() * 0xffffff) << 0).toString(16)}`;
  };
  const tagChange = checked => {
    console.log(checked);
  };
  const color = [
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
  const size = [
    { width: '12px', color: '#A9ABAA' },
    { width: '14px', color: '#AAA9AA' },
    { width: '16px', color: '#AAAAAA' },
    { width: '18px', color: '#DDDEDE' },
    { width: '20px', color: '#DEDFDE' },
  ];

  const propertiesChange = (val, type) => {
    onChange({ type: val });
  };
  const Titlecontent = val => {
    return (
      <div style={{ width: '450px' }}>
        <Button type="primary" danger style={{ width: '100%', borderRadius: '15px' }}>
          customer
        </Button>
        <div style={{ marginTop: '12px' }}>
          <span style={{ fontSize: '16px' }}>Color: </span>
          {color.map(item => {
            return (
              <Space>
                {' '}
                <span
                  onClick={() => propertiesChange(item, 'color')}
                  style={{
                    backgroundColor: item,
                    width: '16px',
                    height: '16px',
                    display: 'inline-block',
                    borderRadius: '50%',
                  }}
                ></span>
              </Space>
            );
          })}
        </div>
        <div>
          <span style={{ fontSize: '16px' }}>Size: </span>
          {size.map(item => {
            return (
              <Space>
                {' '}
                <span
                  onClick={() => propertiesChange(item, 'size')}
                  style={{
                    backgroundColor: item?.color,
                    width: item.width,
                    height: item.width,
                    display: 'inline-block',
                    borderRadius: '50%',
                  }}
                ></span>
              </Space>
            );
          })}
        </div>
        <div>
          <span style={{ fontSize: '16px' }}>Caption: </span>
          {Object.keys(properties)?.map(item => {
            return <Tag onClick={() => propertiesChange(item, 'caption')}>{item}</Tag>;
          })}
        </div>
      </div>
    );
  };
  return (
    <Popconfirm
      placement="left"
      icon={null}
      description={Titlecontent()}
      onOpenChange={() => console.log('open change')}
      showCancel={false}
      okText=" "
    >
      {children}
    </Popconfirm>
  );
};

export default PopconfirmCom;
