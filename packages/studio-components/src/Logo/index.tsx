import React from 'react';
import { theme } from 'antd';
export const LogoImage = ({
  style,
  colors = ['#2281f2', '#1fb2fd', '#37edd7'],
  animate,
}: {
  style: React.CSSProperties;
  colors?: string[];
  animate?: boolean;
}) => {
  const [cls2, cls3, cls4] = colors;
  const otherProps = animate ? { className: 'logo-text-path' } : {};
  return (
    <svg
      width="50px"
      height="60px"
      viewBox="90 15 86 80"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={style}
    >
      <g xmlns="http://www.w3.org/2000/svg">
        <path
          {...otherProps}
          style={{ fill: cls2 }}
          d="M132.84,45.54V36.22l2.94-2,6.44-4.45v-6.1l-14.13,9.43a26.21,26.21,0,0,0-6.4,5.84v.2Z"
        />
        <path
          {...otherProps}
          style={{ fill: cls2 }}
          d="M108.61,37.91c2.88-6.29,11.59-13,11.59-13L149,6,137.81,0,116,14.15S94.35,27.31,96,48.93c1.3,17,22.42,22.2,22.42,22.2C106,66.08,104.57,46.73,108.61,37.91Z"
        />
        <path
          {...otherProps}
          style={{ fill: cls3 }}
          d="M149,6l-28.77,19s-8.71,6.69-11.59,13c-4.32,9.42-2.34,31,12.51,34,0,0,6.2,1.49,17.19-4.72,5.75-3.25,13.35,3.22,13.35,3.22,8.66-6.62,2.16-13-4.81-15.33C140,52.8,135,57.41,127.63,59.3s-9.28-6.51-9.28-6.51-3.46-10.92,9.74-19.72l14.13-9.43v6.1l-9.38,6.48v9.32l16.45-10.95Z"
        />
        <path
          {...otherProps}
          style={{ fill: cls4 }}
          d="M162.42,50.1c-8.19-6.77-19.52-6.33-28.5-3.55-4.87,1.51-15.56,6.24-15.56,6.24a10.74,10.74,0,0,0,.45,1.4c.06.15.13.32.21.49s.15.33.24.5.25.49.4.74.2.32.31.48.34.47.52.7.3.34.46.5a6.57,6.57,0,0,0,2.58,1.66l.5.14a7.28,7.28,0,0,0,3.6-.1h.05c4.75-1.23,8.34-3.55,12-4.34a12.16,12.16,0,0,1,7.2.17c7,2.38,13.47,8.71,4.81,15.33h0L128.77,85.21h0l-6.28-3.66,14.06-8.64-9.21-4.82L104.09,82h0l16.07,8.73h0l11.33,6.15,32-21.14S178.64,63.52,162.42,50.1Z"
        />
        <path
          {...otherProps}
          style={{ fill: cls3 }}
          d="M169.9,63.41h0s0,.08,0,.12c-.18,7.18-6.44,12.25-6.44,12.25l-32,21.14v15.19l33-23c5.51-3.21,5.41-10.33,5.41-10.33Z"
        />
        <polygon
          {...otherProps}
          style={{ fill: cls2 }}
          points="136.56 72.91 136.56 72.91 136.56 72.91 122.5 81.55 128.65 85.14 128.87 85.15 136.56 80.19 136.56 72.91"
        />
        <polygon
          {...otherProps}
          style={{ fill: cls2 }}
          points="131.49 96.92 104.09 82.03 104.1 96.21 131.5 112.11 131.49 96.92"
        />
      </g>
    </svg>
  );
};

export const LogoText = ({
  style,
  color = '#333',
  animate,
}: {
  style: React.CSSProperties;
  color?: string;
  animate?: boolean;
}) => {
  const otherProps = animate ? { className: 'logo-text-path' } : {};
  return (
    <svg
      width="266px"
      height="45px"
      viewBox="0 0 266 45"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={style}
    >
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-393, -387)" fill={color} fillRule="nonzero">
          <g id="graphscope-logo-text" transform="translate(332, 376)">
            <g transform="translate(61, 11.485)">
              <path
                {...otherProps}
                d="M33.016,17.353 C33.016,17.802 33,18.694 32.968,20.028 C32.936,21.362 32.872,22.237 32.776,22.654 C31.972,26.768 30.197,29.805 27.45,31.764 C24.702,33.726 21.192,34.705 16.918,34.705 C13.672,34.705 10.78,34.103 8.242,32.898 C5.703,31.693 3.694,29.797 2.217,27.21 C0.738,24.624 -4.88498131e-15,21.337 -4.88498131e-15,17.353 C-4.88498131e-15,13.369 0.739,10.083 2.217,7.495 C3.694,4.909 5.703,3.013 8.242,1.807 C10.78,0.602 13.672,0 16.918,0 C19.103,0 21.215,0.434 23.257,1.302 C25.297,2.17 27.089,3.407 28.632,5.013 C30.174,6.62 31.283,8.484 31.958,10.604 L25.258,10.604 C24.615,9.191 23.53,7.985 22.004,6.989 C20.478,5.993 18.782,5.495 16.919,5.495 C14.926,5.495 13.142,5.937 11.569,6.821 C9.994,7.704 8.749,9.03 7.833,10.798 C6.917,12.566 6.46,14.75 6.46,17.353 C6.46,19.955 6.918,22.149 7.833,23.931 C8.749,25.715 9.994,27.04 11.569,27.908 C13.143,28.776 14.926,29.21 16.919,29.21 C19.168,29.21 21.137,28.655 22.824,27.548 C24.511,26.439 25.676,24.809 26.319,22.655 L16.92,22.655 L16.92,17.354 L33.016,17.354 L33.016,17.353 Z"
              ></path>
              <path
                {...otherProps}
                d="M48.826,15.424 C47.38,15.778 46.046,16.469 44.825,17.497 C43.604,18.527 42.993,20.132 42.993,22.317 L42.993,34.705 L36.871,34.705 L36.871,22.077 C36.871,19.924 37.409,17.931 38.486,16.099 C39.562,14.267 41.017,12.814 42.848,11.737 C44.679,10.66 46.672,10.122 48.825,10.122 L48.825,15.424 L48.826,15.424 Z"
              ></path>
              <path
                {...otherProps}
                d="M68.878,11.785 C70.195,12.573 71.248,13.626 72.035,14.943 C72.822,16.261 73.216,17.707 73.216,19.282 L73.216,34.706 L58.756,34.706 L58.612,34.706 C57.197,34.706 55.889,34.353 54.683,33.646 C53.478,32.939 52.521,31.982 51.815,30.778 C51.108,29.573 50.755,28.263 50.755,26.849 C50.755,25.436 51.109,24.134 51.815,22.944 C52.522,21.757 53.478,20.816 54.683,20.125 C55.888,19.434 57.197,19.088 58.612,19.088 L67.144,19.088 C67.144,18.158 66.822,17.362 66.18,16.703 C65.537,16.045 64.765,15.715 63.866,15.715 L55.383,15.715 L55.383,10.6049981 L64.541,10.6049981 C66.114,10.604 67.56,10.998 68.878,11.785 Z M67.143,29.403 L67.143,23.715 L59.672,23.715 C58.836,23.715 58.153,23.998 57.623,24.558 C57.093,25.122 56.828,25.805 56.828,26.607 C56.828,27.346 57.101,27.997 57.648,28.559 C58.194,29.121 58.853,29.402 59.624,29.402 L67.143,29.402 L67.143,29.403 Z"
              ></path>
              <path
                {...otherProps}
                d="M98.738,13.4 C100.81,15.264 101.847,18.108 101.847,21.932 C101.847,25.756 100.81,28.601 98.738,30.463 C96.665,32.328 93.973,33.259 90.664,33.259 L85.073,33.259 L85.073,44.346 L79,44.346 L79,10.6049992 L90.664,10.6049992 C93.973,10.604 96.665,11.537 98.738,13.4 Z M90.664,27.957 C91.499,27.957 92.31,27.716 93.098,27.234 C93.885,26.751 94.527,26.061 95.026,25.161 C95.524,24.261 95.773,23.184 95.773,21.931 C95.773,20.678 95.524,19.601 95.026,18.701 C94.527,17.801 93.885,17.111 93.098,16.628 C92.31,16.147 91.498,15.905 90.664,15.905 L85.073,15.905 L85.073,27.956 L90.664,27.956 L90.664,27.957 Z"
              ></path>
              <path
                {...otherProps}
                d="M112.74,12.051 L118.621,12.051 C120.067,12.051 121.408,12.413 122.646,13.136 C123.883,13.859 124.863,14.839 125.586,16.075 C126.309,17.312 126.671,18.654 126.671,20.101 L126.671,34.706 L120.598,34.706 L120.598,21.257 C120.598,20.165 120.22,19.24 119.465,18.486 C118.71,17.731 117.785,17.354 116.694,17.354 L112.741,17.354 L112.741,34.706 L106.668,34.706 L106.668,0.965 L112.741,0.965 L112.741,12.051 L112.74,12.051 Z"
              ></path>
              <path
                {...otherProps}
                d="M153.904,6.459 L142.336,6.459 C140.632,6.459 139.194,6.861 138.022,7.664 C136.849,8.468 136.263,9.479 136.263,10.7 C136.263,11.279 136.407,11.841 136.697,12.388 C137.179,13.192 137.982,13.754 139.107,14.075 C140.231,14.397 141.79,14.686 143.783,14.943 C145.518,15.168 146.98,15.409 148.168,15.666 C149.357,15.924 150.434,16.326 151.398,16.871 C153.005,17.803 154.307,18.967 155.303,20.365 C156.299,21.763 156.797,23.281 156.797,24.921 C156.797,26.785 156.242,28.464 155.135,29.958 C154.026,31.452 152.507,32.618 150.579,33.453 C148.651,34.289 146.546,34.706 144.265,34.706 L130.768,34.706 L130.768,29.211 L144.265,29.211 C145.967,29.211 147.404,28.809 148.579,28.006 C149.751,27.204 150.337,26.191 150.337,24.97 C150.337,24.166 150.048,23.435 149.469,22.776 C148.892,22.118 148.12,21.595 147.156,21.21 C146.737,21.05 145.532,20.823 143.541,20.535 L141.661,20.246 C137.162,19.539 134.077,18.35 132.407,16.679 C131.571,15.875 130.928,14.968 130.479,13.955 C130.028,12.944 129.804,11.876 129.804,10.75 C129.804,8.982 130.366,7.352 131.491,5.858 C132.615,4.362 134.133,3.174 136.046,2.291 C137.957,1.406 140.054,0.965 142.336,0.965 L153.904,0.965 L153.904,6.459 Z"
              ></path>
              <path
                {...otherProps}
                d="M179.692,12.171 C181.651,13.537 183.082,15.505 183.982,18.076 L177.33,18.076 C176.847,17.401 176.221,16.822 175.449,16.34 C174.678,15.857 173.81,15.617 172.846,15.617 C171.014,15.617 169.52,16.219 168.364,17.424 C167.208,18.629 166.629,20.373 166.629,22.653 C166.629,24.935 167.208,26.679 168.364,27.882 C169.52,29.087 171.015,29.691 172.846,29.691 C173.874,29.691 174.766,29.45 175.521,28.967 C176.276,28.486 176.879,27.907 177.33,27.233 L183.982,27.233 C183.082,29.804 181.651,31.772 179.692,33.138 C177.73,34.504 175.304,35.187 172.412,35.187 C168.781,35.187 165.834,34.159 163.568,32.101 C161.302,30.045 160.169,26.896 160.169,22.654 C160.169,18.413 161.303,15.263 163.568,13.207 C165.834,11.151 168.781,10.123 172.412,10.123 C175.304,10.123 177.73,10.806 179.692,12.171 Z"
              ></path>
              <path
                {...otherProps}
                d="M205.165,11.785 C206.98,12.894 208.363,14.397 209.311,16.292 C210.258,18.189 210.732,20.31 210.732,22.655 C210.732,25.002 210.258,27.122 209.311,29.018 C208.362,30.914 206.98,32.416 205.165,33.525 C203.35,34.634 201.188,35.189 198.683,35.189 C196.176,35.189 194.014,34.634 192.199,33.525 C190.383,32.416 189.001,30.914 188.054,29.018 C187.105,27.122 186.632,25.002 186.632,22.655 C186.632,20.31 187.106,18.189 188.054,16.292 C189.001,14.398 190.382,12.894 192.199,11.785 C194.014,10.677 196.176,10.123 198.683,10.123 C201.189,10.123 203.35,10.677 205.165,11.785 Z M203.166,27.884 C204.162,26.552 204.66,24.809 204.66,22.655 C204.66,20.502 204.162,18.759 203.166,17.426 C202.17,16.093 200.676,15.425 198.684,15.425 C196.658,15.425 195.156,16.093 194.177,17.426 C193.196,18.76 192.706,20.503 192.706,22.655 C192.706,24.809 193.196,26.552 194.177,27.884 C195.156,29.219 196.658,29.885 198.684,29.885 C200.675,29.885 202.169,29.219 203.166,27.884 Z"
              ></path>
              <path
                {...otherProps}
                d="M235.292,13.4 C237.364,15.264 238.401,18.108 238.401,21.932 C238.401,25.756 237.364,28.601 235.292,30.463 C233.219,32.328 230.527,33.259 227.218,33.259 L221.627,33.259 L221.627,44.346 L215.553,44.346 L215.553,10.6049992 L227.219,10.6049992 C230.527,10.604 233.219,11.537 235.292,13.4 Z M227.218,27.957 C228.052,27.957 228.863,27.716 229.652,27.234 C230.439,26.751 231.082,26.061 231.58,25.161 C232.078,24.261 232.327,23.184 232.327,21.931 C232.327,20.678 232.078,19.601 231.58,18.701 C231.082,17.801 230.439,17.111 229.652,16.628 C228.864,16.147 228.052,15.905 227.218,15.905 L221.627,15.905 L221.627,27.956 L227.218,27.956 L227.218,27.957 Z"
              ></path>
              <path
                {...otherProps}
                d="M259.681,11.4 C261.528,12.251 263.014,13.601 264.14,15.448 C265.264,17.297 265.827,19.617 265.827,22.413 L265.827,25.403 L248.04,25.403 C248.715,27.974 250.466,29.306 253.295,29.403 L262.163,29.403 L262.163,34.706 L253.583,34.706 C249.855,34.706 246.875,33.71 244.641,31.718 C242.407,29.726 241.291,26.625 241.291,22.414 C241.291,19.618 241.861,17.305 243.002,15.474 C244.143,13.642 245.637,12.293 247.486,11.426 C249.333,10.558 251.366,10.124 253.583,10.124 C255.8,10.124 257.832,10.549 259.681,11.4 Z M259.753,20.581 C259.593,19.04 259.014,17.794 258.019,16.846 C257.021,15.899 255.591,15.424 253.729,15.424 C251.864,15.424 250.443,15.899 249.462,16.846 C248.481,17.795 247.911,19.04 247.751,20.581 L259.753,20.581 Z"
              ></path>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

const Logo = (props: { style?: any; onlyIcon?: boolean }) => {
  const { style = {} } = props;

  const { token } = theme.useToken();

  return (
    <div
      style={{
        overflow: 'hidden',
        ...style,
      }}
    >
      <LogoImage style={{ width: '28px', marginTop: '-4px', marginRight: '6px' }} />
      <LogoText style={{ width: '120px', height: '54px' }} color={token.colorTextHeading} />
    </div>
  );
};
export default Logo;
