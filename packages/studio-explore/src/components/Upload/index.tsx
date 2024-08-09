import * as React from 'react';
import { Button, Table, TableProps } from 'antd';
import { useContext, getDataMap } from '@graphscope/studio-graph';
import { Utils } from '@graphscope/studio-components';
interface IUploadProps {}
interface Params {
  name: string;
  type?: 'nodes' | 'edges';
  weight?: string;
  [key: string]: any;
}

export async function query(params: Params) {
  const baseURL = 'http://localhost:7777/api/query';

  const url = new URL(baseURL);
  url.search = new URLSearchParams(params).toString();
  return await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        return res.data;
      }
      return {
        nodes: [],
        edges: [],
      };
    })
    .catch(err => {
      return {
        data: {
          nodes: [],
          edges: [],
        },
      };
    });
}
const Upload: React.FunctionComponent<IUploadProps> = props => {
  const { updateStore } = useContext();
  const [state, setState] = React.useState<{
    lists: any[];
    isReady: boolean;
    columns: any[];
  }>({
    lists: [],
    isReady: false,
    columns: [],
  });
  const handleClick = async () => {
    const res = await query({
      name: 'Paper',
      type: 'nodes',
    });

    updateStore(draft => {
      draft.graphId = 'workflow';
      draft.data = res;
      draft.source = res;
      draft.dataMap = getDataMap(res);
      draft.schema = Utils.generatorSchemaByGraphData(res);
    });
  };

  React.useEffect(() => {
    query({
      name: 'Paper',
    }).then(res => {
      setState(preState => {
        const columns = Object.keys(res[0]).map(key => {
          return {
            title: key,
            dataIndex: key,
            key: key,
          };
        });
        return {
          ...preState,
          lists: res,
          isReady: true,
          columns,
        };
      });
    });
  }, []);
  const { lists } = state;

  const columns = ['title'].map(key => {
    return {
      title: key,
      dataIndex: key,
      key: key,
    };
  });
  console.log(state);

  return (
    <div>
      <Table columns={columns} dataSource={lists} />
      <Button type="primary" style={{ width: '100%' }} onClick={handleClick}>
        Upload & Generate Graph
      </Button>
    </div>
  );
};

export default Upload;
