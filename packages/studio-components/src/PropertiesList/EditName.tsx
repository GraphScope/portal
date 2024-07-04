import React, { useRef } from 'react';
import { Input } from 'antd';
interface IEditNameProps {
  p: any;
  disabled?: boolean;
  handleDoubleClick: () => void;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const EditName: React.FC<IEditNameProps> = props => {
  const { p, disabled, handleDoubleClick, handleBlur } = props;
  const [row, record] = p;
  const inputRef = useRef<HTMLInputElement>(null);
  const inputStyle: React.CSSProperties = record.disable &&
    disabled && {
      cursor: 'pointer',
      backgroundColor: '#505256',
      color: '#fff',
      textAlign: 'center',
    };
  return (
    <>
      <Input
        size="small"
        style={{
          width: '100%',
          ...inputStyle,
        }}
        //@ts-ignore
        ref={inputRef}
        defaultValue={row}
        disabled={!disabled}
        onClick={async () => {
          await handleDoubleClick();
          await inputRef.current?.focus();
        }}
        onBlur={handleBlur}
      />
    </>
  );
};

export default EditName;
