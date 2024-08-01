import { GPE } from '../../types/GPE';

// 目前 GPE 只设计 model.json
export const useDecodeCypher = (cypherWord: string): GPE => {
  return {
    nodes: [],
    edges: [],
    variabels: [],
  };
};
