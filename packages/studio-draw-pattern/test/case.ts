export const case1 =
  "MATCH (keanu:Person {name:'Keanu Reeves'})\
  RETURN keanu.name AS name, keanu.born AS born";

export const case2 =
  'MATCH (people:Person)\
  RETURN people\
  LIMIT 5';

export const case3 =
  'MATCH (bornInEighties:Person)\
  WHERE bornInEighties.born >= 1980 AND bornInEighties.born < 1990\
  RETURN bornInEighties.name as name, bornInEighties.born as born\
  ORDER BY born DESC';

export const case4 =
  "MATCH (m:Movie {title: 'The Matrix'})<-[d:DIRECTED]-(p:Person)\
  RETURN p.name as director";

export const case5 =
  "MATCH (tom:Person {name:'Tom Hanks'})-[r]->(m:Movie)\
  RETURN type(r) AS type, m.title AS movie";

export const case6 =
  "MATCH (:Person {name:'Tom Hanks'})-[r:!ACTED_IN]->(m:Movie)\
  Return type(r) AS type, m.title AS movies";

export const case7 =
  "MATCH (tom:Person {name:'Tom Hanks'})--{2}(colleagues:Person)\
  RETURN DISTINCT colleagues.name AS name, colleagues.born AS bornIn\
  ORDER BY bornIn\
  LIMIT 5";

export const case8 =
  "MATCH (p:Person {name:'Tom Hanks'})--{1,4}(colleagues:Person)\
  RETURN DISTINCT colleagues.name AS name, colleagues.born AS bornIn\
  ORDER BY bornIn, name\
  LIMIT 5";

export const case9 =
  'MATCH p=shortestPath(\
  (:Person {name:"Keanu Reeves"})-[*]-(:Person {name:"Tom Hanks"})\
  )\
  RETURN p';

export const case10 =
  "MATCH (:Person {name: 'Keanu Reeves'})-[:ACTED_IN]->(:Movie)<-[:ACTED_IN]-(coActor:Person),\
  (coActor) - [: ACTED_IN] -> (: Movie)<-[: ACTED_IN] - (:Person { name: 'Tom Hanks' })\
  RETURN DISTINCT coActor.name AS coActor";
