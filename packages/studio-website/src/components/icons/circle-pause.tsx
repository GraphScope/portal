import React from 'react';
export default ({ style }: { style: React.CSSProperties }) => {
  return (
    <svg
      width="41px"
      height="62px"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        fill="#e6e6e6"
        d="M512 0C229.232 0 0 229.232 0 512s229.232 512 512 512 512-229.232 512-512S794.768 0 512 0z m0 928C282.256 928 96 741.744 96 512S282.256 96 512 96s416 186.24 416 416c0 229.744-186.256 416-416 416z m-48-544a48 48 0 1 0-96 0v0.112h-0.032v256H368a48 48 0 1 0 95.968-1.232V385.12L464 384z m192 0a48 48 0 1 0-96 0v0.112h-0.032v256H560a48 48 0 1 0 95.968-1.232V385.12A25.44 25.44 0 0 0 656 384z"
      />
    </svg>
  );
};
