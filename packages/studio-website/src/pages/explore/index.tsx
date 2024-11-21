import React, { lazy, Suspense } from 'react';
import { theme } from 'antd';
import { useContext } from '../../layouts/useContext';
import Section from '../../components/section';
import { FormattedMessage } from 'react-intl';
import { GlobalSpin } from '@graphscope/studio-components';
const Explore = lazy(() => import('@graphscope/studio-explore'));

export interface IExplorePageState {
  isEmptyModel: boolean;
  isStoppedServer: boolean;
  isReady: boolean;
}
const ExplorePage = () => {
  const { store, id } = useContext();
  const { token } = theme.useToken();
  return (
    <Section
      breadcrumb={[
        {
          title: <FormattedMessage id="Explore" />,
        },
      ]}
      style={{ padding: '0px' }}
    >
      <Suspense fallback={<GlobalSpin />}>
        <Explore />
      </Suspense>
    </Section>
  );
};

export default ExplorePage;
