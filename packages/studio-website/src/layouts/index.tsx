import React, { useEffect, useState } from 'react';
import { useContext, IGraph } from './useContext';

import { Layout, LogoText, Utils, useCustomToken } from '@graphscope/studio-components';
import { DeploymentApiFactory } from '@graphscope/studio-server';
import { SIDE_MENU, SETTING_MENU } from './const';
import { Flex, Spin, notification } from 'antd';
import { listGraphs } from '../pages/instance/lists/service';
import { SLOTS } from '../slots';
import './index.css';
export default function StudioLayout() {
  const { store, updateStore } = useContext();
  const { graphId, draftId } = store;
  const [state, setState] = useState({
    isReady: false,
    engineType: 'interactive',
  });
  const depolymentInfo = async () => {
    return await DeploymentApiFactory(undefined, location.origin)
      .getDeploymentInfo()
      .then(res => {
        const { data } = res;
        if (data) {
          const { engine, storage, frontend } = data;
          const interactive = engine === 'Hiactor' && storage === 'MutableCSR' && frontend === 'Cypher/Gremlin';
          const engineType = interactive ? 'interactive' : 'groot';
          return engineType;
          // return 'gart';
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
  const _SIDE = [...(SIDE_MENU || []), ...(SLOTS.SIDE_MEU || [])];
  const { buttonBackground } = useCustomToken();
  if (isReady) {
    return <Layout sideMenu={[_SIDE, SETTING_MENU]} style={{ background: buttonBackground }} />;
  }

  return (
    <Flex justify="center" align="center" vertical style={{ height: '100vh' }}>
      <Spin size="large" />
      {/* <LogoText style={{ marginTop: '24px' }} animate={true} /> */}
    </Flex>
  );
}
