import { queryStatement } from './queryStatement';
export const querySearch = async params => {
  const { config, value } = params;
  const { value: type } = config.find(item => item.type === 'type') || { value: null };
  const { value: label } = config.find(item => item.type === 'label') || { value: null };
  const { value: property } = config.find(item => item.type === 'property') || { value: null };

  // 精确模糊搜索

  if (type === 'Vertex') {
    if (label && !property) {
      return queryStatement(`match (n:${label}) return n`);
    }
    if (label && property) {
      if (value) {
        return queryStatement(`match (n:${label}) where n.${property} CONTAINS "${value}" return n limit 100`);
      } else {
        return queryStatement(`match  (n:${label}) where n.${property} IS NOT NULL return n limit 100`);
      }
    }
    if (!label && property) {
      if (value) {
        return queryStatement(`match (n) where n.${property} CONTAINS "${value}" return n limit 100`);
      } else {
        return queryStatement(`match  (n) where n.${property} IS NOT NULL return n limit 100`);
      }
    }
  }
  if (type === 'Edge') {
    if (label && !property) {
      return queryStatement(`match (a)-[r:${label}]->(b) return a,r,b`);
    }
    if (label && property) {
      if (value) {
        return queryStatement(
          `match (a)-[r:${label}]->(b) where r.${property} CONTAINS "${value}" return a,r,b limit 100`,
        );
      } else {
        return queryStatement(`match (a)-[r:${label}]->(b) where r.${property} IS NOT NULL return a,r,b limit 100`);
      }
    }
    if (!label && property) {
      // if (value) {
      //   return queryStatement(`match (a)-[r]->(b) where r.${property} CONTAINS "${value}" return a,r,b limit 100`);
      // } else {
      //   return queryStatement(`match (a)-[r]->(b) where r.${property} IS NOT NULL return a,r,b limit 100`);
      // }
    }
  }

  return {
    nodes: [],
    edges: [],
  };
};
