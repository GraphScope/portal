import * as React from 'react';

interface IPunctuationProps {
  style?: React.CSSProperties;
}

const Punctuation: React.FC<IPunctuationProps> = ({ style = {} }) => {
  const { color = '#B668B0', fontSize = '16px' } = style;

  return (
    <svg
      style={{ verticalAlign: 'middle' }}
      width={fontSize}
      height={fontSize}
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={color}
        d="M512 73.142857C269.604571 73.142857 73.142857 269.604571 73.142857 512s196.461714 438.857143 438.857143 438.857143 438.857143-196.461714 438.857143-438.857143S754.395429 73.142857 512 73.142857z m0 838.948572C291.108571 912.091429 111.908571 732.891429 111.908571 512S291.108571 111.908571 512 111.908571 912.091429 291.108571 912.091429 512 732.891429 912.091429 512 912.091429z"
      />
      <path
        fill={color}
        d="M512 512m-222.354286 0a222.354286 222.354286 0 1 0 444.708572 0 222.354286 222.354286 0 1 0-444.708572 0Z"
      />
    </svg>
  );
};

export default Punctuation;
