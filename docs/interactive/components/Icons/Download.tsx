import * as React from 'react';
interface IDownloadProps {
  style?: React.CSSProperties;
}

const Download: React.FC<IDownloadProps> = ({ style = {} }) => {
  const { color = '#FFF', fontSize = '16px' } = style;

  return (
    <svg style={style} width="53" height="56" xmlns="http://www.w3.org/2000/svg" fill="none">
      <defs>
        <linearGradient y2="1.3182" x2="0.0754" y1="0.0071" x1="-0.30797" id="paint0_linear_5471_39069">
          <stop stopColor="#25b3fd" />
          <stop stopColor="#3cecd7" offset="0.41146" />
          <stop stopColor="#2782f3" offset="1" />
        </linearGradient>
      </defs>
      <g>
        <path
          id="svg_1"
          fill="url(#paint0_linear_5471_39069)"
          d="m48.6001,32.6337l-23.1287,23.1403c-0.2174,0.2174 -0.511,0.3376 -0.8185,0.3376c-0.3074,0 -0.6011,-0.1226 -0.8184,-0.3399l-23.05943,-23.138c-0.33064,-0.3306 -0.42775,-0.8276 -0.24969,-1.26c0.18033,-0.4323 0.60114,-0.7122 1.06812,-0.7122l12.7157,0l0,-28.8994c0,-0.6381 0.5179,-1.15601 1.156,-1.15601l18.4957,0c0.6381,0 1.156,0.51791 1.156,1.15601l0,28.8995l12.6671,0c0.467,0 0.8878,0.2821 1.0681,0.7144c0.1804,0.4323 0.0786,0.9271 -0.252,1.2577z"
        />
      </g>
    </svg>
  );
};

export default Download;
