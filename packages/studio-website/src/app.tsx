import React from 'react';
import ReactDOM from 'react-dom/client';
import Pages from './pages';
import { installSlot, unInstallSlot } from './slots';

import { Utils } from '@graphscope/studio-components';

import { ROUTES, SIDE_MENU } from '@graphscope/graphy-website';

if (Utils.storage.get('PORTAL_PLUGIN_GRAPHY')) {
  installSlot('SIDE_MEU', 'graphy', SIDE_MENU);
  installSlot('ROUTES', 'graphy', ROUTES);
} else {
  unInstallSlot('SIDE_MEU', 'graphy');
  unInstallSlot('ROUTES', 'graphy');
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Pages />);
