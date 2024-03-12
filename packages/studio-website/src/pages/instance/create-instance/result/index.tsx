import * as React from 'react';
import { useContext } from '../useContext';
import { Segmented, Card } from 'antd';
import { FormattedMessage } from 'react-intl';
import TableList from './table';
import ReactJsonView from './react-json-view';
import GraphInsight from '../create-schema/graph-view';
interface IImportDataProps {}
const Result: React.FunctionComponent<IImportDataProps> = props => {
  const { store, updateStore } = useContext();
  const { checked, nodeList, edgeList, graphName } = store;

  const handleChange = (value: any) => {
    updateStore(draft => {
      draft.checked = value;
    });
  };

  let Content;

  if (checked === 'table') {
    const nodes = getTableData(nodeList, 'Node');
    const edges = getTableData(edgeList, 'Edge');
    Content = <TableList data={[...nodes, ...edges]} />;
  }
  if (checked == 'json') {
    const node = getTableData(nodeList);
    const edge = getTableData(edgeList);
    Content = <ReactJsonView reactJson={{ node, edge }} />;
  }
  if (checked == 'graph') {
    Content = <GraphInsight />;
  }

  return (
    <div style={{ margin: '16px 0px' }}>
      <Card
        title={
          <p>
            <FormattedMessage id="Instance Name" />: {graphName}
          </p>
        }
        // 'Table', 'Json', 'Graph'
        extra={
          <Segmented
            options={[
              { label: <FormattedMessage id="Table" />, value: 'table' },
              { label: <FormattedMessage id="Json" />, value: 'json' },
              { label: <FormattedMessage id="Graph" />, value: 'graph' },
            ]}
            onChange={handleChange}
          />
        }
      >
        {Content}
      </Card>
    </div>
  );
};

export default Result;

function getTableData(items: {}, U?: string) {
  let data: {
    type?: string;
    label_name: string;
    property_name?: string;
    property_type?: string;
    primary_keys?: string;
  }[] = [];
  // console.log(items, U);

  Object.values(items).map((item: any) => {
    if (item?.properties?.length > 0) {
      item?.properties?.map((v: { name: string; type: string; primaryKey: boolean }, i: number) => {
        if (i == 0) {
          data.push({
            type: U,
            label_name: item.label,
            property_name: v.name,
            property_type: v.type,
            primary_keys: v.primaryKey ? 'true' : 'false',
          });
        } else {
          data.push({
            label_name: '',
            property_name: v.name,
            property_type: v.type,
            primary_keys: v.primaryKey ? 'true' : 'false',
          });
        }
      });
    } else {
      data.push({
        type: U,
        label_name: item.label,
      });
    }
  });
  return data;
}
