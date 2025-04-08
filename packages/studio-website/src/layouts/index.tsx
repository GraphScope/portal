import React, { useEffect, useState } from 'react';
import { useContext, IGraph } from './useContext';
import { Layout, Utils, GlobalSpin, useDynamicStyle, useStudioProvier } from '@graphscope/studio-components';
import { DeploymentApiFactory } from '@graphscope/studio-server';
import { SETTING_MENU } from './const';
import { listGraphs } from '../pages/instance/lists/service';
import { getSlots } from '../slots';
import SvgEnToZh from './SvgEnToZh';
import SvgZhToEn from './SvgZhToEn';
import { Button, Tooltip } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
export default function StudioLayout() {
  const { store, updateStore } = useContext();
  const { graphId, draftId } = store;
  const { isLight, locale = 'en-US', updateStudio } = useStudioProvier();
  const [state, setState] = useState({
    isReady: false,
    engineType: 'interactive',
  });

  useDynamicStyle(
    `
    @font-face {
      font-family: 'Geist Sans';
      src: url('https://g.alicdn.com/GraphScope/portal-assets/0.0.2/fonts/Geist-ice.woff2') format('woff2');
      font-weight: 400 500 600 700 800 900;
      font-style: normal;
      font-display: swap;
    }
    `,
    'layoutFontFace',
  );
  const changeTheme = () => {
    const algorithm = isLight ? 'darkAlgorithm' : 'defaultAlgorithm';
    updateStudio({
      algorithm,
    });
  };

  const changeLocale = () => {
    const curLocale = locale === 'en-US' ? 'zh-CN' : 'en-US';
    updateStudio({
      locale: curLocale,
    });
  };
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

    const query_language = Utils.getSearchParams('query_language') || Utils.storage.get('query_language');
    const query_initiation = Utils.getSearchParams('query_initiation') || Utils.storage.get('query_initiation');
    const query_initiation_service =
      Utils.getSearchParams('query_initiation_service') || Utils.storage.get('query_initiation_service');

    if (query_language) {
      Utils.storage.set('query_language', query_language);
    } else {
      Utils.storage.set('query_language', GS_ENGINE_TYPE === 'interactive' ? 'cypher' : 'gremlin');
    }
    if (query_initiation) {
      Utils.storage.set('query_initiation', query_initiation);
    } else {
      Utils.storage.set('query_initiation', GS_ENGINE_TYPE === 'groot' ? 'Server' : 'Browser');
    }
    if (query_initiation_service) {
      Utils.storage.set('query_initiation_service', query_initiation_service);
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
      //这个URL参数不用一直携带着，能够放在localstorage即可
      Utils.removeSearchParams(['coordinator', 'query_language', 'query_initiation_service', 'query_initiation']);
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
        headerSlot={
          <>
            <Tooltip title={locale === 'en-US' ? '切换为中文' : '切换为英文'}>
              <Button type="text" onClick={changeLocale} icon={locale === 'en-US' ? <SvgEnToZh /> : <SvgZhToEn />}>
                {/* 切换主题 */}
              </Button>
            </Tooltip>
            <Tooltip title={isLight ? '切换为暗色主题' : '切换为亮色主题'}>
              <Button type="text" onClick={changeTheme} icon={isLight ? <MoonOutlined /> : <SunOutlined />}>
                {/* 切换主题 */}
              </Button>
            </Tooltip>
          </>
        }
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
