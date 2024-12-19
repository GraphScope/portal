import { describe, it, expect, vi } from 'vitest';
import { PropertySet, Property } from '../../src/types/property';
import { generateWHERE } from '../../src/utils/encode';

// 模拟的 Node 类型定义
interface Node {
  nodeKey: string;
  variable: string;
}

describe('generateWHERE', () => {
  const sampleNode: Node = {
    nodeKey: '123',
    variable: 'node1',
  };

  const sampleNode2: Node = {
    nodeKey: '456',
    variable: 'node2',
  };

  const sampleProperty: Property = {
    name: 'age',
    value: 30,
    compare: '>',
    id: '1',
    statement: 'age > 30',
  };

  const sampleProperties: PropertySet = {
    belongId: '123',
    belongType: 'node',
    data: [sampleProperty],
  };

  const sampleProperty2: Property = {
    name: 'height',
    value: 170,
    compare: '=',
    id: '2',
    statement: 'height = 170',
  };

  const sampleProperties2: PropertySet = {
    belongId: '456',
    belongType: 'edge',
    data: [sampleProperty2],
  };

  it('should generate WHERE clause for a single property', () => {
    const nodes = [sampleNode];
    const properties = [sampleProperties];

    const result = generateWHERE(nodes, properties);

    expect(result).toBe('WHERE node1.age > 30');
  });

  it('should handle multiple properties for a single node', () => {
    const propertiesWithMultiple = {
      belongId: '123',
      belongType: 'node',
      data: [
        { ...sampleProperty, statement: 'age > 30' },
        { ...sampleProperty2, statement: 'height = 170' },
      ],
    };

    const nodes = [sampleNode];
    const properties = [propertiesWithMultiple as PropertySet];

    const result = generateWHERE(nodes, properties);

    expect(result).toBe('WHERE node1.age > 30 AND node1.height = 170');
  });

  it('should handle multiple nodes', () => {
    const propertiesForNode1 = {
      belongId: '123',
      belongType: 'node',
      data: [sampleProperty],
    };

    const propertiesForNode2 = {
      belongId: '456',
      belongType: 'edge',
      data: [sampleProperty2],
    };

    const nodes = [sampleNode, sampleNode2];
    const properties = [propertiesForNode1 as PropertySet, propertiesForNode2 as PropertySet];

    const result = generateWHERE(nodes, properties);

    expect(result).toBe('WHERE node1.age > 30\nWHERE node2.height = 170');
  });

  it('should handle empty properties array', () => {
    const nodes = [sampleNode];
    const properties: PropertySet[] = [];

    const result = generateWHERE(nodes, properties);

    expect(result).toBe('');
  });

  it('should handle empty nodes array', () => {
    const properties = [sampleProperties];

    const result = generateWHERE([], properties);

    expect(result).toBe('');
  });

  it('should handle nodes not matching any properties', () => {
    const properties = [sampleProperties];
    const nodes = [sampleNode2]; // Node does not match the property belongId

    const result = generateWHERE(nodes, properties);

    expect(result).toBe('');
  });

  it('should handle properties with no data', () => {
    const propertiesWithNoData: PropertySet = {
      belongId: '123',
      belongType: 'node',
      data: [],
    };

    const nodes = [sampleNode];
    const properties = [propertiesWithNoData];

    const result = generateWHERE(nodes, properties);

    expect(result).toBe('WHERE ');
  });

  it('should handle properties with empty statements', () => {
    const emptyStatementProperty: Property = {
      name: 'empty',
      value: '',
      compare: '',
      id: '3',
      statement: '',
    };

    const propertiesWithEmptyStatement: PropertySet = {
      belongId: '123',
      belongType: 'node',
      data: [emptyStatementProperty],
    };

    const nodes = [sampleNode];
    const properties = [propertiesWithEmptyStatement];

    const result = generateWHERE(nodes, properties);

    expect(result).toBe('WHERE node1.');
  });

  it('should handle properties with complex statements', () => {
    const complexProperty: Property = {
      name: 'complex',
      value: 'complexValue',
      compare: 'LIKE',
      id: '4',
      statement: 'complex LIKE complexValue',
    };

    const complexProperties: PropertySet = {
      belongId: '123',
      belongType: 'node',
      data: [complexProperty],
    };

    const nodes = [sampleNode];
    const properties = [complexProperties];

    const result = generateWHERE(nodes, properties);

    expect(result).toBe('WHERE node1.complex LIKE complexValue');
  });

  it('should handle properties with variable values', () => {
    const variableProperty: Property = {
      name: 'var',
      value: '${value}',
      compare: '=',
      id: '5',
      statement: 'var = ${value}',
    };

    const variableProperties: PropertySet = {
      belongId: '123',
      belongType: 'node',
      data: [variableProperty],
    };

    const nodes = [sampleNode];
    const properties = [variableProperties];

    const result = generateWHERE(nodes, properties);

    expect(result).toBe('WHERE node1.var = ${value}');
  });
});
