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
        d="M800 928H224c-35.2 0-64-28.8-64-64V160c0-35.2 28.8-64 64-64h384c8.4 0 16.8 3.2 22.8 9.2l224 224c6 6 9.2 14 9.2 22.8v512c0 35.2-28.8 64-64 64zM224 160v704h576V365.2L594.8 160H224zM832 384h-224c-17.6 0-32-14.4-32-32V128c0-17.6 14.4-32 32-32s32 14.4 32 32v192h192c17.6 0 32 14.4 32 32s-14.4 32-32 32zM624 624c-8 0-16.4-3.2-22.8-9.2L512 525.2l-89.2 89.2c-12.4 12.4-32.8 12.4-45.2 0-12.4-12.4-12.4-32.8 0-45.2l112-112c12.4-12.4 32.8-12.4 45.2 0l112 112c12.4 12.4 12.4 32.8 0 45.2-6.4 6.4-14.8 9.6-22.8 9.6zM512 768c-17.6 0-32-14.4-32-32v-256c0-17.6 14.4-32 32-32s32 14.4 32 32v256c0 17.6-14.4 32-32 32z"
      />
    </svg>
  );
};
