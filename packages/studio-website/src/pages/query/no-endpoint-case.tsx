import React, { useEffect, useState } from 'react';
import { queryEndpoint } from './services';
import { Utils } from '@graphscope/studio-components';
import { Button, Modal, Result } from 'antd';
import { SplitSection } from '@graphscope/studio-components';
import { FormattedMessage } from 'react-intl';
import { ConnectEndpoint } from '@graphscope/studio-query';
const { storage } = Utils;

interface INoEndpointCaseProps {}

const NoEndpointCase: React.FunctionComponent<INoEndpointCaseProps> = props => {
  const [state, setState] = useState({
    open: false,
  });
  const getEndpoint = async () => {
    const { cypher_endpoint, gremlin_endpoint } = await queryEndpoint();
    const { GS_ENGINE_TYPE } = window;

    const language =
      storage.get<'cypher' | 'gremlin'>('query_language') || (GS_ENGINE_TYPE === 'interactive' ? 'cypher' : 'gremlin');
    const endpoint =
      storage.get<string>('query_endpoint') || (GS_ENGINE_TYPE === 'interactive' ? cypher_endpoint : gremlin_endpoint);
    const initiation =
      storage.get<'Server' | 'Browser'>('query_initiation') ||
      (GS_ENGINE_TYPE === 'interactive' ? 'Browser' : 'Server');

    storage.set('query_endpoint', endpoint);
    storage.set('query_language', language);
    storage.set('query_initiation', initiation);
    storage.set('query_username', '');
    storage.set('query_password', '');
    console.log('endpoint....', endpoint);
    if (!endpoint) {
      setState({
        open: true,
      });
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
