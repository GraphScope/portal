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
        d="M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32z m-260 72h96v209.9L621.5 312 572 347.4V136z m220 752H232V136h280v296.9c0 3.3 1 6.6 3 9.3 5.1 7.2 15.1 8.9 22.3 3.7l83.8-59.9 81.4 59.4c2.7 2 6 3.1 9.4 3.1 8.8 0 16-7.2 16-16V136h64v752z"
      />
    </svg>
  );
};
