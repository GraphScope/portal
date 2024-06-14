import * as React from 'react';
import { InputNumber, Flex, Select } from 'antd';
import type { Option } from './typing';
interface IController {
  componentType: 'Select' | 'InputNumber';
  options: Option[];
  value: { index: number; token: string };
  onChange(evt: any): void;
}
const Controller = (props: IController) => {
  const { options, value, onChange, componentType } = props;
  const { index, token } = value;
  /** mappingFiles options 边涉及相同value，导致不唯一 */
  const _options = options.map((item, Pindex) => {
    return {
      /** 接口返回有index则使用，上传情况用上传key ->Pindex*/
      value: `${Pindex}_${item.value}`,
      label: (
        <Flex justify="space-between" key={Pindex}>
          <span
            style={{
              marginRight: '12px',
              color: '#b8b8b8',
            }}
          >
            #{Pindex}
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

  if (!token) {
    return (
      <InputNumber
        style={{ minWidth: '140px' }}
        size="small"
        value={index}
        min={0}
        onChange={evt => {
          onChange({ index: evt, token: '' });
        }}
      />
    );
  } else {
    return (
      <Select
        size="small"
        options={_options}
        value={token as string}
        onChange={(evt: string) => {
          const [index, value] = evt.split('_');
          onChange({ index: Number(index), token: value });
        }}
        style={{ minWidth: '140px' }}
      />
    );
  }
};

export default Controller;
