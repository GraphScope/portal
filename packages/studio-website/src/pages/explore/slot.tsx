import React, { Suspense } from 'react';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlassChart } from '@fortawesome/free-solid-svg-icons';
import { installSlot, unInstallSlot } from '../../slots';
import { Utils } from '@graphscope/studio-components';
import { Route } from 'react-router-dom';

/**  实验性质的模块 */
export const SIDE_MENU = [
  {
    label: <FormattedMessage id="Explore" />,
    key: '/explore',
    value: '/explore',
    icon: <FontAwesomeIcon icon={faMagnifyingGlassChart} />,
  },
];

export const ROUTES = [{ path: '/explore', component: React.lazy(() => import('./index')) }].map((item, index) => {
  const { path, component: Component } = item;
  return (
    <Route
      key={index}
      path={path}
      element={
        <Suspense fallback={<></>}>
          {/** @ts-ignore */}
          <Component />
        </Suspense>
      }
    />
  );
});

export const PLUGIN_ID = 'EXPLORE';
export const PLUGIN_LOCAL_STORAGE_KEY = `PORTAL_PLUGIN_${PLUGIN_ID}`;

/**  实验性质的模块：Explore */

export function togglePlugin(enable?: boolean) {
  let _enable = enable;
  if (enable === undefined) {
    _enable = Utils.storage.get(PLUGIN_LOCAL_STORAGE_KEY) || window.GS_ENGINE_TYPE !== 'groot';
  }
  if (window.GS_ENGINE_TYPE === 'groot') {
    _enable = false;
  }

  if (_enable) {
    installSlot('SIDE_MEU', PLUGIN_ID, SIDE_MENU);
    installSlot('ROUTES', PLUGIN_ID, ROUTES);
  } else {
    unInstallSlot('SIDE_MEU', PLUGIN_ID);
    unInstallSlot('ROUTES', PLUGIN_ID);
  }
  Utils.storage.set(PLUGIN_LOCAL_STORAGE_KEY, _enable);
  return _enable;
}
