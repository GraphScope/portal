import * as React from 'react';

interface IQuotesProps {
  style?: React.CSSProperties;
}

const Quotes: React.FC<IQuotesProps> = ({ style = {} }) => {
  const { color = '#FFF', fontSize = '16px' } = style;

  return (
    <svg style={style} width="279" height="175" xmlns="http://www.w3.org/2000/svg" fill="none">
      <defs>
        <linearGradient y2="1.18513" x2="0.90458" y1="0" x1="0" id="paint0_linear_5681_259">
          <stop stop-color="#25b3fd" />
          <stop stop-color="#3cecd7" offset="0.505" />
          <stop stop-color="#2782f3" offset="1" />
        </linearGradient>
      </defs>
      <g>
        <path
          id="svg_1"
          fill="url(#paint0_linear_5681_259)"
          d="m122.845,36.0876l0,42.7662c0,3.0768 0,6.273 -0.048,9.5883l0,0.2624c0,43.6005 -5.174,86.2955 -63.139,86.2955c-4.4588,0 -8.5839,-0.215 -12.4705,-0.716c15.6656,-10.017 26.014,-27.357 26.014,-47.083c0,-1.431 -0.0477,-2.862 -0.167,-4.269l-36.9583,0c-19.9099,0 -36.07617,-16.172 -36.07617,-36.0879l0,-50.7565c-0.02385,-19.9161 16.14247,-36.0876 36.05227,-36.0876l50.7165,0c19.9102,0 36.0762,16.1715 36.0762,36.0876zm120.103,-36.0876l-50.717,0c-19.91,0 -36.076,16.1715 -36.076,36.0876l0,50.7326c0,19.9158 16.166,36.0878 36.076,36.0878l36.959,0c0.143,1.431 0.167,2.862 0.167,4.269c0,19.726 -10.325,37.066 -26.014,47.084c3.862,0.5 8.011,0.715 12.47,0.715c57.989,0 63.139,-42.694 63.139,-86.2953l0,-0.2624c0.048,-3.2916 0.048,-6.5115 0.048,-9.5884l0,-42.7423c0,-19.9161 -16.166,-36.0876 -36.076,-36.0876l0.024,0z"
          opacity="0.1"
        />
      </g>
    </svg>
  );
};

export default Quotes;
