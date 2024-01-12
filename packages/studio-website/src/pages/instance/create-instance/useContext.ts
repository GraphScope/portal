import { IUserEdge } from "@antv/graphin";
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
  option:{ value: string; label: string;}[]; /*Source Node Label/Target Node Label options*/
  isAlert:boolean;
  currentType:'node' | 'edge'; /*node or edge*/
  nodeActiveKey:string; /*add node key*/ 
  edgeActiveKey: string; /*add edge key*/ 
  graphData:{
    nodes:{ id: string; label: string; style: any }[];
    edges: IUserEdge[]
  }; /*graphIn data*/
  properties:any; 
  nodeItems: {}; /*node tabs items*/ 
  edgeItems: {}; /*edge tabs items*/ 
  inputvalues:string; /*Choose EngineType input value*/ 
  detail:boolean; /*create or detail */ 
  checked:'table' | 'json' | 'graph'; /** result view */
  currentStep:number;
};
const initialStore: IStore<{}> = {
  nodeList: [], 
  edgeList: [],
  option:[],
  isAlert:false,
  currentType:'node',
  nodeActiveKey:'', 
  edgeActiveKey: '', 
  graphData:{nodes:[],edges:[]},
  properties:[],
  nodeItems: {},
  edgeItems: {},
  inputvalues:'', 
  detail:false, 
  checked:'table',
  currentStep:0
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