import * as React from 'react';

interface IUnlockProps {
  style?: React.CSSProperties;
}

const Unlock: React.FunctionComponent<IUnlockProps> = props => {
  const { style } = props;
  const { color = '#000', fontSize = '14px' } = style || {};
  return (
    <svg width={fontSize} height={fontSize} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 32">
      <path
        d="M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z"
        fill={color}
      ></path>
    </svg>
  );
};

export default Unlock;
