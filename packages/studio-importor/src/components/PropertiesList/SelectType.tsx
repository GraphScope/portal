import * as React from 'react';
import { Select } from 'antd';
interface ISelectTypeProps {
  value: string;
  typeOptions?: {
    label: string;
    value: string;
  }[];
  onChange: (value: string) => void;
}

const SelectType: React.FunctionComponent<ISelectTypeProps> = props => {
  const { onChange, typeOptions } = props;
  const [value, setValue] = React.useState(props.value);

  return (
    <Select
      size="small"
      style={{ width: '100px' }}
      value={value}
      onChange={e => {
        setValue(e);
        onChange(e);
      }}
      options={typeOptions}
    ></Select>
  );
};

export default SelectType;
