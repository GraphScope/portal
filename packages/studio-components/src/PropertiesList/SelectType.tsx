import React, { useState } from 'react';
import { Select } from 'antd';
interface ISelectTypeProps {
  value: string;
  disabled?: boolean;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}
const SelectType: React.FunctionComponent<ISelectTypeProps> = props => {
  const { value, onChange, options, disabled } = props;
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = (newValue: string) => {
    setSelectedValue(newValue);
    onChange(newValue);
  };
  return (
    <Select
      size="small"
      style={{ minWidth: '160px' }}
      value={selectedValue}
      disabled={disabled}
      onChange={handleChange}
      options={options}
    />
  );
};

export default SelectType;
