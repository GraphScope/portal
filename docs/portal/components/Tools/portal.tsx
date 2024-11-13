// import dynamic from 'next/dynamic';
// import { GlobalSpin } from '@graphscope/studio-components';

// const Apps = dynamic(
//   () =>
//     import('@graphscope/studio-site').then(module => {
//       return {
//         /** 这种写法和 react lazy 就统一了 */
//         default: () => {
//           return (
//             <div
//               style={{
//                 position: 'absolute',
//                 top: '0px',
//                 left: '0px',
//                 bottom: '0px',
//                 right: '0px',
//                 zIndex: 999,
//                 background: '#fff',
//               }}
//             >
//               <module.default />
//             </div>
//           );
//         },
//       };
//     }),
//   {
//     loading: () => <GlobalSpin />,
//     ssr: false,
//   },
// );

// export default Apps;

export default () => {
  return (
    <iframe
      style={{
        position: 'absolute',
        height: '100%',
        width: '100%',
        top: '0px',
        left: '0px',
        bottom: '0px',
        right: '0px',
        zIndex: 999,
      }}
      src="/portal.html"
    ></iframe>
  );
};
