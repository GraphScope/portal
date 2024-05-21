import * as React from 'react';
import { Select } from 'antd';
interface ISelectTypeProps {
  value: string;
  onChange: (value: string) => void;
}
const options = [
  {
    value: 'INT',
    label: 'INT',
  },
  {
    value: 'NUMBER',
    label: 'NUMBER',
  },
];

const SelectType: React.FunctionComponent<ISelectTypeProps> = props => {
  const { onChange } = props;
  const [value, setValue] = React.useState(props.value);

  return (
    <Select
      style={{ width: '100px' }}
      value={value}
      onChange={e => {
        setValue(e);
        onChange(e);
      }}
      options={options}
    ></Select>
  );
};

export default SelectType;
