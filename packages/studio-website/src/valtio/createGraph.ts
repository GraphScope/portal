import { proxy, useSnapshot } from "valtio";
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';

export type IStore<T> = T & {
  nodeList: [];
  edgeList: [];
  option:{value:string;label:string;}[],
  isAlert:boolean;
  nodeEdge:string;
  nodeActiveKey:null;
  edgeActiveKey: null;
  graphData:any;
  properties:any;
  nodeItems: {};
  edgeItems: {};
  isChecked:string;
  inputvalues:string;
};
const initialStore: IStore<{}> = {
  nodeList: [],
  edgeList: [],
  option:[],
  isAlert:false,
  nodeEdge:'Node',
  nodeActiveKey:null,
  edgeActiveKey: null,
  graphData:[],
  properties:[],
  nodeItems: {},
  edgeItems: {},
  isChecked:'',
  inputvalues:''
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