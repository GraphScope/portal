import * as React from 'react';
import { InputNumber, Flex, Select } from 'antd';

export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

interface IController {
  componentType: 'Select' | 'InputNumber';
  options: Option[];
  value: string | number;
  onChange(evt: any): void;
}
const Controller = (props: IController) => {
  const { options, value, onChange, componentType } = props;
  /** mappingFiles options 边涉及相同value，导致不唯一 */
  const _options = options.map((item, index: number) => {
    return {
      value: `${index}_${item.value}`,
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
        style={{ width: '100%', marginTop: '8px' }}
        value={value}
        min={0}
        onChange={evt => {
          onChange(evt);
        }}
      />
    );
  } else {
    return <Select style={{ width: '100%', marginTop: '8px' }} options={_options} value={value} onChange={onChange} />;
  }
};

export default Controller;
