import { proxy, useSnapshot } from "valtio";

export const creategraphdata = proxy({
    nodeList: [],
    edgeList: [],
    isAlert:false
  });

export const addNode = (val)=>{
    const snap = useSnapshot(state);

}