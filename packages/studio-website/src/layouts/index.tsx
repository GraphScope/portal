import React from 'react';
import { Outlet } from 'react-router-dom';
import './index.less';
import Sidebar from './sidebar';
import Container from './container';
import Footer from './footer';
import { useContext } from './useContext';
import { TOOLS_MENU } from './const';
import SegmentedSection from './segmented-section';

const Content = (props: any) => {
  const { children, navStyle } = props;
  const { store } = useContext();
  const { currentnNav } = store;
  const match = TOOLS_MENU.find(item => {
    return item.value === currentnNav;
  });

  if (match) {
    return (
      <SegmentedSection options={TOOLS_MENU} value={currentnNav} history={history} withNav={navStyle === 'inline'}>
        {children}
      </SegmentedSection>
    );
  }
  return <>{children}</>;
};

export default function Layout() {
  const { store } = useContext();
  const { navStyle } = store;

  return (
    <Container
      sidebar={<Sidebar />}
      content={
        <Content navStyle={navStyle}>
          <Outlet />
        </Content>
      }
      footer={<Footer />}
    />
  );
}
