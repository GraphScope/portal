import dynamic from 'next/dynamic';
import { GlobalSpin } from '@graphscope/studio-components';

const Visualizer = dynamic(
  () =>
    import('@graphscope/graph-apps').then(module => {
      return {
        /** 这种写法和 react lazy 就统一了 */
        default: () => {
          return <module.OnlineVisualizer id="tools-online" style={{ top: '64px' }} />;
        },
      };
    }),
  {
    loading: () => <GlobalSpin />,
    ssr: false,
  },
);

export default Visualizer;
