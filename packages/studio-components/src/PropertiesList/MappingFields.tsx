import * as React from 'react';
import { InputNumber, Flex, Select } from 'antd';
import type { Option } from './typing';
import { IPropertiesListProps } from './';
interface IMappingFields extends Pick<IPropertiesListProps, 'mappingColumn'> {
  value?: { index?: number; token?: string };
  onChange(evt: any): void;
}

export const getValue = (index, token) => {
  let _value = `${index}_${token}`;
  const badCase = new Set([undefined, null, '']);
  if (badCase.has(String(index)) || badCase.has(token)) {
    _value = '';
  }
  return _value;
};
const shouldShowInputNumber = (props: IMappingFields): boolean => {
  const { mappingColumn, value } = props;
  const { options, type } = mappingColumn || { options: [], type: 'query' };
  const { token } = value || {};
  return (options.length === 0 || token === '') && type !== 'upload';
};

const MappingFields = (props: IMappingFields) => {
  const { mappingColumn, value, onChange } = props;
  const { index, token } = value || {};
  const { options, type } = mappingColumn || { options: [], type: 'query' };
  /** mappingFiles options 边涉及相同value，导致不唯一 */
  const _options = options.map((item, pIdx) => {
    return {
      /** 接口返回有index则使用，上传情况用上传key ->pIdx*/
      value: `${pIdx}_${item.value}`,
      label: (
        <Flex justify="space-between" key={pIdx}>
          <span
            style={{
              marginRight: '12px',
              color: '#b8b8b8',
            }}
          >
            #{pIdx}
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
  if (shouldShowInputNumber(props)) {
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
  }

  const _value = getValue(index, token);

  return (
    <Select
      size="small"
      options={_options}
      value={_value}
      onChange={(evt: string) => {
        const [index, value] = splitValue(evt);
        onChange({ index: Number(index), token: value });
      }}
      style={{ minWidth: '140px' }}
    />
  );
};
/** value 至少含有一个下划线 */
const splitValue = (value: string) => {
  const parts = value.split('_');
  // 如果含有多个部分（即多个下划线），只保留前两个部分
  return parts.length > 1 ? [parts[0], parts.slice(1).join('_')] : parts;
};

export default MappingFields;
