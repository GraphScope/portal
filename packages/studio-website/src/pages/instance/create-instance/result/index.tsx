import * as React from 'react';
import { Segmented, Tag, Card } from 'antd';
import { useContext } from '../useContext';
import { SegmentedValue } from 'antd/es/segmented';
import TableList from './table';
import ReactJsonView from './react-json-view';
import GraphInsight from '../create-schema/graph-view';
interface IImportDataProps {}

const Result: React.FunctionComponent<IImportDataProps> = props => {
  const { store, updateStore } = useContext();
  const { checked } = store;
  /** 'Table', 'Json', 'Graph' 切换 */
  const nodeEdgeChange: (value: SegmentedValue) => void = val => {
    updateStore(draft => {
      draft.checked = val == 'Table' ? 'table' : val == 'Json' ? 'json' : 'graph';
    });
  };

  return (
    <div style={{ margin: '16px 0px' }}>
      <Card
        title={
          <>
            {checked == 'json' ? (
              <p>
                恭喜你已经完成图实例的创建，图实例名称为 <Tag color="green">DEFAULT GRAPH</Tag>，类型为
                <Tag color="green">Interactive</Tag>, 有2 种类型的点，1 种类型的边
              </p>
            ) : null}
            {checked == 'table' ? <p>实例名称：{'My GRAPH'}</p> : null}
          </>
        }
        extra={<Segmented options={['Table', 'Json', 'Graph']} defaultValue="Table" onChange={nodeEdgeChange} />}
      >
        {checked == 'table' ? <TableList /> : null}
        {checked == 'json' ? <ReactJsonView reactJson={{}} /> : null}
        {checked == 'graph' ? <GraphInsight /> : null}
      </Card>
    </div>
  );
};

export default Result;
