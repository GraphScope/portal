import React from 'react';
import ReactDOM from 'react-dom/client';
import Pages from './pages';
import { installSlot, unInstallSlot } from './slots';
import { SIDE_MENU } from './layouts/const';
import { ROUTES } from './pages';
import { Utils } from '@graphscope/studio-components';
import { ROUTES as GRAPHY_ROUTES, SIDE_MENU as GRAPHY_SIDE_MENU } from '@graphscope/graphy-website';

if (Utils.storage.get('PORTAL_PLUGIN_GRAPHY')) {
  installSlot('SIDE_MEU', 'graphy', GRAPHY_SIDE_MENU);
  installSlot('ROUTES', 'graphy', GRAPHY_ROUTES);
} else {
  unInstallSlot('SIDE_MEU', 'graphy');
  unInstallSlot('ROUTES', 'graphy');
}

installSlot('SIDE_MEU', 'studio', SIDE_MENU);
installSlot('ROUTES', 'studio', ROUTES);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Pages />);
