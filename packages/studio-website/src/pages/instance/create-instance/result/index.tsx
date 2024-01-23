import * as React from 'react';
import { Segmented, Tag, Card } from 'antd';
import { useContext } from '../useContext';
import { SegmentedValue } from 'antd/es/segmented';
import { cloneDeep } from 'lodash';
import TableList from './table';
import ReactJsonView from './react-json-view';
import GraphInsight from '../create-schema/graph-view';
import ResultSuccess from './result-success'
import ResultFailed from './result-failed'
interface IImportDataProps {}
const Result: React.FunctionComponent<IImportDataProps> = props => {
  const { store, updateStore } = useContext();
  const { checked, nodeItems, edgeItems } = store;
  const getTableData = (items: {},U?:string)=>{
    let data:{ type?:string;label_name:string; property_name?:string; property_type?:string; primary_keys?:string}[] =[]
    Object.values(items).map((item:any)=>{
      if(item?.properties?.length > 0){
        item?.properties?.map((v: { name:string;type:string;primaryKey:boolean },i: number)=>{
          if(i==0){
            data.push({
              type:U,
              label_name:item.label,
              property_name:v.name,
              property_type:v.type,
              primary_keys:v.primaryKey ? 'true' : 'false'
            })
          }else{
            data.push({
              label_name:'',
              property_name:v.name,
              property_type:v.type,
              primary_keys:v.primaryKey ? 'true' : 'false'
            })
          }
        })
      }else{
        data.push({
          type:U,
          label_name:item.label,
        })
      }
    })
    return data
  }
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
        {checked == 'table' ? <TableList data={[...getTableData(cloneDeep(nodeItems),'Node'),...getTableData(cloneDeep(edgeItems),'Edge')]}/> : null}
        {checked == 'json' ? <ReactJsonView reactJson={{node:getTableData(cloneDeep(nodeItems)),edge:getTableData(cloneDeep(edgeItems))}} /> : null}
        {checked == 'graph' ? <GraphInsight /> : null}
      </Card>
      {/* <ResultFailed/>
      <ResultSuccess/> */}
    </div>
  );
};

export default Result;
