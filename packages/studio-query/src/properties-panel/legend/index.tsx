import * as React from 'react';
import { Tag, Popconfirm, Button, Space, message } from 'antd';
import { useImmer } from 'use-immer';
interface ILegendProps {
  type?: string;
  count?: string;
  label?: string;
  cutomer?: string;
  properties?: any;
  onChange?: () => any;
}

const Legend: React.FunctionComponent<ILegendProps> = (props, { children }) => {
  const { type, label, count, properties, onChange, cutomer } = props;
  const [state, updateState] = useImmer<{
    color: string;
    size: string;
    caption: string;
  }>({
    color: '#C2B8A2',
    size: '12px',
    caption: '',
  });
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
    if (type == 'color') {
      updateState(draf => {
        draf.color = val;
      });
      message.success(`Color selection is successful`);
    } else if (type == 'size') {
      updateState(draf => {
        draf.size = val?.width;
      });
      message.success(`Size selection is successful`);
    } else {
      updateState(draf => {
        draf.caption = val;
      });
      message.success(`Caption selection is successful`);
    }
  };
  const Titlecontent = () => {
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
          {cutomer !== 'cutomer'
            ? Object.keys(properties)?.map(item => {
                return <Tag onClick={() => propertiesChange(item, 'caption')}>{item}</Tag>;
              })
            : null}
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
      okText="OK"
      onConfirm={()=> onChange({ color: state.color, size: state.size, caption: state.caption })
    }
    >
      {cutomer ? (
        <Button type="primary" danger style={{ borderRadius: '16px' ,marginBottom:10}}>
          cutomer
        </Button>
      ) : (
        <Tag
          style={{ borderRadius: type == 'NODE' ? '10px' : '' }}
          color={getRandomColor()}
          bordered={false}
          onClick={() => tagChange(props)}
        >{`${label} (${count})`}</Tag>
      )}
    </Popconfirm>
  );
};

export default Legend;
