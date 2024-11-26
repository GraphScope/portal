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
        d="M768.938667 256A361.898667 361.898667 0 0 0 512 149.333333C311.701333 149.333333 149.333333 311.701333 149.333333 512s162.368 362.666667 362.666667 362.666667 362.666667-162.368 362.666667-362.666667h85.333333c0 247.424-200.576 448-448 448S64 759.424 64 512 264.576 64 512 64c122.88 0 237.226667 49.898667 320 134.4V64h85.333333v277.333333H640v-85.333333h128.938667z"
      />
    </svg>
  );
};