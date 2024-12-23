import React, { useEffect, useState } from 'react';
import { useContext, IGraph } from './useContext';

import { Layout, Utils, useCustomToken, GlobalSpin } from '@graphscope/studio-components';
import { DeploymentApiFactory } from '@graphscope/studio-server';
import { SIDE_MENU, SETTING_MENU } from './const';

import { listGraphs } from '../pages/instance/lists/service';
import { getSlots } from '../slots';

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
        matchGraph = res.find(item => item.id === graphId);
        if (!matchGraph) {
          matchGraph = res.find(item => {
            return item.status === 'Running';
          });
        }
      }
      const graph_id = Utils.getSearchParams('graph_id');
      if (graph_id === 'DRAFT_GRAPH') {
        return {
          graphs: res || [],
          graphId: 'DRAFT_GRAPH',
        };
      }
      return {
        graphs: res || [],
        graphId: (matchGraph && matchGraph.id) || '',
      };
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

  const handleMenuClick = key => {
    if (key === '/querying' || key === '/importing' || key === '/modeling') {
      updateStore(draft => {
        draft.currentnNav = key;
      });
      const graph_id = Utils.getSearchParams('graph_id') || graphId || '';
      Utils.setSearchParams({ graph_id });
    } else {
      updateStore(draft => {
        draft.currentnNav = key;
      });
    }
  };
  if (isReady) {
    return (
      <Layout
        onMenuClick={handleMenuClick}
        sideMenu={[_SIDE, SETTING_MENU]}
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
  const coordinator =
    Utils.storage.get<string>('coordinator') ||
    (location.origin === 'https://gsp.vercel.app' ? 'http://127.0.0.1:8080' : location.origin);
  window.COORDINATOR_URL = coordinator;
  return coordinator;
}
