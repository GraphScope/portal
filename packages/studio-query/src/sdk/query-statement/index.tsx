import React, { useState } from 'react';

import { Statement } from '../..';
import type { IStatement } from '../..';
import { CypherDriver, GremlinDriver } from '@graphscope/studio-driver';
import ConnectEndpoint, { IConnectEndpointProps } from './connect-endpoint';
import { StudioProvier } from '@graphscope/studio-components';

import locales from '../../locales';

const driver_config: Record<string, any> = {};

export const getDriver = async (language: 'cypher' | 'gremlin' = 'cypher', endpoint: string) => {
  const { gremlin_driver, cypher_driver } = driver_config;
  if (language === 'cypher') {
    if (!cypher_driver) {
      driver_config.cypher_driver = new CypherDriver(endpoint);
    }
    return driver_config.cypher_driver;
  }
  if (language === 'gremlin') {
    if (!gremlin_driver) {
      driver_config.gremlin_driver = new GremlinDriver(endpoint);
    }
    return driver_config.gremlin_driver;
  }
};

export interface IQueryStatementProps {
  enableImmediateQuery?: boolean;
  mode?: 'flow' | 'tabs';
  id?: string;
  timestamp?: number;
  graphId?: string;
  schemaData?: { nodes: any[]; edges: any[] };
  script?: string;
  language?: 'cypher' | 'gremlin';
  endpoint?: string;
  onQuery?: (params: any) => void;
}
const QueryStatement = (props: IQueryStatementProps) => {
  const {
    enableImmediateQuery = false,
    mode = 'flow',
    id = '',
    timestamp = Date.now(),
    graphId = '',
    schemaData = { nodes: [], edges: [] },
    script = 'Match (n) return n limit 10',
    onQuery,
  } = props || {};
  const [state, setState] = useState({
    language: props.language || 'cypher',
    endpoint: props.endpoint || '127.0.0.1:7687',
  });
  const { language, endpoint } = state;

  const onQueryByEndpoint = async (params: IStatement) => {
    const { language } = params;

    const driver = await getDriver(language, endpoint);
    //@ts-ignore
    return driver.query(params.script);
  };
  const onCancel = async (params: IStatement) => {
    const { language } = params;
    const driver = await getDriver(language, endpoint);
    driver.close();
  };
  const onConnect: IConnectEndpointProps['onConnect'] = params => {
    setState(preState => {
      return {
        ...preState,
        endpoint: params.endpoint,
        language: params.language as 'cypher' | 'gremlin',
      };
    });
  };

  if (!onQuery && (!endpoint || !language)) {
    return (
      <StudioProvier locales={locales}>
        <ConnectEndpoint onConnect={onConnect} />
      </StudioProvier>
    );
  }

  return (
    <StudioProvier locales={locales}>
      <Statement
        language={language}
        enableImmediateQuery={enableImmediateQuery}
        mode={mode}
        active={true}
        id={id}
        timestamp={timestamp}
        graphId={graphId}
        schemaData={schemaData}
        script={script}
        onQuery={onQuery || onQueryByEndpoint}
        onCancel={onCancel}
      />
    </StudioProvier>
  );
};

export default QueryStatement;
