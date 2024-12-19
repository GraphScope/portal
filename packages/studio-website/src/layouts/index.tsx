import React, { useEffect, useState } from 'react';
import { useContext, IGraph } from './useContext';

import { Layout, LogoText, Utils, useCustomToken, GlobalSpin } from '@graphscope/studio-components';
import { DeploymentApiFactory } from '@graphscope/studio-server';
import { SIDE_MENU, SETTING_MENU } from './const';
import { notification } from 'antd';
import { listGraphs } from '../pages/instance/lists/service';
import { SLOTS, getSlots } from '../slots';

export default function StudioLayout() {
  const { store, updateStore } = useContext();
  const { graphId, draftId } = store;
  const [state, setState] = useState({
    isReady: false,
    engineType: 'interactive',
  });
  const depolymentInfo = async () => {
    return await DeploymentApiFactory(undefined, window.COORDINATOR_URL)
      .getDeploymentInfo()
      .then(res => {
        const { data } = res;
        if (data) {
          const { engine, storage, frontend } = data;
          //@ts-ignore
          if (engine === 'gart') {
            return 'gart';
          }
          if (engine === 'Hiactor' && storage === 'MutableCSR' && frontend === 'Cypher/Gremlin') {
            return 'interactive';
          }
          return 'groot';
        }
        return 'interactive';
      })
      .catch(error => {
        return 'interactive';
      });
  };

  const checkGraphId = async () => {
    return listGraphs().then(res => {
      let matchGraph: any;
      if (res) {
        if (graphId) {
          matchGraph = res.find(item => item.id === graphId);
          if (!matchGraph) {
            if (graphId !== draftId) {
              notification.error({
                message: 'Graph Instance Not Found',
                description: `Graph Instance ${graphId} Not Found`,
                duration: 3,
              });
            }
          }
        } else {
          matchGraph = res.find(item => {
            return item.status === 'Running';
          });
        }
        return {
          graphs: res,
          graphId: (matchGraph && matchGraph.id) || graphId,
        };
      }
    });
  };
  const setQueryConfig = () => {
    const { GS_ENGINE_TYPE } = window;
    const query_language = Utils.storage.get('query_language');
    const query_initiation = Utils.storage.get('query_initiation');
    if (!query_language) {
      Utils.storage.set('query_language', GS_ENGINE_TYPE === 'interactive' ? 'cypher' : 'gremlin');
    }
    if (!query_initiation) {
      Utils.storage.set('query_initiation', GS_ENGINE_TYPE === 'groot' ? 'Server' : 'Browser');
    }
  };
  useEffect(() => {
    (async () => {
      setCoordinator();
      const engineType = (await depolymentInfo()) as 'interactive' | 'groot';
      setState(preState => {
        return {
          ...preState,
          engineType,
          isReady: true,
        };
      });
      window.GS_ENGINE_TYPE = engineType;

      setQueryConfig();
      /**接着校验可用的graphId */
      const checkedRes = await checkGraphId();
      if (checkedRes) {
        updateStore(draft => {
          draft.graphs = checkedRes.graphs as IGraph[];
          draft.graphId = checkedRes.graphId;
          draft.isReady = true;
        });
        Utils.setSearchParams(
          {
            graph_id: checkedRes.graphId,
          },
          true,
        );
      }
    })();
  }, []);

  const { isReady } = state;

  const _SIDE = getSlots('SIDE_MEU');

  const { layoutBackground } = useCustomToken();
  if (isReady) {
    return (
      <Layout
        sideMenu={[_SIDE, SETTING_MENU]}
        style={{ background: layoutBackground }}
        collapsedConfig={{
          '/querying': true,
          '/explore': true,
        }}
      />
    );
  }

  return <GlobalSpin />;
}

function setCoordinator() {
  const coordinatorURL = Utils.getSearchParams('coordinator');
  if (coordinatorURL) {
    Utils.storage.set('coordinator', coordinatorURL);
  }
  const coordinator = Utils.storage.get<string>('coordinator') || location.origin;
  window.COORDINATOR_URL = coordinator;
  return coordinator;
}
