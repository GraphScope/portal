import * as React from 'react';
import { QueryStatement } from '@graphscope/studio-query';
import { getDriver } from '../import-data/services';
interface IQueryDataProps {}

const QueryData: React.FunctionComponent<IQueryDataProps> = props => {
  const handleQuery = async (params: any) => {
    const driver = await getDriver();
    const data = await driver.queryData(params.script);
    return data;
  };
  return <QueryStatement language="cypher" onQuery={handleQuery} />;
};

export default QueryData;
