import * as React from 'react';
import { InputNumber, Flex, Select } from 'antd';
interface IMappingFields {
  dataFields?: any;
  value: string | number;
  onChange(evt: any): void;
  filelocation?: string;
  isUpload?: boolean;
}
const MappingFields = (props: IMappingFields) => {
  const { dataFields, value, onChange, filelocation, isUpload = false } = props;
  /** mappingFiles options */
  const options = dataFields.map((item: string, index: number) => {
    return {
      value: `${index}_${item}`,
      label: (
        <Flex justify="space-between" key={index}>
          <span
            style={{
              marginRight: '12px',
              color: '#b8b8b8',
            }}
          >
            #{index}
          </span>
          <span>{item}</span>
        </Flex>
      ),
    };
  });
  /** filelocation没值 默认不是上传*/
  const isDefault = !filelocation ? false : isUpload;
  /** 上传选择 or 输入数字 */
  const isInputNumberShow = isDefault === undefined ? (typeof value === 'number' ? true : false) : !isDefault;
  if (isInputNumberShow) {
    return (
      <InputNumber
        size="small"
        value={value}
        min={0}
        onChange={evt => {
          onChange(evt);
        }}
      />
    );
  } else {
    return <Select size="small" options={options} value={value} onChange={onChange} style={{ width: '100%' }} />;
  }
};

export default MappingFields;
