import { IUserEdge } from "@antv/graphin";
import { proxy, useSnapshot } from "valtio";
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';

export type IStore<T> = T & {
  [x:string]:any;
  nodeList: {
    label: JSX.Element;
    children: any;
    key: string;
  }[];
  edgeList: {
    label: JSX.Element;
    children: any;
    key: string;
  }[];
   /** Source Node Label/Target Node Label options */
  option:{ value: string; label: string;}[];
  isAlert:boolean;
  /** node or edge */
  currentType:'node' | 'edge'; 
  /** add node key */ 
  nodeActiveKey:string; 
  /** add edge key */ 
  edgeActiveKey: string; 
  /** graphIn data */
  graphData:{
    nodes:{ id: string; label: string; style: any }[];
    edges: IUserEdge[]
  };
  /** node tabs items */ 
  nodeItems: {};
   /**edge tabs items */ 
  edgeItems: {};
  /** create or detail */ 
  detail:boolean;
  /** result view */
  checked:'table' | 'json' | 'graph';
  currentStep:number;
  /** 实例创建是否成功 */
  createInstaseResult:true | false;
};
export const initialStore: IStore<{}> = {
  nodeList: [], 
  edgeList: [],
  option:[],
  isAlert:false,
  currentType:'node',
  nodeActiveKey:'', 
  edgeActiveKey: '', 
  graphData:{nodes:[],edges:[]},
  nodeItems: {},
  edgeItems: {},
  detail:false, 
  checked:'table',
  currentStep:0,
  createInstaseResult:false
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