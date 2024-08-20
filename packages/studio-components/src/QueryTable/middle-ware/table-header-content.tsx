import React from 'react';
import { Flex, Select, Checkbox } from 'antd';
import type { IBarProps } from './index';

const styles: Record<string, React.CSSProperties> = {
  flexContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  select: {
    width: '50%',
  },
  text: {
    color: '#5A6C84',
    fontSize: '12px',
    fontWeight: 400,
  },
  divider: {
    borderTop: '1px solid #F7F7F7',
  },
};

const selectTypeOptions = [
  { value: '类别类型', label: '类别类型' },
  { value: '有序类型', label: '有序类型' },
  { value: '数值类型', label: '数值类型' },
  { value: '时间类型', label: '时间类型' },
];

const selectScaleOptions = [
  { value: '维度', label: '维度' },
  { value: '度量', label: '度量' },
];

interface IHeaderContentProps {
  isShow: boolean;
  isChecked: boolean;
  type: 'dimension' | 'measure';
  data: any[];
  handleCheckboxChange: (val: boolean) => void;
  handleSelectScaleChange: (val: string) => void;
  handleSelectTypeChange: (val: string) => void;
}
const HeaderContent: React.FC<IHeaderContentProps> = props => {
  const { isShow, isChecked, type, data, handleSelectTypeChange, handleSelectScaleChange, handleCheckboxChange } =
    props;
  if (isShow) {
    return (
      <Flex style={styles.flexContainer} vertical gap={6}>
        <Flex gap={6}>
          <Select
            defaultValue={type === 'dimension' ? '类别类型' : '数值类型'}
            size="small"
            style={styles.select}
            options={selectTypeOptions}
            onChange={handleSelectTypeChange}
          />
          <Select
            defaultValue={type === 'dimension' ? '维度' : '度量'}
            size="small"
            style={styles.select}
            options={selectScaleOptions}
            onChange={handleSelectScaleChange}
          />
        </Flex>
        <div style={styles.text}>
          允许使用 <Checkbox onChange={evt => handleCheckboxChange(evt.target.checked)} checked={isChecked} />
        </div>
      </Flex>
    );
  }

  return (
    <>
      {data.map(({ name, count }) => (
        <div key={name} style={{ ...styles.text, ...styles.divider }}>
          <Flex justify="space-between">
            <span>{name}</span>
            <span>{count}</span>
          </Flex>
        </div>
      ))}
    </>
  );
};

export default HeaderContent;
