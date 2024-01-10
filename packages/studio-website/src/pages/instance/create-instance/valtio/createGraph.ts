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
  option:{value:string;label:string;}[], /*Source Node Label/Target Node Label options*/
  isAlert:boolean;
  nodeEdge:string; /*Node /Edge change value*/
  nodeActiveKey:string; /*add node key*/ 
  edgeActiveKey: string; /*add edge key*/ 
  graphData:any; /*graphIn data*/
  properties:any; 
  nodeItems: {}; /*node tabs items*/ 
  edgeItems: {}; /*edge tabs items*/ 
  inputvalues:string; /*Choose EngineType input value*/ 
  detail:boolean; /*create or detail */ 
  checked:string;
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
  checked:'table'
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