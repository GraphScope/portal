import * as React from 'react';
import { InputNumber, Flex, Select } from 'antd';
import type { Option } from './typing';
interface IController {
  componentType: 'Select' | 'InputNumber';
  options: Option[];
  value: string | number;
  onChange(evt: any): void;
}
const Controller = (props: IController) => {
  const { options, value, onChange, componentType } = props;
  /** mappingFiles options */
  const _options = options.map((item, index: number) => {
    return {
      value: item.value,
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
          <span>{item.value}</span>
        </Flex>
      ),
    };
  });

  /**
   * index:numner
   * token ===''
   */
  /** 这里都是业务逻辑，不需要在组件内部处理 */
  // /** filelocation没值 默认不是上传*/
  // const isDefault = !filelocation ? false : isUpload;
  // /** 上传选择 or 输入数字 */
  // const isInputNumberShow = isDefault === undefined ? (typeof value === 'number' ? true : false) : !isDefault;
  if (componentType === 'InputNumber') {
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
    return <Select size="small" options={_options} value={value} onChange={onChange} style={{ width: '100%' }} />;
  }
};

export default Controller;
