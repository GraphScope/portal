import React, { useEffect, useState } from 'react';
import { useContext } from './useContext';
import useWidth from './useWidth';
import { useCustomTheme } from '@graphscope/studio-components';
import { DeploymentApiFactory } from '@graphscope/studio-server';
import { Skeleton } from 'antd';

interface ContainerProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
  footer: React.ReactNode;
}

const SideWidth = 150;
// const ContainerWidth = 1360;
const CollapsedWidth = 60;

const Container: React.FunctionComponent<ContainerProps> = props => {
  const { sidebar, content, footer } = props;
  const { store } = useContext();
  const { collapse } = store;
  const ContainerWidth = useWidth();
  const { containerBackground } = useCustomTheme();
  const [state, setState] = useState({
    isReady: false,
    engineType: 'interactive',
  });
  const depolymentInfo = async () => {
    await DeploymentApiFactory(undefined, location.origin)
      .getDeploymentInfo()
      .then(res => {
        const { data } = res;
        if (data) {
          const { engine, storage, frontend } = data;
          const interactive = engine === 'Hiactor' && storage === 'MutableCSR' && frontend === 'Cypher/Gremlin';
          const engineType = interactive ? 'interactive' : 'groot';
          setState(preState => {
            return {
              ...preState,
              engineType,
              isReady: true,
            };
          });

          window.GS_ENGINE_TYPE = engineType;
        }
      });
  };
  useEffect(() => {
    depolymentInfo();
  }, []);
  const { isReady } = state;

  return (
    <div
      className="gs-root"
      style={{
        // background: '#f5f7f9',
        background: containerBackground,
        display: 'flex',
        alignItems: 'center',
        height: '100vh',
        boxSizing: 'border-box',
        overflowY: 'scroll',
      }}
    >
      <div
        className="gs-container"
        style={{
          boxSizing: 'border-box',
          width: `${ContainerWidth}px`,
          transition: 'all 0.3s ease',
          height: '100%',
          margin: 'auto',
          display: 'flex',
          padding: '24px',
          flexShrink: 0,
          flexWrap: 'nowrap',
        }}
      >
        <div
          className="gs-sidebar"
          style={{
            width: collapse ? `${CollapsedWidth}px` : `${SideWidth}px`,
            transition: 'all 0.3s ease',
            boxSizing: 'border-box',
            overflow: 'hidden',
            flexWrap: 'nowrap',
            position: 'fixed',
            top: '24px',
            bottom: '0px',
          }}
        >
          {isReady ? sidebar : <Skeleton />}
        </div>
        <div
          className="gs-main"
          style={{
            flex: 1,
            boxSizing: 'border-box',
            marginLeft: collapse ? '80px' : `${SideWidth + 24}px`,
            display: 'flex',
            flexDirection: 'column',
            // overflow: 'scroll',
            flexWrap: 'nowrap',
            transition: 'all 0.3s ease',
          }}
        >
          <div
            style={{
              boxSizing: 'border-box',
              flex: 1,
              // background: mode === 'defaultAlgorithm' ? '#fff' : '#161616',
              borderRadius: '12px',
              position: 'relative',
            }}
            className="gs-content"
          >
            {isReady ? content : <Skeleton />}
          </div>
          <div
            className="gs-footer"
            style={{
              padding: '6px 6px',
              fontSize: '12px',
              color: '#ddd',
            }}
          >
            {isReady ? footer : <Skeleton />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Container;
