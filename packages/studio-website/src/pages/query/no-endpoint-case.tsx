import React, { useEffect, useState } from 'react';
import { queryInfo } from './services';
import { Utils } from '@graphscope/studio-components';
import { Button, Modal, Result } from 'antd';
import { SplitSection } from '@graphscope/studio-components';
import { FormattedMessage } from 'react-intl';
import { ConnectEndpoint } from '@graphscope/studio-query';
const { storage } = Utils;
import { useContext } from '../../layouts/useContext';

interface INoEndpointCaseProps {}

const NoEndpointCase: React.FunctionComponent<INoEndpointCaseProps> = props => {
  const { store } = useContext();
  const { graphId } = store;
  const [state, setState] = useState({
    open: false,
  });

  const getEndpoint = async () => {
    const language =
      Utils.storage.get<'cypher' | 'gremlin'>('query_language') ||
      (window.GS_ENGINE_TYPE === 'interactive' ? 'cypher' : 'gremlin');

    const _endpoint = Utils.storage.get('query_endpoint');
    if (!_endpoint) {
      const { sdk_endpoints } = await queryInfo(graphId || '');
      const endpoint = sdk_endpoints[language];
      if (endpoint) {
        Utils.storage.set('query_endpoint', endpoint);
      } else {
        setState({
          open: true,
        });
      }
    }
  };
  useEffect(() => {
    getEndpoint();
  }, []);
  const { open } = state;
  return (
    <div>
      <Modal title={null} open={open} footer={null} closable={false} width={1000}>
        <SplitSection
          span={8}
          leftSide={
            <Result
              style={{ marginTop: '-12px' }}
              status="403"
              title={<FormattedMessage id="No Available Query Endpoint" />}
              subTitle={
                <FormattedMessage id="Sorry, the system detected that there is no available query endpoint. Please connect query endpoint" />
              }
            />
          }
          rightSide={
            <ConnectEndpoint
              onClose={() =>
                setState({
                  open: false,
                })
              }
              onConnect={() =>
                setState({
                  open: false,
                })
              }
            />
          }
        />
      </Modal>
    </div>
  );
};

export default NoEndpointCase;
