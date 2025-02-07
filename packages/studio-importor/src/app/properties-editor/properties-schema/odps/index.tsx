import React, { forwardRef, useState, useRef } from 'react';
import { Typography, Flex, Input } from 'antd';

import type { IPropertiesSchemaProps } from '../index';
import { useIntl } from 'react-intl';
import { useChange } from './useChange';

export type ILocationFieldProps = Pick<IPropertiesSchemaProps, 'type' | 'schema' | 'handleUploadFile'>;
export const uploadRefs = {};
const { Text } = Typography;

const LocationField = forwardRef((props: ILocationFieldProps, ref) => {
  const { schema, type } = props;
  const InputRef = useRef(null);
  const {
    id,
    data: { filelocation, isBind },
  } = schema;
  const intl = useIntl();

  const { handleChangeInput } = useChange({ id, type });

  return (
    <Flex vertical gap={8}>
      <Text>Location</Text>
      <Flex align="center" justify="flex-end" gap={6}>
        {isBind ? (
          <Input style={{ width: '100%' }} disabled value={filelocation} />
        ) : (
          <Input
            ref={InputRef}
            style={{ width: '100%' }}
            defaultValue={filelocation}
            placeholder={intl.formatMessage({ id: 'Please manually input the odps file location' })}
            onBlur={handleChangeInput}
          />
        )}
      </Flex>
    </Flex>
  );
});

export default LocationField;
