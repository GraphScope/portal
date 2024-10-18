# Layout

```jsx
import { Layout, Icons, StudioProvider } from '@graphscope/studio-components';

export default () => {
  const sideMenu = [
    {
      label: 'home',
      key: '/home',
      icon: <Icons.Cluster />,
    },
  ];
  return (
    <div style={{ height: '500px', border: '1px solid red' }}>
      <Layout sideMenu={[sideMenu]} />
    </div>
  );
};
```
