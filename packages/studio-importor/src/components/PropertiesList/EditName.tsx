import React from 'react';
import { Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';
interface IEditNameProps {
  p: any;
  handleDoubleClick: () => void;
  handleBlur: (evt) => void;
}
const EditName: React.FC<IEditNameProps> = props => {
  const { p, handleDoubleClick, handleBlur } = props;
  const [row, record] = p;
  const inputRef = React.useRef();
  return (
    <>
      {record.disable ? (
        <div
          style={{
            lineHeight: '12px',
            width: '100%',
            padding: '4px 3px 5px 5px',
            cursor: 'pointer',
            backgroundColor: '#505256',
            color: '#fff',
            borderRadius: '3px',
            textAlign: 'center',
          }}
          onClick={async () => {
            await handleDoubleClick();
            //@ts-ignore
            await inputRef.current.focus();
          }}
        >
          {record?.name} <EditOutlined />
        </div>
      ) : (
        <Input
          size="small"
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
