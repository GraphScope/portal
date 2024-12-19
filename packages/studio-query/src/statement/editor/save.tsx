import React, { useRef } from 'react';
import { Tooltip, Button, Popover, Typography, Flex, Input, Popconfirm } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';
interface ISaveStatementProps {
  onSave: (name: string) => void;
}

const SaveStatement: React.FunctionComponent<ISaveStatementProps> = props => {
  const { onSave } = props;
  const InputRef = useRef(null);
  const intl = useIntl();
  const confirm = () => {
    if (InputRef.current) {
      //@ts-ignore
      const { value } = InputRef.current.input;
      console.log('InputRef.current', value);
      onSave && onSave(value);
    }
  };
  const cancel = () => {};

  return (
    <Tooltip
      title={intl.formatMessage({
        id: 'Save',
      })}
    >
      <Popconfirm
        title="name your statement"
        description={<Input width={'200px'} ref={InputRef}></Input>}
        onConfirm={confirm}
        onCancel={cancel}
        okText="Save"
        cancelText="Cancel"
        placement="bottomRight"
      >
        <Button type="text" icon={<BookOutlined></BookOutlined>} />
      </Popconfirm>
    </Tooltip>
  );
};

export default SaveStatement;
