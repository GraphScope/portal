import React, { useState, useRef, useEffect } from 'react';
import { theme, Button, Tooltip, Space, Dropdown, Menu, Divider, message as antdMessage, Modal, Alert } from 'antd';
import dayjs from 'dayjs';
import { useIntl, FormattedMessage } from 'react-intl';
import { Utils } from '@graphscope/studio-components';
import { 
  UpOutlined, 
  DownOutlined, 
  DragOutlined, 
  FullscreenOutlined, 
  FullscreenExitOutlined,
  MoreOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EllipsisOutlined,
  DeleteOutlined,
  ShareAltOutlined,
  SaveOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import Editor from '../../statement/editor';
import Result from '../../statement/result';
import { IEditorProps } from '../../statement/typing';
import GraphSelector from './GraphSelector';

const { debounce } = Utils;

// 添加图查询语言错误检测和纠正函数
const detectAndCorrectErrors = (query: string, language: string) => {
  let hasError = false;
  let errorMessage = '';
  let correctedQuery = query;
  let errorLineNumber = 0;
  let errorContext = ''; // 添加上下文信息，帮助用户更好地理解错误
  let errorSeverity: 'warning' | 'error' = 'error'; // 添加错误严重程度
  let multipleCorrections: string[] = []; // 存储多个可能的修正方案
  
  // 类型定义
  type CorrectionFunction = (match: string, ...args: string[]) => string;
  
  interface Mistake {
    wrong: RegExp;
    correct: string | CorrectionFunction;
    description: string;
    context?: string; // 错误上下文描述
    severity?: 'warning' | 'error'; // 错误严重程度
    alternatives?: string[]; // 多个替代方案
  }
  
  // 针对Cypher语法的常见错误
  const cypherMistakes: Mistake[] = [
    // 基础语法关键词错误
    { wrong: /\bmathc\b/i, correct: 'MATCH', description: 'error.typo.match' },
    { wrong: /\bretrun\b/i, correct: 'RETURN', description: 'error.typo.return' },
    { wrong: /\bwehre\b/i, correct: 'WHERE', description: 'error.typo.where' },
    { wrong: /\bwiht\b/i, correct: 'WITH', description: 'error.typo.with' },
    { wrong: /\bcraete\b/i, correct: 'CREATE', description: 'error.typo.create' },
    { wrong: /\bdeleet\b/i, correct: 'DELETE', description: 'error.typo.delete' },
    { wrong: /\bremvoe\b/i, correct: 'REMOVE', description: 'error.typo.remove' },
    { wrong: /\boptionel\b/i, correct: 'OPTIONAL', description: 'error.typo.optional' },
    { wrong: /\bMERG\b/i, correct: 'MERGE', description: 'error.typo.merge' },
    
    // 高级语法错误检测
    { 
      wrong: /\bORDER BY\b(.*)\bDESC\b(.*)\bLIMIT\b/i, 
      correct: (match: string, p1: string, p2: string) => `ORDER BY${p1}DESC${p2}LIMIT`, 
      description: 'error.order.by.syntax', 
      context: 'error.context.order.by.syntax' 
    },
    
    // 括号不匹配检测
    { 
      wrong: /\([^)]*$/, 
      correct: (match: string) => `${match})`, 
      description: 'error.unmatched.parentheses', 
      context: 'error.context.unmatched.parentheses',
      severity: 'error'
    },
    
    // 关系箭头指向错误
    { 
      wrong: /-->/g, 
      correct: '->', 
      description: 'error.relationship.arrow', 
      context: 'error.context.relationship.arrow' 
    },
    { 
      wrong: /<--/g, 
      correct: '<-', 
      description: 'error.relationship.arrow', 
      context: 'error.context.relationship.arrow' 
    },
    
    // 节点标签错误格式
    { 
      wrong: /\(([\w]+):([\w]+\s[\w]+)\)/g, 
      correct: (match: string, p1: string, p2: string) => `(${p1}:\`${p2}\`)`, 
      description: 'error.node.label.spaces', 
      context: 'error.context.node.label.spaces' 
    },
    
    // 缺少RETURN子句
    { 
      wrong: /^(?!.*\bRETURN\b).*\bMATCH\b.*$/i, 
      correct: (match: string) => `${match.trim()} RETURN 1`, 
      description: 'error.missing.return', 
      context: 'error.context.missing.return',
      severity: 'warning'
    },
    
    // 错误的比较操作符
    { 
      wrong: /([a-zA-Z0-9_\.]+)\s+(==|===|!==|!=)\s+([a-zA-Z0-9_\.'"]+)/g, 
      correct: (match: string, p1: string, p2: string, p3: string) => {
        const op = p2 === '==' || p2 === '===' ? '=' : '<>';
        return `${p1} ${op} ${p3}`;
      }, 
      description: 'error.comparison.operator', 
      context: 'error.context.comparison.operator' 
    },
    
    // 使用单引号替代反引号
    { 
      wrong: /\'([^']*)\'/g, 
      correct: (match: string, p1: string) => `"${p1}"`, 
      description: 'error.single.quotes', 
      context: 'error.context.single.quotes',
      severity: 'warning' 
    },
    
    // CASE语句错误
    {
      wrong: /\bCASE\b(?:(?!\bEND\b).)*$/is,
      correct: (match: string) => `${match} END`,
      description: 'error.unclosed.case',
      context: 'error.context.unclosed.case'
    },
    
    // 引号不匹配检测
    {
      wrong: /"([^"\\]*(\\.[^"\\]*)*)$/,
      correct: (match: string) => `${match}"`,
      description: 'error.unmatched.quotes',
      context: 'error.context.unmatched.quotes'
    }
  ];
  
  // 针对Gremlin语法的常见错误
  const gremlinMistakes: Mistake[] = [
    // 基础方法名错误
    { wrong: /\.vertexs\(\)/i, correct: '.vertices()', description: 'error.typo.vertices' },
    { wrong: /\.inVertic(es)?\(\)/i, correct: '.inV()', description: 'error.typo.inV' },
    { wrong: /\.outVertic(es)?\(\)/i, correct: '.outV()', description: 'error.typo.outV' },
    { wrong: /\.vertice\(\)/i, correct: '.V()', description: 'error.typo.V' },
    { wrong: /\.edge\(\)/i, correct: '.E()', description: 'error.typo.E' },
    { wrong: /\.lable\(\)/i, correct: '.label()', description: 'error.typo.label' },
    { wrong: /\.proprety\(/i, correct: '.property(', description: 'error.typo.property' },
    { wrong: /\.addVertic(es|e)\(/i, correct: '.addV(', description: 'error.typo.addV' },
    { wrong: /\.addEdg(es|e)\(/i, correct: '.addE(', description: 'error.typo.addE' },
    
    // 高级方法名错误
    { wrong: /\.valeus\(/i, correct: '.values(', description: 'error.typo.values' },
    { wrong: /\.selectt\(/i, correct: '.select(', description: 'error.typo.select' },
    { wrong: /\.grupBy\(/i, correct: '.groupBy(', description: 'error.typo.groupBy' },
    { wrong: /\.gruopBy\(/i, correct: '.groupBy(', description: 'error.typo.groupBy' },
    { wrong: /\.groupCount\(\)\.by\(/i, correct: '.groupCount().by(', description: 'error.typo.groupCount.by' },
    { wrong: /\.conut\(/i, correct: '.count(', description: 'error.typo.count' },
    
    // 缺少分步调用
    { 
      wrong: /\.has\(['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\)\s*\.\s*has\(/i, 
      correct: (match: string) => match.replace(/\)\s*\.\s*has\(/i, ').has('), 
      description: 'error.redundant.method.chaining', 
      context: 'error.context.redundant.method.chaining',
      severity: 'warning' 
    },
    
    // 参数顺序错误
    { 
      wrong: /\.has\(['"]([^'"]+)['"]\s*\)/i, 
      correct: (match: string, p1: string) => match, 
      description: 'error.incomplete.has', 
      context: 'error.context.incomplete.has',
      alternatives: [`.has('propertyName', eq('value'))`, `.hasLabel('propertyName')`]
    },
    
    // 未关闭括号
    { 
      wrong: /\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*$/,
      correct: (match: string) => `${match})`, 
      description: 'error.unmatched.parentheses', 
      context: 'error.context.unmatched.parentheses' 
    },
    
    // 错误的Lambda表达式
    {
      wrong: /\.filter\(\{\s*it\s*->\s*([^}]+)\s*\}\)/i,
      correct: (match: string, p1: string) => `.filter{it -> ${p1}}`,
      description: 'error.lambda.syntax',
      context: 'error.context.lambda.syntax'
    },
    
    // 错误的as()步骤用法
    {
      wrong: /\.as\(([^)]+)\)\.as\(/i,
      correct: (match: string) => match.replace(/\)\.as\(/i, ', '),
      description: 'error.redundant.as',
      context: 'error.context.redundant.as'
    },
    
    // 错误的withSideEffect用法
    {
      wrong: /\.withSideEffect\(['"]([^'"]+)['"]\s*,\s*([^)]+)\)/i,
      correct: (match: string, p1: string, p2: string) => `.withSideEffect('${p1}', ${p2})`,
      description: 'error.withSideEffect.syntax',
      context: 'error.context.withSideEffect.syntax'
    }
  ];
  
  // 智能上下文感知错误检测（基于当前查询的语境进行更深层次分析）
  const detectContextErrors = (query: string, language: string): Mistake | null => {
    if (language.toLowerCase() === 'cypher') {
      // 检测MERGE语句中的常见错误模式
      if (/\bMERGE\b.*\bWHERE\b/i.test(query)) {
        return {
          wrong: /\b(MERGE.*WHERE.*)\b/i,
          correct: (match) => match.replace(/\bWHERE\b/i, 'ON'),
          description: 'error.merge.where.instead.of.on',
          context: 'error.context.merge.where.instead.of.on',
          severity: 'warning'
        };
      }
      
      // 检测缺少关系方向的模式
      if (/\([^)]+\)-\[[^]]+\]-\([^)]+\)/i.test(query)) {
        return {
          wrong: /\(([^)]+)\)-\[([^]]+)\]-\(([^)]+)\)/i,
          correct: (match: string, node1: string, rel: string, node2: string) => `(${node1})-[${rel}]->(${node2})`,
          description: 'error.missing.relationship.direction',
          context: 'error.context.missing.relationship.direction',
          alternatives: [
            `(node1)-[rel]->(node2)`,
            `(node1)<-[rel]-(node2)`
          ]
        };
      }
      
      // 检测WITH子句后缺少变量
      if (/\bWITH\s*$/i.test(query)) {
        return {
          wrong: /\b(WITH\s*)$/i,
          correct: (match) => `${match} *`,
          description: 'error.incomplete.with',
          context: 'error.context.incomplete.with'
        };
      }
    } else if (language.toLowerCase() === 'gremlin') {
      // 检测错误的traversal起点
      if (!/^\s*g\s*\.\s*V\s*\(/i.test(query) && !/^\s*g\s*\.\s*E\s*\(/i.test(query) && query.trim().length > 0) {
        return {
          wrong: /^(.+)$/,
          correct: (match) => `g.V().${match}`,
          description: 'error.missing.traversal.source',
          context: 'error.context.missing.traversal.source',
          severity: 'warning'
        };
      }
      
      // 检测valueMap()后缺少unfold()
      if (/\.valueMap\(\)(?!\.unfold\(\))/i.test(query)) {
        return {
          wrong: /(\.valueMap\(\))(?!\.unfold\(\))/i,
          correct: (match) => `${match}.unfold()`,
          description: 'error.missing.unfold.after.valueMap',
          context: 'error.context.missing.unfold.after.valueMap',
          severity: 'warning'
        };
      }
    }
    
    return null;
  };
  
  // 根据语言选择检查规则
  const currentMistakes: Mistake[] = language.toLowerCase() === 'cypher' ? cypherMistakes : gremlinMistakes;
  
  // 添加上下文智能检测的错误
  const contextError = detectContextErrors(query, language);
  if (contextError) {
    currentMistakes.push(contextError);
  }
  
  // 计算查询的基本统计信息，帮助识别可能的错误
  const queryStats = {
    length: query.length,
    lines: query.split('\n').length,
    hasOpenParenthesis: (query.match(/\(/g) || []).length,
    hasCloseParenthesis: (query.match(/\)/g) || []).length,
    hasOpenBracket: (query.match(/\[/g) || []).length,
    hasCloseBracket: (query.match(/\]/g) || []).length,
    hasOpenBrace: (query.match(/\{/g) || []).length,
    hasCloseBrace: (query.match(/\}/g) || []).length,
    hasDoubleQuotes: (query.match(/"/g) || []).length,
    hasSingleQuotes: (query.match(/'/g) || []).length,
  };
  
  // 基于统计信息检测额外错误
  if (queryStats.hasOpenParenthesis !== queryStats.hasCloseParenthesis) {
    hasError = true;
    errorMessage = 'error.unbalanced.parentheses';
    errorContext = 'error.context.unbalanced.parentheses';
    errorSeverity = 'error';
    
    // 尝试修复不平衡的括号
    if (queryStats.hasOpenParenthesis > queryStats.hasCloseParenthesis) {
      const diff = queryStats.hasOpenParenthesis - queryStats.hasCloseParenthesis;
      correctedQuery = query + ')'.repeat(diff);
    } else {
      // 可能是多余的闭括号，这种情况比较复杂，暂不自动修复
    }
  }
  
  if (queryStats.hasOpenBracket !== queryStats.hasCloseBracket) {
    hasError = true;
    errorMessage = 'error.unbalanced.brackets';
    errorContext = 'error.context.unbalanced.brackets';
    errorSeverity = 'error';
    
    // 尝试修复不平衡的方括号
    if (queryStats.hasOpenBracket > queryStats.hasCloseBracket) {
      const diff = queryStats.hasOpenBracket - queryStats.hasCloseBracket;
      correctedQuery = query + ']'.repeat(diff);
    }
  }
  
  if (queryStats.hasOpenBrace !== queryStats.hasCloseBrace) {
    hasError = true;
    errorMessage = 'error.unbalanced.braces';
    errorContext = 'error.context.unbalanced.braces';
    errorSeverity = 'error';
    
    // 尝试修复不平衡的大括号
    if (queryStats.hasOpenBrace > queryStats.hasCloseBrace) {
      const diff = queryStats.hasOpenBrace - queryStats.hasCloseBrace;
      correctedQuery = query + '}'.repeat(diff);
    }
  }
  
  // 检查引号是否不平衡（单引号和双引号分别检查）
  if (queryStats.hasDoubleQuotes % 2 !== 0) {
    hasError = true;
    errorMessage = 'error.unbalanced.double.quotes';
    errorContext = 'error.context.unbalanced.quotes';
    errorSeverity = 'error';
    
    // 尝试关闭未闭合的双引号
    correctedQuery = query + '"';
  }
  
  if (queryStats.hasSingleQuotes % 2 !== 0) {
    hasError = true;
    errorMessage = 'error.unbalanced.single.quotes';
    errorContext = 'error.context.unbalanced.quotes';
    errorSeverity = 'error';
    
    // 尝试关闭未闭合的单引号
    correctedQuery = query + "'";
  }
  
  // 检查常见语法错误
  const lines = query.split('\n');
  for (let i = 0; i < lines.length; i++) {
    for (const mistake of currentMistakes) {
      if (mistake.wrong.test(lines[i])) {
        hasError = true;
        errorMessage = mistake.description;
        errorLineNumber = i + 1;
        if (mistake.context) {
          errorContext = mistake.context;
        }
        if (mistake.severity) {
          errorSeverity = mistake.severity;
        }
        
        // 存储多个备选方案
        if (mistake.alternatives && mistake.alternatives.length > 0) {
          multipleCorrections = mistake.alternatives;
        }
        
        // 替换错误
        if (typeof mistake.correct === 'function') {
          // 使用回调函数进行替换
          lines[i] = lines[i].replace(mistake.wrong, mistake.correct as any);
        } else {
          // 使用字符串进行替换
          lines[i] = lines[i].replace(mistake.wrong, mistake.correct);
        }
      }
    }
  }
  
  // 重新组合已修正的查询语句
  if (hasError) {
    correctedQuery = lines.join('\n');
  }
  
  // 检查Cypher特有的问题 - 缺少分号
  if (language.toLowerCase() === 'cypher' && 
      !/;$/.test(query.trim()) && 
      query.trim().length > 0 && 
      !/^(START|EXPLAIN|PROFILE|CREATE INDEX|DROP INDEX)/i.test(query.trim())) {
    if (!query.includes(';')) {
      correctedQuery = query.trim() + ';';
      hasError = true;
      errorMessage = 'error.missing.semicolon.cypher';
      errorSeverity = 'warning'; // 缺少分号通常是警告级别
    }
  }
  
  // 检查Gremlin常见错误 - 未调用next()
  if (language.toLowerCase() === 'gremlin' && 
      !query.trim().endsWith('.next()') && 
      !query.trim().endsWith('.toList()') && 
      !query.trim().endsWith('()') &&
      query.trim().length > 0) {
    hasError = true;
    errorMessage = 'error.missing.next.gremlin';
    errorSeverity = 'warning';
    
    // 提供多个可能的修正方案
    multipleCorrections = [
      query.trim() + '.next()',
      query.trim() + '.toList()',
      query.trim() + '.iterate()'
    ];
    
    correctedQuery = query.trim() + '.next()';
  }
  
  // 智能检查Cypher中的变量引用
  if (language.toLowerCase() === 'cypher') {
    const definedVariables = new Set<string>();
    const usedVariables = new Set<string>();
    
    // 提取定义的变量
    const nodePatterns = query.match(/\((\w+)(?::\w+)?\)/g) || [];
    nodePatterns.forEach(pattern => {
      const match = pattern.match(/\((\w+)(?::\w+)?\)/);
      if (match && match[1]) {
        definedVariables.add(match[1]);
      }
    });
    
    // 提取使用的变量
    const variableUsages = query.match(/\b([a-zA-Z_]\w*)\.[\w]+\b/g) || [];
    variableUsages.forEach(usage => {
      const match = usage.match(/\b([a-zA-Z_]\w*)\.[\w]+\b/);
      if (match && match[1]) {
        usedVariables.add(match[1]);
      }
    });
    
    // 检查是否有变量使用但未定义
    for (const variable of usedVariables) {
      if (!definedVariables.has(variable)) {
        hasError = true;
        errorMessage = 'error.undefined.variable';
        errorContext = 'error.context.undefined.variable';
        errorSeverity = 'error';
        // 这种错误通常需要用户自己解决，不提供自动修正
        break;
      }
    }
  }
  
  return {
    hasError,
    errorMessage,
    correctedQuery,
    errorLineNumber,
    errorContext,
    errorSeverity,
    multipleCorrections: multipleCorrections.length > 0 ? multipleCorrections : undefined
  };
};

// 定义类型
interface ErrorInfo {
  message: string;
  lineNumber?: number;
  errorContext?: string;
  errorSeverity?: 'warning' | 'error';
  multipleCorrections?: string[];
}

export type IQueryCellProps = IEditorProps & {
  /** 是否是当前激活的语句 */
  active: boolean;
  mode?: 'tabs' | 'flow';
  enableImmediateQuery: boolean;
  graphId: string;
  /** 时间戳 */
  timestamp?: number;
  /** 拖拽相关属性 */
  dragHandleProps?: any;
  /** 单元格索引 */
  index?: number;
  /** 全屏状态变化回调 */
  onFullscreen?: (isFullscreen: boolean) => void;
  /** 是否处于全屏状态 */
  isFullscreen?: boolean;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 可用的图数据源列表 */
  graphs?: any[];
  /** 图数据源变化回调 */
  onGraphChange?: (id: string, graphId: string) => void;
  /** 上移单元格回调 */
  onMoveUp?: (id: string) => void;
  /** 下移单元格回调 */
  onMoveDown?: (id: string) => void;
};
const { useToken } = theme;

const QueryCell: React.FC<IQueryCellProps> = props => {
  const {
    onQuery,
    onClose,
    onCancel,
    onSave,
    script,
    id,
    active,
    mode,
    schemaData,
    enableImmediateQuery,
    graphId: propGraphId,
    timestamp,
    language,
    dragHandleProps,
    index,
    onFullscreen,
    isFullscreen: propIsFullscreen,
    style: customStyle,
    graphs = [],
    onGraphChange,
    onMoveUp,
    onMoveDown,
  } = props;
  const { token } = useToken();
  const intl = useIntl();
  const [collapsed, setCollapsed] = useState(false);
  const [localFullscreen, setLocalFullscreen] = useState(false);
  const [cellGraphId, setCellGraphId] = useState(propGraphId);
  
  // 焦点状态
  const [isFocused, setIsFocused] = useState(false);
  const cellRef = useRef<HTMLDivElement>(null);
  
  // 添加自动纠错状态
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);
  const [showCorrection, setShowCorrection] = useState(false);
  const [correctedScript, setCorrectedScript] = useState('');
  
  // 使用 prop 或 local 状态作为实际的全屏状态
  const fullscreen = propIsFullscreen !== undefined ? propIsFullscreen : localFullscreen;

  // 使用cellGraphId作为实际的graphId
  const graphId = cellGraphId;

  useEffect(() => {
    setCellGraphId(propGraphId);
  }, [propGraphId]);

  // 当单元格变为活动状态时自动获取焦点
  useEffect(() => {
    if (active && cellRef.current) {
      cellRef.current.focus();
    }
  }, [active]);

  const borderStyle =
    active && mode === 'flow'
      ? {
          border: `1px solid ${token.colorPrimary}`,
        }
      : {
          border: `1px solid  ${token.colorBorder}`,
        };
  const [state, updateState] = useState({
    data: {},
    isFetching: false,
    startTime: 0,
    endTime: 0,
    abort: false,
  });
  const { data, isFetching, startTime, endTime } = state;
  
  // 使用 Shift+Arrow 快捷键方案
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 检查目标元素是否是输入框或文本区域
      const isInputElement = 
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable;
      
      // 如果事件来自输入元素，不阻止默认行为，让编辑器正常处理
      if (isInputElement) {
        return;
      }
      
      // 只有当当前单元格有焦点或处于活动状态时才处理
      const cellHasFocus = cellRef.current?.contains(document.activeElement as Node);
      
      if (cellHasFocus || active) {
        // Shift+上箭头：上移单元格
        if (e.shiftKey && e.key === 'ArrowUp') {
          e.preventDefault();
          e.stopPropagation();
          if (onMoveUp && typeof index === 'number' && index > 0) {
            onMoveUp(id);
          }
        }
        
        // Shift+下箭头：下移单元格
        if (e.shiftKey && e.key === 'ArrowDown') {
          e.preventDefault();
          e.stopPropagation();
          if (onMoveDown) {
            onMoveDown(id);
          }
        }
      }
    };

    // 使用事件冒泡阶段，让输入元素优先处理事件
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [active, id, onMoveUp, onMoveDown, index]);

  // 改进的焦点处理
  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      // 只需要知道单元格或其子元素是否获得了焦点
      if (cellRef.current?.contains(e.target as Node)) {
        setIsFocused(true);
      }
    };

    const handleBlur = (e: FocusEvent) => {
      // 只有当焦点完全离开单元格时才设置为非焦点状态
      if (cellRef.current && !cellRef.current.contains(e.relatedTarget as Node)) {
        setIsFocused(false);
      }
    };

    // 使用 focusin/focusout 事件，这些事件会冒泡
    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);

    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
    };
  }, []);

  useEffect(() => {
    if (cellRef.current && active && mode === 'flow') {
      cellRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [active]);

  // 检查是否有数据（查询结果）
  const hasQueryResult = () => {
    if (!data) return false;
    
    // 检查图数据
    if ((data as any).nodes && (data as any).nodes.length > 0) return true;
    if ((data as any).edges && (data as any).edges.length > 0) return true;
    
    // 检查表格数据
    if ((data as any).table && (data as any).table.length > 0) return true;
    
    // 检查原始数据
    if ((data as any).raw && 
        ((data as any).raw.records?.length > 0 || 
         (data as any).raw.rows?.length > 0 || 
         Object.keys((data as any).raw).length > 0)) {
      return true;
    }
    
    return false;
  };

  // 修改查询处理函数以添加自动纠错逻辑
  const handleQuery = debounce(async params => {
    // 先清除之前的错误信息和纠正状态
    setErrorInfo(null);
    setShowCorrection(false);
    
    // 自动检测并纠正错误
    const { 
      hasError, 
      errorMessage, 
      correctedQuery, 
      errorLineNumber, 
      errorContext, 
      errorSeverity, 
      multipleCorrections 
    } = detectAndCorrectErrors(
      params.script, 
      typeof language === 'string' ? language : 'cypher' // 确保language是字符串类型
    );
    
    if (hasError) {
      // 如果有错误，显示错误信息和纠正建议
      setCorrectedScript(correctedQuery);
      setErrorInfo({
        message: errorMessage,
        lineNumber: errorLineNumber || undefined,
        errorContext,
        errorSeverity,
        multipleCorrections
      });
      setShowCorrection(true);
      return;
    }
    
    // 正常查询流程
    if (isFetching) {
      onCancel && onCancel(params);
      updateState(preState => {
        return {
          ...preState,
          isFetching: false,
          data: {},
        };
      });
      return;
    }
    updateState(preState => {
      return {
        ...preState,
        isFetching: true,
        startTime: new Date().getTime(),
      };
    });
    // 添加当前cell的graphId
    const res = await onQuery({...params, graphId});
    //@ts-ignore
    updateState(preState => {
      return {
        ...preState,
        data: res,
        isFetching: false,
        endTime: new Date().getTime(),
      };
    });
  }, 500);
   
  // 接受纠正并执行查询
  const acceptCorrection = () => {
    // 使用纠正后的脚本执行查询
    const params = { id, script: correctedScript, language };
    
    // 清除纠正状态
    setShowCorrection(false);
    setErrorInfo(null);
    
    // 执行查询
    handleQuery(params);
  };
  
  // 取消纠正
  const cancelCorrection = () => {
    setShowCorrection(false);
    setErrorInfo(null);
  };
  
  useEffect(() => {
    if (enableImmediateQuery && timestamp) {
      console.log('enableImmediateQuery script', enableImmediateQuery, script, language);
      handleQuery({ id, script, language });
    }
  }, [enableImmediateQuery, timestamp]);

  const isRunning = endTime - startTime < 0;
  const message = isRunning
    ? intl.formatMessage(
        {
          id: "query submmited on {submitTime}. It's running ... ",
        },
        {
          submitTime: dayjs(startTime).format('HH:mm:ss YYYY-MM-DD'),
        },
      )
    : intl.formatMessage(
        {
          id: 'query submmited on {submitTime}. Running {runningTime} ms',
        },
        {
          submitTime: dayjs(startTime).format('HH:mm:ss YYYY-MM-DD'),
          runningTime: endTime - startTime,
        },
      );

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const toggleFullscreen = () => {
    const newFullscreenState = !fullscreen;
    // 如果有外部控制，则调用回调
    if (onFullscreen) {
      onFullscreen(newFullscreenState);
    } else {
      // 否则使用本地状态
      setLocalFullscreen(newFullscreenState);
    }
  };

  // 处理上移单元格
  const handleMoveUp = () => {
    if (onMoveUp && typeof index === 'number' && index > 0) {
      onMoveUp(id);
    }
  };

  // 处理下移单元格
  const handleMoveDown = () => {
    if (onMoveDown) {
      onMoveDown(id);
    }
  };

  // 处理数据源变化
  const handleGraphChange = (newGraphId: string) => {
    setCellGraphId(newGraphId);
    // 通知父组件
    if (onGraphChange) {
      onGraphChange(id, newGraphId);
    }
  };

  // 修改：只要有查询结果就显示折叠/展开按钮，不再受折叠状态影响
  const hasResult = hasQueryResult();
  // 显示结果条件：未折叠 && 有查询结果
  const showResult = !collapsed && hasResult;

  // 计算容器高度 - 根据是否全屏和是否折叠调整
  const containerHeight = fullscreen
    ? 'calc(100vh - 126px)'
    : 'auto';

  // 计算结果区域高度
  const resultHeight = fullscreen
    ? collapsed ? 'auto' : 'calc(100vh - 326px)'
    : collapsed ? 'auto' : '540px';
    
  // 下拉菜单项
  const menuItems = [
    {
      key: 'moveUp',
      icon: <ArrowUpOutlined />,
      label: (
        <span>
          <FormattedMessage id="querycell.move.up" />
          {' '}
          <span style={{ color: token.colorTextSecondary }}>
            <FormattedMessage id="querycell.shortcut.key" />
          </span>
        </span>
      ),
      disabled: index === 0, // 如果是第一个单元格，则禁用上移功能
    },
    {
      key: 'moveDown',
      icon: <ArrowDownOutlined />,
      label: (
        <span>
          <FormattedMessage id="querycell.move.down" />
          {' '}
          <span style={{ color: token.colorTextSecondary }}>
            <FormattedMessage id="querycell.shortcut.key.down" />
          </span>
        </span>
      ),
      disabled: index === undefined || !onMoveDown, // 空值检查确保函数存在
    },
  ];

  return (
    <div
      ref={cellRef}
      style={{
        display: 'flex',
        boxSizing: 'border-box',
        flexDirection: 'column',
        flex: fullscreen ? 1 : 'unset',
        margin: '12px',
        padding: '8px 16px',
        borderRadius: '8px',
        ...borderStyle,
        background: token.colorBgContainer,
        transition: 'all 0.3s ease',
        position: fullscreen ? 'absolute' : 'relative',
        top: fullscreen ? '0' : 'auto',
        left: fullscreen ? '0' : 'auto',
        right: fullscreen ? '0' : 'auto',
        bottom: fullscreen ? 'auto' : 'auto',
        width: 'auto', // 留出页面边距
        height: containerHeight,
        zIndex: fullscreen ? 1000 : 'auto',
        boxShadow: fullscreen ? '0 0 20px rgba(0,0,0,0.2)' : 'none',
        maxHeight: fullscreen ? 'calc(100vh - 126px)' : 'none', // 防止全屏溢出
        overflowY: 'auto',
        overflowX: 'hidden',
        ...customStyle,
      }}
      tabIndex={0} // 使单元格可聚焦
      onClick={() => {
        if (cellRef.current) {
          cellRef.current.focus();
        }
      }}
      onKeyDown={(e) => {
        // 检查目标元素是否是输入框或文本区域
        const isInputElement = 
          e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement ||
          (e.target as HTMLElement)?.isContentEditable;
        
        // 如果事件来自输入元素，不阻止默认行为
        if (isInputElement) {
          return;
        }
        
        // 处理 Shift+Up 和 Shift+Down 快捷键
        if (e.shiftKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
          e.preventDefault();
          e.stopPropagation();
          
          if (e.key === 'ArrowUp' && onMoveUp && typeof index === 'number' && index > 0) {
            onMoveUp(id);
          } else if (e.key === 'ArrowDown' && onMoveDown) {
            onMoveDown(id);
          }
        }
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', position: 'sticky', top: 0, zIndex: 10, background: token.colorBgContainer, padding: '4px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {mode === 'flow' && !fullscreen && (
            <span 
              style={{ 
                cursor: 'grab', 
                marginRight: '8px', 
                display: 'inline-flex', 
                alignItems: 'center',
                padding: '4px',
                borderRadius: '4px',
                backgroundColor: token.colorBgTextHover,
              }}
              {...dragHandleProps}
            >
              <DragOutlined />
            </span>
          )}
          {index !== undefined && (
            <span style={{ marginRight: '8px', fontWeight: 'bold', color: token.colorTextSecondary }}>#{index + 1}</span>
          )}
        </div>
        
        <Space>
          {/* 数据源选择器放在右边 */}
          {graphs && graphs.length > 0 && (
            <div>
              <GraphSelector 
                graphId={graphId} 
                onGraphChange={handleGraphChange} 
                graphs={graphs} 
              />
            </div>
          )}
          
          {/* 折叠/展开按钮 */}
          {hasResult && (
            <Tooltip title={intl.formatMessage({ 
              id: collapsed ? 'querycell.expand.results' : 'querycell.collapse.results' 
            })}>
              <Button 
                type="text" 
                icon={collapsed ? <DownOutlined /> : <UpOutlined />} 
                onClick={toggleCollapse} 
                size="small"
              />
            </Tooltip>
          )}
          
          {/* 全屏按钮 */}
          <Tooltip title={intl.formatMessage({ 
            id: fullscreen ? 'querycell.exit.fullscreen' : 'querycell.fullscreen' 
          })}>
            <Button 
              type="text" 
              icon={fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />} 
              onClick={toggleFullscreen} 
              size="small"
            />
          </Tooltip>
          
          {/* 只保留移动相关功能的下拉菜单 */}
          <Dropdown
            menu={{ 
              items: [
                {
                  key: 'moveUp',
                  icon: <ArrowUpOutlined />,
                  label: (
                    <span>
                      <FormattedMessage id="querycell.move.up" />
                      {' '}
                      <span style={{ color: token.colorTextSecondary }}>
                        <FormattedMessage id="querycell.shortcut.key" />
                      </span>
                    </span>
                  ),
                  disabled: typeof index !== 'number' || index === 0,
                },
                {
                  key: 'moveDown',
                  icon: <ArrowDownOutlined />,
                  label: (
                    <span>
                      <FormattedMessage id="querycell.move.down" />
                      {' '}
                      <span style={{ color: token.colorTextSecondary }}>
                        <FormattedMessage id="querycell.shortcut.key.down" />
                      </span>
                    </span>
                  ),
                  disabled: !onMoveDown,
                },
              ],
              onClick: ({ key }) => {
                if (key === 'moveUp') {
                  handleMoveUp();
                } else if (key === 'moveDown') {
                  handleMoveDown();
                }
              }
            }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Button 
              type="text" 
              icon={<EllipsisOutlined />}
              size="small"
            />
          </Dropdown>
        </Space>
      </div>

      <div 
        style={{ 
          border: `1px solid ${token.colorBorder}`,
          borderRadius: '4px',
          padding: '4px',
          background: active ? token.colorBgContainer : token.colorBgElevated,
          marginBottom: hasResult ? '8px' : '0', // 修改：只要有结果就保留底部间距
        }}
      >
        <Editor
          message={message}
          language={language}
          timestamp={timestamp}
          schemaData={schemaData}
          id={id}
          script={script}
          onClose={onClose}
          onQuery={handleQuery}
          onSave={onSave}
          isFetching={isFetching}
          antdToken={token}
        />
      </div>

      {/* 自动错误检测和纠正UI */}
      {showCorrection && errorInfo && (
        <Alert
          type={errorInfo.errorSeverity || "warning"}
          showIcon
          style={{ marginTop: '16px', marginBottom: '8px' }}
          message={
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                <FormattedMessage id="querycell.error.detected" />
                {errorInfo.lineNumber && errorInfo.lineNumber > 0 && (
                  <span style={{ marginLeft: '8px', fontSize: '12px', color: token.colorTextSecondary }}>
                    <FormattedMessage 
                      id="querycell.error.line" 
                      values={{ line: errorInfo.lineNumber }} 
                    />
                  </span>
                )}
              </div>
              <div style={{ color: token.colorTextSecondary }}>
                <FormattedMessage id={errorInfo.message} />
                {errorInfo.errorContext && (
                  <div style={{ marginTop: '4px', fontSize: '12px' }}>
                    <FormattedMessage id={errorInfo.errorContext} />
                  </div>
                )}
              </div>
              <div style={{ marginTop: '8px', marginBottom: '4px', fontWeight: 'bold' }}>
                <FormattedMessage id="querycell.error.correction.suggestion" />:
              </div>
              <div style={{ 
                background: token.colorBgElevated, 
                padding: '8px', 
                borderRadius: '4px',
                border: `1px solid ${token.colorBorderSecondary}`,
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                maxHeight: '120px',
                overflowY: 'auto'
              }}>
                {correctedScript}
              </div>
              
              {/* 显示多个建议修正方案 */}
              {errorInfo.multipleCorrections && errorInfo.multipleCorrections.length > 0 && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    <FormattedMessage id="querycell.alternative.suggestions" />:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {errorInfo.multipleCorrections.map((correction, index) => (
                      <div 
                        key={index}
                        style={{ 
                          padding: '4px 8px', 
                          background: token.colorBgElevated,
                          border: `1px solid ${token.colorBorderSecondary}`,
                          borderRadius: '4px',
                          fontFamily: 'monospace',
                          cursor: 'pointer',
                          fontSize: '12px',
                          transition: 'all 0.2s'
                        }}
                        onClick={() => {
                          setCorrectedScript(correction);
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.borderColor = token.colorPrimary;
                          e.currentTarget.style.color = token.colorPrimary;
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.borderColor = token.colorBorderSecondary;
                          e.currentTarget.style.color = 'inherit';
                        }}
                      >
                        {correction}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button size="small" onClick={cancelCorrection}>
                  <FormattedMessage id="querycell.cancel.correction" />
                </Button>
                <Button size="small" type="primary" onClick={acceptCorrection}>
                  <FormattedMessage id="querycell.accept.correction" />
                </Button>
              </div>
            </div>
          }
        />
      )}

      {/* 修改：折叠时显示一个提示行 */}
      {hasResult && collapsed && (
        <div 
          style={{ 
            padding: '8px', 
            color: token.colorTextSecondary,
            fontSize: '12px',
            textAlign: 'center',
            backgroundColor: token.colorBgElevated,
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onClick={toggleCollapse}
        >
          <FormattedMessage id="querycell.click.to.expand" />
        </div>
      )}

      {showResult && (
        <div 
          style={{ 
            flex: 1,
            height: resultHeight,
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <Result data={data} isFetching={isFetching} schemaData={schemaData} graphId={graphId} onQuery={onQuery} />
        </div>
      )}
    </div>
  );
};

export default QueryCell; 