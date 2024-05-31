import React from 'react';
import { Input, Space, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
interface IEditNameProps {
  p: any;
  disabled?: boolean;
  handleDoubleClick: () => void;
  handleBlur: (evt) => void;
}

const EditName: React.FC<IEditNameProps> = props => {
  const { p, disabled, handleDoubleClick, handleBlur } = props;
  const [row, record] = p;
  const inputRef = React.useRef();
  return (
    <>
      {record.disable && disabled ? (
        <Input
          size="small"
          style={{
            width: '100%',
            cursor: 'pointer',
            backgroundColor: '#505256',
            color: '#fff',
            textAlign: 'center',
          }}
          disabled={!disabled}
          //@ts-ignore
          ref={inputRef}
          defaultValue={row}
          onClick={async () => {
            await handleDoubleClick();
            //@ts-ignore
            await inputRef.current.focus();
          }}
        />
      ) : (
        <Input
          size="small"
          style={{ width: '100%' }}
          disabled={!disabled}
          //@ts-ignore
          ref={inputRef}
          defaultValue={row}
          onBlur={evt => handleBlur(evt)}
        />
      )}
    </>
  );
};

export default EditName;
