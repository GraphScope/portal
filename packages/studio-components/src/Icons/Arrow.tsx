import * as React from 'react';

interface IArrowProps {
  style?: React.CSSProperties;
}
const Arrow: React.FunctionComponent<IArrowProps> = props => {
  const { style } = props;
  const { color = '#F97108', fontSize = '16px' } = style as { color: string; fontSize: string };
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
        d="M881 562H81c-27.6 0-50-22.4-50-50s22.4-50 50-50h800c27.6 0 50 22.4 50 50s-22.4 50-50 50zM907.6 540.7L695.5 328.6c-19.5-19.5-19.5-51.2 0-70.7s51.2-19.5 70.7 0L978.4 470c19.5 19.5 19.5 51.2 0 70.7-19.6 19.6-51.2 19.6-70.8 0zM695.5 695.4l212.1-212.1c19.5-19.5 51.2-19.5 70.7 0s19.5 51.2 0 70.7L766.2 766.1c-19.5 19.5-51.2 19.5-70.7 0s-19.5-51.2 0-70.7z"
      />
    </svg>
  );
};

export default Arrow;
