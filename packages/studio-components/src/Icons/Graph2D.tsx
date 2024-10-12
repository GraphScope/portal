import * as React from 'react';

interface IGraph3DProps {
  fill?: string;
}

const Graph2D: React.FunctionComponent<IGraph3DProps> = props => {
  const { fill = '#000' } = props;
  return (
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" version="1.1" width="18" height="18" viewBox="0 0 180 180">
        <g>
          <path
            d="M82.0745,0.218048L86.8725,0C132.599,0,170.038,35.1852,173.672,79.8936L162.768,79.8936C160.223,52.5598,143.212,29.5148,119.441,18.2468L109.772,27.9155L82.0745,0.218048ZM78.3984,115.913L39.7104,115.913L39.7104,109.283C55.4664,95.2435,64.6703,84.4015,64.6703,75.4315C64.6703,69.7375,61.5504,66.1495,56.0124,66.1495C51.8004,66.1495,48.3683,68.8795,45.4824,72.0775L39.0864,65.9155C44.4684,60.1435,49.6164,57.1015,57.4944,57.1015C68.4144,57.1015,75.6684,64.1215,75.6684,74.8855C75.6684,85.3375,66.9324,96.5695,56.4023,106.943C59.3664,106.553,63.1884,106.241,65.9184,106.241L78.3984,106.241L78.3984,115.913ZM114.643,60.1202C117.841,61.4287,120.604,63.3189,122.93,65.7178C125.256,68.1168,127.074,71.0247,128.382,74.4413C129.618,77.8582,130.272,81.6385,130.272,85.8548L130.272,88.7626C130.272,92.9792,129.618,96.7594,128.382,100.176C127.147,103.52,125.329,106.428,123.003,108.827C120.676,111.226,117.841,113.043,114.57,114.352C111.299,115.66,107.591,116.315,103.593,116.315L86.8725,116.315L86.8725,58.1574L104.029,58.1574C107.955,58.1574,111.517,58.8117,114.643,60.1202ZM119.077,96.9049C119.731,94.4332,120.095,91.7434,120.095,88.6901L120.095,85.782C120.095,79.4575,118.714,74.6596,115.952,71.3155C113.262,67.9715,109.263,66.2995,104.029,66.2995L96.9777,66.2995L96.9776,108.246L103.593,108.246C106.283,108.246,108.682,107.81,110.79,106.937C112.826,106.065,114.57,104.756,115.951,103.084C117.333,101.412,118.35,99.3039,119.077,96.9049ZM10.9044,94.5057C13.5214,121.84,30.5325,144.957,54.3044,156.153L63.9732,146.557L91.6705,174.254L86.8725,174.472C41.1463,174.472,3.70746,139.287,0,94.5057L10.9044,94.5057Z"
            fill={fill}
          />
        </g>
      </svg>
    </div>
  );
};

export default Graph2D;
