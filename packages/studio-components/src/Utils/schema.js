"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatorSchemaByGraphData = void 0;
var defaultlabelKey = 'label';
/**
 * 通过 graphData 生成 Schema
 * @param graphData 图数据
 */
var generatorSchemaByGraphData = function (graphData, defaultOptions) {
    var nodes = graphData.nodes, edges = graphData.edges;
    var nodeSchemas = new Map();
    var edgeSchemas = new Map();
    var _a = defaultOptions || {}, nodeLabelFromProperties = _a.nodeLabelFromProperties, edgeLabelFromProperties = _a.edgeLabelFromProperties;
    /**
     * 递归提取属性
     * @param {object} data - 要提取属性的对象
     * @param {string} [prefix] - 用于嵌套对象属性的前缀
     * @returns {Array} - 提取后的属性数组
     */
    var extractProperties = function (data, prefix) {
        if (prefix === void 0) { prefix = ''; }
        var properties = [];
        for (var key in data) {
            if (!data.hasOwnProperty(key))
                continue;
            var value = data[key];
            var prefixedKey = prefix ? "".concat(prefix, ".").concat(key) : key;
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                properties.push.apply(properties, extractProperties(value, prefixedKey));
            }
            else {
                properties.push({ name: prefixedKey, type: getType(value) });
            }
        }
        return properties;
    };
    /**
     * 获取值的类型
     * @param {any} value - 要获取类型的值
     * @returns {string} - 值的类型
     */
    var getType = function (value) {
        if (value === null)
            return 'null';
        if (Array.isArray(value))
            return 'array';
        if (value instanceof Date)
            return 'date';
        if (!isNaN(value) && typeof value !== 'boolean')
            return 'number';
        if (typeof value === 'string' && isValidDate(value))
            return 'date';
        return typeof value;
    };
    /**
     * 检查字符串是否为有效日期
     * @param {string} dateStr - 要检查的字符串
     * @returns {boolean} - 是否为有效日期
     */
    var isValidDate = function (dateStr) {
        var date = Date.parse(dateStr);
        return !isNaN(date) && new Date(dateStr).toISOString() === dateStr;
    };
    var getLabel = function (entity, labelKey, labelKeyFromProperties) {
        if (labelKeyFromProperties && entity.data[labelKeyFromProperties]) {
            return entity.data[labelKeyFromProperties];
        }
        if (labelKey) {
            return entity[labelKey];
        }
        return 'undefined';
    };
    var nodeMap = new Map(nodes.map(function (node) { return [node.id, node]; }));
    nodes.forEach(function (node) {
        var label = getLabel(node, defaultlabelKey, nodeLabelFromProperties);
        if (!nodeSchemas.has(label)) {
            var nodeSchema = {
                label: label,
                properties: extractProperties(node.data),
            };
            nodeSchemas.set(label, nodeSchema);
        }
    });
    edges.forEach(function (edge) {
        var label = getLabel(edge, defaultlabelKey, edgeLabelFromProperties);
        var currentSource = nodeMap.get(edge.source);
        var currentTarget = nodeMap.get(edge.target);
        if (!currentSource || !currentTarget) {
            console.warn("\u6570\u636E\u4E0D\u5408\u6CD5, \u627E\u4E0D\u5230 ".concat(!currentSource ? "Source ID\uFF1A".concat(edge.source) : "Target ID\uFF1A".concat(edge.target)));
            return;
        }
        if (!edgeSchemas.has(label)) {
            var edgeSchema = {
                label: label,
                source: getLabel(currentSource, defaultlabelKey, nodeLabelFromProperties),
                target: getLabel(currentTarget, defaultlabelKey, nodeLabelFromProperties),
                properties: extractProperties(edge.data),
            };
            edgeSchemas.set(label, edgeSchema);
        }
    });
    return {
        nodes: Array.from(nodeSchemas.values()),
        edges: Array.from(edgeSchemas.values()),
    };
};
exports.generatorSchemaByGraphData = generatorSchemaByGraphData;
