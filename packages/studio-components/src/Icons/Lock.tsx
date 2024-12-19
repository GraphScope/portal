import * as React from 'react';

interface ILockProps {
  style?: React.CSSProperties;
}

const Lock: React.FunctionComponent<ILockProps> = props => {
  const { style } = props;
  const { color = '#000', fontSize = '14px' } = style || {};
  return (
    <svg width={fontSize} height={fontSize} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 32">
      <path
        d="M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z"
        fill={color}
      ></path>
    </svg>
  );
};

export default Lock;
