import * as React from 'react';
interface ICommunityProps {
  style?: React.CSSProperties;
}

const Community: React.FC<ICommunityProps> = ({ style = {} }) => {
  const { color = '#FFF', fontSize = '16px' } = style;

  return (
    <svg width="57" height="56" xmlns="http://www.w3.org/2000/svg" fill="none">
      <defs>
        <linearGradient y2="0.61717" x2="1.19733" y1="0" x1="0" id="paint0_linear_5471_39089">
          <stop stop-color="#25b3fd" />
          <stop stop-color="#3cecd7" offset="0.505" />
          <stop stop-color="#2782f3" offset="1" />
        </linearGradient>
        <linearGradient y2="1.32569" x2="0.83212" y1="0" x1="0" id="paint1_linear_5471_39089">
          <stop stop-color="#25b3fd" />
          <stop stop-color="#3cecd7" offset="0.505" />
          <stop stop-color="#2782f3" offset="1" />
        </linearGradient>
        <linearGradient y2="1.63177" x2="0.67435" y1="0" x1="0" id="paint2_linear_5471_39089">
          <stop stop-color="#25b3fd" />
          <stop stop-color="#3cecd7" offset="0.505" />
          <stop stop-color="#2782f3" offset="1" />
        </linearGradient>
        <linearGradient y2="0.61716" x2="1.19733" y1="0" x1="0" id="paint3_linear_5471_39089">
          <stop stop-color="#25b3fd" />
          <stop stop-color="#3cecd7" offset="0.505" />
          <stop stop-color="#2782f3" offset="1" />
        </linearGradient>
      </defs>
      <g>
        <path
          id="svg_1"
          fill="url(#paint0_linear_5471_39089)"
          d="m17.125,28c4.3492,0 7.875,-3.5258 7.875,-7.875c0,-4.3492 -3.5258,-7.875 -7.875,-7.875c-4.3492,0 -7.875,3.5258 -7.875,7.875c0,4.3492 3.5258,7.875 7.875,7.875z"
        />
        <path
          id="svg_2"
          fill="url(#paint1_linear_5471_39089)"
          d="m26.0938,32.375c-3.08,-1.5641 -6.4794,-2.1875 -8.9688,-2.1875c-4.8759,0 -14.875,2.9903 -14.875,8.9687l0,4.5938l16.4062,0l0,-1.7577c0,-2.0781 0.875,-4.1617 2.4063,-5.8985c1.2217,-1.3869 2.9323,-2.6743 5.0313,-3.7188z"
        />
        <path
          id="svg_3"
          fill="url(#paint2_linear_5471_39089)"
          d="m37.6875,31.5c-5.6952,0 -17.0625,3.5175 -17.0625,10.5l0,5.25l34.125,0l0,-5.25c0,-6.9825 -11.3673,-10.5 -17.0625,-10.5z"
        />
        <path
          id="svg_4"
          fill="url(#paint3_linear_5471_39089)"
          d="m37.6875,28c5.3157,0 9.625,-4.3093 9.625,-9.625c0,-5.3157 -4.3093,-9.625 -9.625,-9.625c-5.3157,0 -9.625,4.3093 -9.625,9.625c0,5.3157 4.3093,9.625 9.625,9.625z"
        />
      </g>
    </svg>
  );
};

export default Community;
