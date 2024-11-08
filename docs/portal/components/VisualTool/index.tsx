import dynamic from 'next/dynamic';
import { GlobalSpin } from '@graphscope/studio-components';

const Apps = dynamic(
  () =>
    import('@graphscope/graph-apps').then(module => {
      return module.OnlineVisualizer;
    }),
  {
    loading: () => <GlobalSpin />,
    ssr: false,
  },
);

export default Apps;
