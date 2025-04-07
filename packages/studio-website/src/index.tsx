import GraphScopePortal from './pages';
export { installSlot, unInstallSlot, getSlots } from './slots';

import { installSlot, unInstallSlot } from './slots';

import { Utils } from '@graphscope/studio-components';

import { ROUTES as GRAPHY_ROUTES, SIDE_MENU as GRAPGY_SIDE_MENU } from '@graphscope/graphy-website';
import { ROUTES } from './pages/index';
import { SIDE_MENU } from './layouts/const';
import { togglePlugin } from './pages/explore/slot';


/** Portal 内置模块 */
installSlot('SIDE_MEU', 'studio', SIDE_MENU);
installSlot('ROUTES', 'studio', ROUTES);

/** Explore 模块 */
togglePlugin();

/**  实验性质的模块：Graphy */
if (Utils.storage.get('PORTAL_PLUGIN_GRAPHY')) {
  installSlot('SIDE_MEU', 'graphy', GRAPGY_SIDE_MENU);
  installSlot('ROUTES', 'graphy', GRAPHY_ROUTES);
} else {
  unInstallSlot('SIDE_MEU', 'graphy');
  unInstallSlot('ROUTES', 'graphy');
}

export default GraphScopePortal;
