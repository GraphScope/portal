import * as React from 'react';

interface IZoomFitProps {
  style?: React.CSSProperties;
}

const ZoomFit: React.FunctionComponent<IZoomFitProps> = props => {
  const { style } = props;
  const { color, fontSize = '18px' } = style as { color: string; fontSize: string };
  return (
    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width={fontSize} height={fontSize}>
      <path
        fill={color}
        d="M187.456 138.752a42.688 42.688 0 0 0-42.688 42.688V352h85.376v-128h128V138.752H187.456z m641.344 0h-170.624v85.312h128v128h85.312V181.44a42.688 42.688 0 0 0-42.688-42.688z m-598.656 524.8v128h128V876.8H187.456a42.688 42.688 0 0 1-42.688-42.688v-170.624h85.376z m556.032 0v128h-128V876.8h170.624a42.688 42.688 0 0 0 42.688-42.688v-170.624h-85.312zM426.624 384A42.688 42.688 0 0 0 384 426.624v170.688c0 23.552 19.072 42.688 42.624 42.688h170.688A42.688 42.688 0 0 0 640 597.312V426.624A42.688 42.688 0 0 0 597.312 384H426.624z"
      ></path>
    </svg>
  );
};

export default ZoomFit;
