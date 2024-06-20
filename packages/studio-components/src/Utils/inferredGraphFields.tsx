export function inferredGraphFields(header: string[]) {
  const idKeys = new Set([
    'id',
    '_id',
    's_id',
    't_id',
    `"id"`,
    'uid',
    'uuid',
    'key',
    'ident',
    'vertexid',
    'vertex_id',
    'identifier',
    'unique_id',
  ]);
  const sourceKeys = new Set([
    'source',
    'src',
    'src_id',
    'srcid',
    'from',
    'start',
    `"src_id"`,
    'source_node',
    'sourcenode',
    'sourceid',
    'origin',
    'originid',
  ]);
  const targetKeys = new Set([
    'target',
    'dst',
    'dst_id',
    'dstid',
    'to',
    'end',
    `"dst_id"`,
    'target_node',
    'targetid',
    'target_id',
    'destination',
  ]);

  const idPattern = /\b[a-zA-Z]+[_a-zA-Z0-9]*id\b/i;

  const potentialIdFields: string[] = [];

  let sourceField, targetField, idField, type;

  // 遍历头部字段以确定字段类型
  header.forEach(key => {
    const lowerKey = key.toLowerCase(); // 忽略大小写进行比较
    if (sourceKeys.has(lowerKey)) {
      sourceField = key;
    }
    if (targetKeys.has(lowerKey)) {
      targetField = key;
    }
    if (idKeys.has(lowerKey)) {
      idField = key;
    }
    if (idPattern.test(key)) {
      potentialIdFields.push(key);
    }
  });

  // 根据匹配到的字段数量来确定是Edge还是Vertex
  if (potentialIdFields.length >= 2) {
    // 如果有两个或更多的匹配字段，我们假定第一个是source，第二个是target
    [sourceField, targetField] = potentialIdFields;
    type = 'Edge';
  } else {
    // 如果没有匹配到ID字段，根据是否有 sourceField 和 targetField 来判断是点表还是边表
    if (sourceField && targetField) {
      type = 'Edge';
    } else {
      type = 'Vertex';
    }
  }

  return {
    idField,
    sourceField,
    targetField,
    type,
  };
}
