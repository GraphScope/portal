import React from 'react';

export default ({ isDark }: { isDark: boolean }) => {
  const fillColor = isDark ? '#272727' : '#E6E9EE';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 915 866" fill="none">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M552.085 623.067C491.189 655.842 482.589 745.72 418.484 770.756C352.941 796.353 259.359 798.915 226.164 750.352C189.108 696.141 291.287 607.551 265.559 547.035C237.793 481.726 101.961 496.952 88.3682 426.238C76.2288 363.085 150.831 297.41 208.118 248.21C263.376 200.753 332.496 162.372 402.856 156.147C468.399 150.348 511.091 201.87 571.612 216.049C633.101 230.454 738.7 185.557 759.412 239.679C782.973 301.247 654.143 363.856 654.328 432.195C654.506 498.496 794.484 523.038 760.348 586.766C727.485 648.115 617.062 588.097 552.085 623.067Z"
        fill={isDark ? '#272727' : '#EEF1F6'}
      />
      <circle cx="595.876" cy="255.218" r="12.5406" transform="rotate(30 595.876 255.218)" fill={fillColor} />
      <circle cx="724.312" cy="289.146" r="12.5406" transform="rotate(30 724.312 289.146)" fill={fillColor} />
      <circle cx="735.006" cy="235.789" r="12.5406" transform="rotate(30 735.006 235.789)" fill={fillColor} />
      <circle cx="800.535" cy="288.103" r="12.5406" transform="rotate(30 800.535 288.103)" fill={fillColor} />
      <circle cx="613.406" cy="199.774" r="12.5406" transform="rotate(30 613.406 199.774)" fill={fillColor} />
      <circle cx="662.947" cy="242.856" r="12.5406" transform="rotate(30 662.947 242.856)" fill={fillColor} />
      <circle cx="722.216" cy="420.273" r="12.5406" transform="rotate(30 722.216 420.273)" fill={fillColor} />
      <circle cx="788.851" cy="389.157" r="12.5406" transform="rotate(30 788.851 389.157)" fill={fillColor} />
      <line x1="594.446" y1="254.765" x2="611.976" y2="199.321" stroke={fillColor} stroke-width="3" />
      <line x1="661.962" y1="243.988" x2="612.422" y2="200.905" stroke={fillColor} stroke-width="3" />
      <line x1="663.219" y1="244.332" x2="596.148" y2="256.693" stroke={fillColor} stroke-width="3" />
      <line x1="663.85" y1="241.659" x2="725.215" y2="287.949" stroke={fillColor} stroke-width="3" />
      <line x1="736.476" y1="236.083" x2="725.782" y2="289.441" stroke={fillColor} stroke-width="3" />
      <line x1="735.152" y1="237.281" x2="663.093" y2="244.349" stroke={fillColor} stroke-width="3" />
      <line x1="735.941" y1="234.616" x2="801.471" y2="286.93" stroke={fillColor} stroke-width="3" />
      <line x1="787.591" y1="389.971" x2="723.052" y2="289.96" stroke={fillColor} stroke-width="3" />
      <line x1="787.361" y1="388.985" x2="799.046" y2="287.931" stroke={fillColor} stroke-width="3" />
      <line x1="800.556" y1="289.603" x2="724.333" y2="290.646" stroke={fillColor} stroke-width="3" />
      <line x1="789.486" y1="390.517" x2="722.851" y2="421.632" stroke={fillColor} stroke-width="3" />
      <circle cx="165.557" cy="381.703" r="16.9036" transform="rotate(165 165.557 381.703)" fill={fillColor} />
      <circle cx="131.703" cy="474.871" r="16.9036" transform="rotate(165 131.703 474.871)" fill={fillColor} />
      <circle cx="216.702" cy="581.703" r="16.9036" transform="rotate(165 216.702 581.703)" fill={fillColor} />
      <line x1="132.878" y1="473.939" x2="218.059" y2="581.392" stroke={fillColor} stroke-width="3" />
      <line x1="130.293" y1="474.359" x2="164.148" y2="381.191" stroke={fillColor} stroke-width="3" />
      <circle cx="334" cy="204" r="7" fill={fillColor} />
      <circle cx="361" cy="152" r="7" fill={fillColor} />
      <circle cx="283" cy="229" r="7" fill={fillColor} />
      <circle cx="385" cy="219" r="7" fill={fillColor} />
      <circle cx="414" cy="190" r="7" fill={fillColor} />
      <line x1="282.78" y1="228.551" x2="333.78" y2="203.551" stroke={fillColor} />
      <line x1="384.859" y1="219.48" x2="333.859" y2="204.48" stroke={fillColor} />
      <line x1="384.647" y1="218.646" x2="413.647" y2="189.646" stroke={fillColor} />
      <line x1="384.53" y1="219.169" x2="360.53" y2="152.169" stroke={fillColor} />
      <line x1="333.556" y1="203.77" x2="360.556" y2="151.77" stroke={fillColor} />
      <ellipse cx="553" cy="673.5" rx="25" ry="24.5" fill={fillColor} />
      <circle cx="786" cy="553" r="25" fill={fillColor} />
      <line x1="551.872" y1="671.669" x2="785.082" y2="551.223" stroke={fillColor} stroke-width="4" />
    </svg>
  );
};
