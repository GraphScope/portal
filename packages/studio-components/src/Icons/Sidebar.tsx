import React from 'react';
export default ({ style, fill, revert }: { style?: React.CSSProperties; fill?: string; revert?: boolean }) => {
  // 根据revert属性判断是否需要镜像
  const transformStyle = revert ? { ...style, transform: 'scaleX(-1)' } : style;

  return (
    <svg
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="1426"
      width="14"
      height="14"
      style={transformStyle}
    >
      <path
        fill={fill || '#000'}
        d="M358.4 153.6H102.4v716.8h256V153.6z m102.4 0v716.8h460.8V153.6H460.8zM0 153.6c0-56.32 46.08-102.4 102.4-102.4h819.2a102.4 102.4 0 0 1 102.4 102.4v716.8a102.4 102.4 0 0 1-102.4 102.4H102.4a102.4 102.4 0 0 1-102.4-102.4V153.6z m153.6 51.2h153.6v102.4H153.6V204.8z m0 153.6h153.6v102.4H153.6V358.4z m0 153.6h153.6v102.4H153.6v-102.4z"
      ></path>
    </svg>
  );
};
