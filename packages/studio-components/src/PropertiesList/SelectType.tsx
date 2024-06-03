import * as React from 'react';
import { Select } from 'antd';
interface ISelectTypeProps {
  value: string;
  disabled?: boolean;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}
const SelectType: React.FunctionComponent<ISelectTypeProps> = props => {
  const { onChange, options, disabled } = props;
  const [value, setValue] = React.useState(props.value);

  return (
    <Select
      size="small"
      style={{ width: '100%' }}
      value={value}
      disabled={disabled}
      onChange={e => {
        setValue(e);
        onChange(e);
      }}
      options={options}
    ></Select>
  );
};

export default SelectType;
