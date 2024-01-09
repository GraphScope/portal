import { proxy, useSnapshot } from "valtio";
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';

export type IStore<T> = T & {
  nodeList: {
    label: string;
    children: any;
    key: string;
  }[];
  edgeList: {
    label: string;
    children: any;
    key: string;
  }[];
  option:{value:string;label:string;}[],
  isAlert:boolean;
  nodeEdge:string;
  nodeActiveKey:string;
  edgeActiveKey: string;
  graphData:any;
  properties:any;
  nodeItems: {};
  edgeItems: {};
  inputvalues:string;
  detail:boolean;
  checked:string;
  json_object:object;
};
const initialStore: IStore<{}> = {
  nodeList: [],
  edgeList: [],
  option:[],
  isAlert:false,
  nodeEdge:'Node',
  nodeActiveKey:'',
  edgeActiveKey: '',
  graphData:[],
  properties:[],
  nodeItems: {},
  edgeItems: {},
  inputvalues:'',
  detail:false,
  checked:'table',
  json_object:{
    title: 'Choose EngineType',
    type: 'Create Schema',
  }
};

type ContextType<T> = {
  store: Snapshot<IStore<T>>;
  updateStore: (fn: (draft: IStore<T>) => void) => void;
};

export function useContext<T>(): ContextType<T> {
  const proxyStore = proxy(initialStore) as IStore<T>;
  const store = useSnapshot(proxyStore);
  return {
    store,
    updateStore: (fn: (draft: IStore<T>) => void) => {
      return fn(proxyStore);
    },
  };
}