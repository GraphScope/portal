import { languages } from 'monaco-editor';

export const conf: languages.LanguageConfiguration = {
  comments: {
    lineComment: '//',
    blockComment: ['/*', '*/'],
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: '`', close: '`' },
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: '`', close: '`' },
  ],
};

export const language: languages.IMonarchLanguage = {
  defaultToken: '',
  tokenPostfix: '.gremlin',
  ignoreCase: true,

  brackets: [
    { open: '{', close: '}', token: 'delimiter.curly' },
    { open: '[', close: ']', token: 'delimiter.bracket' },
    { open: '(', close: ')', token: 'delimiter.parenthesis' },
  ],

  keywords: [
    'V',
    'E',
    'out',
    'in',
    'both',
    'has',
    'hasLabel',
    'limit',
    'order',
    'by',
    'select',
    'count',
    'filter',
    'map',
    'dedup',
    'outE',
    'inE',
    'bothE',
  ],

  builtinLiterals: ['true', 'false', 'null'],
  builtinFunctions: [
    'values',
    'keys',
    'id',
    'label',
    'property',
    'outV',
    'inV',
    'bothV',
    'sum',
    'mean',
    'min',
    'max',
    'coalesce',
    'is',
    'not',
    'range',
    'fold',
  ],

  operators: ['+', '-', '*', '/', '%', '^', '=', '<>', '<', '>', '<=', '>='],

  escapes: /\\(?:[tbnrf\\"'`]|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  digits: /\d+/,
  octaldigits: /[0-7]+/,
  hexdigits: /[0-9a-fA-F]+/,

  tokenizer: {
    root: [[/[{}[\]()]/, '@brackets'], { include: 'common' }],
    common: [
      { include: '@whitespace' },
      { include: '@numbers' },
      { include: '@strings' },

      [/:[a-zA-Z_][\w]*/, 'type.identifier'],

      [
        /[a-zA-Z_][\w]*(?=\()/,
        {
          cases: {
            '@builtinFunctions': 'predefined.function',
            '@keywords': 'keyword',
            '@default': 'identifier',
          },
        },
      ],

      [/`/, 'identifier.escape', '@identifierBacktick'],

      [/[;,.:|]/, 'delimiter'],
      [/[\+\-\*\/\^%]+/, 'delimiter.operator'],
      [/[\!<>\?=\|&]/, 'delimiter'],
    ],
    numbers: [
      [/-?(@digits)[eE](-?(@digits))?/, 'number.float'],
      [/-?(@digits)?\.(@digits)([eE]-?(@digits))?/, 'number.float'],
      [/-?0x(@hexdigits)/, 'number.hex'],
      [/-?0(@octaldigits)/, 'number.octal'],
      [/-?(@digits)/, 'number'],
    ],
    strings: [
      [/"([^"\\]|\\.)*$/, 'string.invalid'],
      [/'([^'\\]|\\.)*$/, 'string.invalid'],
      [/"/, 'string', '@stringDouble'],
      [/'/, 'string', '@stringSingle'],
    ],
    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment'],
    ],
    comment: [
      [/\/\/.*/, 'comment'],
      [/[^/*]+/, 'comment'],
      [/\*\//, 'comment', '@pop'],
      [/[/*]/, 'comment'],
    ],
    stringDouble: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string'],
      [/\\./, 'string.invalid'],
      [/"/, 'string', '@pop'],
    ],
    stringSingle: [
      [/[^\\']+/, 'string'],
      [/@escapes/, 'string'],
      [/\\./, 'string.invalid'],
      [/'/, 'string', '@pop'],
    ],
    identifierBacktick: [
      [/[^\\`]+/, 'identifier.escape'],
      [/@escapes/, 'identifier.escape'],
      [/\\./, 'identifier.escape.invalid'],
      [/`/, 'identifier.escape', '@pop'],
    ],
  },
};

export function registerGremlinLanguage(): void {
  languages.register({ id: 'gremlin' });
  languages.setMonarchTokensProvider('gremlin', language);
  languages.setLanguageConfiguration('gremlin', conf);

  languages.registerCompletionItemProvider('gremlin', {
    triggerCharacters: ['.'],
    provideCompletionItems: function (model, position) {
      const lineContent = model.getLineContent(position.lineNumber);
      const textBeforeCursor = lineContent.slice(0, position.column - 1).trim();

      // 提取最后一个词
      const lastWord = extractLastWord(textBeforeCursor);

      // 根据最后一个词生成补全建议
      const suggestions = generateSuggestionsForLastWord(lastWord);

      return { suggestions: suggestions };
    },
  });
}

// 提取文本中的最后一个词
function extractLastWord(text) {
  // 移除所有括号及其内容
  const cleanText = text.replace(/\(.*?\)/g, '');
  // 按空白字符和句点分割文本，过滤掉空白字符
  const words = cleanText.split(/\s|\./).filter(Boolean);
  return words.length > 0 ? words[words.length - 1] : '';
}

const project = ['id', 'label', 'constant', 'valueMap', 'values', 'elementMap', 'select'];

const aggregate = ['count', 'fold', 'sum', 'min', 'max', 'mean', 'group', 'groupCount'];

const filter = [
  'hasId',
  'hasLabel',
  'has',
  'hasNot',
  'is',
  'where',
  'not',
  'dedup',
  'order',
  'limit',
  'coin',
  'sample',
  'union',
];
const common = [...aggregate, ...filter, ...project];

const vertexStep = ['outV', 'inV', 'otherV', 'bothV'];
const edgeStep = ['outE', 'inE', 'bothE', 'out', 'in', 'both'];

const StepMap = {};
[...vertexStep, 'out', 'in', 'both'].forEach(item => {
  StepMap[item] = [...edgeStep, ...common];
});

['outE', 'inE', 'bothE'].forEach(item => {
  StepMap[item] = [...vertexStep, ...common];
});

function generateSuggestionsForLastWord(lastWord) {
  const contextSpecificSuggestions = {
    g: ['V', 'E'],
    V: [...edgeStep, 'match', ...common],
    E: [...vertexStep, ...common],
    ...StepMap,
  };

  // 获取具体上下文的补全建议
  const specificSuggestions = contextSpecificSuggestions[lastWord] || [];
  return specificSuggestions.map(key => {
    return {
      label: key,
      kind: languages.CompletionItemKind.Function,
      documentation: key,
      insertText: `${key}()`,
    };
  });
}
