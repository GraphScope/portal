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
};
const initialStore: IStore<{}> = {
  nodeList: [], 
  edgeList: [],
  option:[], // Source Node Label/Target Node Label options
  isAlert:false,
  nodeEdge:'Node', // Node /Edge change value
  nodeActiveKey:'', // add node key
  edgeActiveKey: '', // add edge key
  graphData:[], // graphIn data
  properties:[],
  nodeItems: {}, // node tabs items
  edgeItems: {}, // edge tabs items
  inputvalues:'', // Choose EngineType input value
  detail:false, // create or detail 
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