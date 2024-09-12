import { describe, it, expect } from 'vitest';
import { Property } from '../../src/types/property';
import { Node } from '../../src/types/node';
import { generateWHERE } from '../../src/utils/encode';

// 模拟 Node 和 Property 类型的数据
const createNode = (variable: string, properties: Property[]): Node => ({
  nodeKey: 'key1',
  variable,
  properties,
  data: { id: '1', data: { label: 'test' }, position: { x: 0, y: 0 } },
});

const createProperty = (name: string, value: string | number, compare: string): Property => ({
  name,
  value,
  compare,
  id: 'prop1',
  statement: `${name} ${compare} ${value}`,
});

describe('generateWHERE', () => {
  it('should return empty WHERE when nodes have no properties', () => {
    const nodes: Node[] = [createNode('n', [])];
    const result = generateWHERE(nodes);
    expect(result).toBe('WHERE ');
  });

  it('should generate correct WHERE for a single node with properties', () => {
    const properties = [createProperty('age', 30, '>'), createProperty('name', 'John', '=')];
    const nodes: Node[] = [createNode('n', properties)];
    const result = generateWHERE(nodes);
    expect(result).toBe('WHERE n.age > 30 AND n.name = John');
  });

  it('should generate correct WHERE for multiple nodes with properties', () => {
    const node1 = createNode('n1', [createProperty('age', 25, '>')]);
    const node2 = createNode('n2', [createProperty('name', 'Alice', '=')]);
    const result = generateWHERE([node1, node2]);
    expect(result).toBe('WHERE n1.age > 25 AND n2.name = Alice');
  });

  it('should handle nodes with no properties', () => {
    const node1 = createNode('n1', [createProperty('age', 25, '>')]);
    const node2 = createNode('n2', []);
    const result = generateWHERE([node1, node2]);
    expect(result).toBe('WHERE n1.age > 25');
  });

  it('should handle missing property statements gracefully', () => {
    const properties = [{ name: 'age', value: 30, compare: '>', id: 'prop1' }] as Property[];
    const nodes: Node[] = [createNode('n', properties)];
    const result = generateWHERE(nodes);
    expect(result).toBe('WHERE n.age > 30');
  });

  it('should handle nodes with missing variable', () => {
    const nodes: Node[] = [{ ...createNode('', [createProperty('age', 30, '>')]) }];
    const result = generateWHERE(nodes);
    expect(result).toBe('WHERE .age > 30');
  });

  it('should return correct WHERE when multiple nodes have mixed property existence', () => {
    const node1 = createNode('n1', [createProperty('age', 30, '>')]);
    const node2 = createNode('n2', []);
    const node3 = createNode('n3', [createProperty('name', 'Alice', '=')]);
    const result = generateWHERE([node1, node2, node3]);
    expect(result).toBe('WHERE n1.age > 30 AND n3.name = Alice');
  });

  it('should handle properties with different comparators correctly', () => {
    const properties = [createProperty('age', 30, '>'), createProperty('name', 'John', '!=')];
    const nodes: Node[] = [createNode('n', properties)];
    const result = generateWHERE(nodes);
    expect(result).toBe('WHERE n.age > 30 AND n.name != John');
  });

  it('should return empty WHERE for an empty node array', () => {
    const result = generateWHERE([]);
    expect(result).toBe('WHERE ');
  });

  it('should handle duplicate property statements', () => {
    const properties = [createProperty('age', 30, '>'), createProperty('age', 30, '>')];
    const nodes: Node[] = [createNode('n', properties)];
    const result = generateWHERE(nodes);
    expect(result).toBe('WHERE n.age > 30 AND n.age > 30');
  });
});
