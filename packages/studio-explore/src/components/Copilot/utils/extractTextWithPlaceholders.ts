export function extractTextWithPlaceholders(input) {
  // 使用正则表达式匹配所有的cypher代码块
  const cypherRegex = /```cypher\s*(.*?)\s*```/gs;
  const matches = [...input.matchAll(cypherRegex)];

  let textWithPlaceholders: { type: 'text' | 'cypher'; content: string }[] = [];
  let lastIndex = 0;
  // 遍历匹配到的cypher代码块
  for (const match of matches) {
    // 提取当前cypher代码块之前的文本部分
    const textBefore = input.substring(lastIndex, match.index).trim();
    if (textBefore) {
      // 如果文本部分不为空，则将其加入数组作为文本类型
      textWithPlaceholders.push({ type: 'text', content: textBefore });
    }
    // 提取当前cypher代码块，并将其加入数组作为cypher类型
    const cypherQuery = match[1].trim();
    textWithPlaceholders.push({ type: 'cypher', content: cypherQuery });
    lastIndex = match.index + match[0].length;
  }
  // 处理最后一个cypher代码块之后可能的文本部分
  const textAfter = input.substring(lastIndex).trim();
  if (textAfter) {
    textWithPlaceholders.push({ type: 'text', content: textAfter });
  }

  return textWithPlaceholders;
}
