import * as React from 'react';
import { memo } from 'react';
import { Tag, Popover, Button, Space } from 'antd';
import { useImmer } from '../use-immer';
interface ILegendProps {
  type?: string;
  count?: string;
  label: string;
  cutomer?: string;
  color?: string;
  properties?: any;
  onChange: (val: { label: string; color: string; size: string; caption: string }) => void;
}
const styles: { [x: string]: React.CSSProperties } = {
  'tag-style': {
    backgroundColor: '#9397A0',
    color: '#fff',
    border: '1px solid #9397A0',
    cursor: 'pointer',
  },
  'tag-active': {
    backgroundColor: '#fff',
    color: '#9395A0',
    border: '1px solid #9395A0',
    cursor: 'pointer',
  },
};
const { useRef } = React;
const Legend: React.FunctionComponent<ILegendProps> = props => {
  const { type, label, count, properties, onChange, cutomer, color } = props;
  const { state, updateState } = useImmer();
  const { caption } = state;
  const colorRef = useRef('');
  const sizeRef = useRef('');
  const captionRef = useRef('');
  const tagChange = checked => {
    console.log(checked);
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
  const size: { width: string; color: string }[] = [
    { width: '12px', color: '#A9ABAA' },
    { width: '14px', color: '#AAA9AA' },
    { width: '16px', color: '#AAAAAA' },
    { width: '18px', color: '#DDDEDE' },
    { width: '20px', color: '#DEDFDE' },
  ];
  /**属性事件 */
  const propertiesChange = (val, type) => {
    if (type == 'color') {
      colorRef.current = val;
    } else if (type == 'size') {
      sizeRef.current = val?.width;
    } else {
      captionRef.current = val;
      updateState(draf => {
        draf.caption = val;
      });
    }
    onChange({ label, color: colorRef.current, size: sizeRef.current, caption: captionRef.current });
  };
  /**EditProperty 节点/边 （color,size,caption）编辑*/
  const EditProperty = () => {
    return (
      <div style={{ width: '350px', padding: '12px' }}>
        <Button type="primary" danger style={{ width: '100%', borderRadius: '15px' }}>
          customer
        </Button>
        <div style={{ marginTop: '12px' }}>
          <span style={{ fontSize: '16px' }}>Color: </span>
          {colors.map(item => {
            return (
              <Space key={item}>
                <span
                  onClick={() => propertiesChange(item, 'color')}
                  style={{
                    backgroundColor: item,
                    width: '16px',
                    height: '16px',
                    display: 'inline-block',
                    borderRadius: '50%',
                    cursor: 'pointer',
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
              <Space key={item.width}>
                <span
                  onClick={() => propertiesChange(item, 'size')}
                  style={{
                    backgroundColor: item?.color,
                    width: item.width,
                    height: item.width,
                    display: 'inline-block',
                    borderRadius: '50%',
                    cursor: 'pointer',
                  }}
                ></span>
              </Space>
            );
          })}
        </div>
        <div>
          <span style={{ fontSize: '16px' }}>Caption: </span>
          {Object.keys(properties)?.map(item => {
            return (
              <Tag
                key={item}
                style={caption == item ? styles['tag-style'] : styles['tag-active']}
                onClick={() => propertiesChange(item, 'caption')}
              >
                {item}
              </Tag>
            );
          })}
        </div>
      </div>
    );
  };
  return (
    <Popover placement="left" content={EditProperty()}>
      {cutomer ? (
        <Button type="primary" danger style={{ borderRadius: '16px', marginBottom: '10px', cursor: 'pointer' }}>
          cutomer
        </Button>
      ) : (
        <Tag
          style={{ borderRadius: type == 'NODE' ? '10px' : '', backgroundColor: color, cursor: 'pointer' }}
          bordered={false}
          onClick={() => tagChange(props)}
        >{`${label} (${count})`}</Tag>
      )}
    </Popover>
  );
};

export default memo(Legend);
