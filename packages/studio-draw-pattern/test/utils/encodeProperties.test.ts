import { Node } from '../../src/types/node';
import { encodeProperties } from '../../src/utils/encode';
import { expect, test, describe, vi } from 'vitest';

describe('encodeProperties', () => {
  test('should encode properties correctly for a single node', () => {
    const nodes: Node[] = [
      {
        nodeKey: '1',
        variable: 'n1',
        properties: [{ name: 'age', compare: '>', value: 30, id: '1' }],
      },
    ];

    const callback = vi.fn();

    encodeProperties(nodes, callback);

    expect(callback).toHaveBeenCalledWith(nodes[0], nodes[0].properties, [
      { name: 'age', compare: '>', value: 30, id: '1', statement: 'age > 30' },
    ]);
  });

  test('should handle multiple properties for a single node', () => {
    const nodes: Node[] = [
      {
        nodeKey: '1',
        variable: 'n1',
        properties: [
          { name: 'age', compare: '>', value: 30, id: '1' },
          { name: 'name', compare: '=', value: 'Alice', id: '2' },
        ],
      },
    ];

    const callback = vi.fn();

    encodeProperties(nodes, callback);

    expect(callback).toHaveBeenCalledWith(nodes[0], nodes[0].properties, [
      { name: 'age', compare: '>', value: 30, id: '1', statement: 'age > 30' },
      { name: 'name', compare: '=', value: 'Alice', id: '2', statement: 'name = Alice' },
    ]);
  });

  test('should handle node with no properties', () => {
    const nodes: Node[] = [
      {
        nodeKey: '1',
        variable: 'n1',
        properties: [],
      },
    ];

    const callback = vi.fn();

    encodeProperties(nodes, callback);

    expect(callback).toHaveBeenCalledWith(nodes[0], [], []);
  });

  test('should handle node with undefined properties', () => {
    const nodes: Node[] = [
      {
        nodeKey: '1',
        variable: 'n1',
      } as Node,
    ];

    const callback = vi.fn();

    encodeProperties(nodes, callback);

    expect(callback).toHaveBeenCalledWith(nodes[0], [], []);
  });

  test('should call callback for each node', () => {
    const nodes: Node[] = [
      {
        nodeKey: '1',
        variable: 'n1',
        properties: [{ name: 'age', compare: '>', value: 30, id: '1' }],
      },
      {
        nodeKey: '2',
        variable: 'n2',
        properties: [{ name: 'height', compare: '>', value: 180, id: '2' }],
      },
    ];

    const callback = vi.fn();

    encodeProperties(nodes, callback);

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith(nodes[0], nodes[0].properties, [
      { name: 'age', compare: '>', value: 30, id: '1', statement: 'age > 30' },
    ]);
    expect(callback).toHaveBeenCalledWith(nodes[1], nodes[1].properties, [
      { name: 'height', compare: '>', value: 180, id: '2', statement: 'height > 180' },
    ]);
  });

  test('should generate correct statement for number properties', () => {
    const nodes: Node[] = [
      {
        nodeKey: '1',
        variable: 'n1',
        properties: [{ name: 'age', compare: '<=', value: 25, id: '1' }],
      },
    ];

    const callback = vi.fn();

    encodeProperties(nodes, callback);

    expect(callback).toHaveBeenCalledWith(nodes[0], nodes[0].properties, [
      { name: 'age', compare: '<=', value: 25, id: '1', statement: 'age <= 25' },
    ]);
  });

  test('should generate correct statement for string properties', () => {
    const nodes: Node[] = [
      {
        nodeKey: '1',
        variable: 'n1',
        properties: [{ name: 'name', compare: '=', value: 'Bob', id: '2' }],
      },
    ];

    const callback = vi.fn();

    encodeProperties(nodes, callback);

    expect(callback).toHaveBeenCalledWith(nodes[0], nodes[0].properties, [
      { name: 'name', compare: '=', value: 'Bob', id: '2', statement: 'name = Bob' },
    ]);
  });

  test('should handle nodes without variable', () => {
    const nodes: Node[] = [
      {
        nodeKey: '1',
        properties: [{ name: 'age', compare: '>', value: 30, id: '1' }],
      } as Node,
    ];

    const callback = vi.fn();

    encodeProperties(nodes, callback);

    expect(callback).toHaveBeenCalledWith(nodes[0], nodes[0].properties, [
      { name: 'age', compare: '>', value: 30, id: '1', statement: 'age > 30' },
    ]);
  });

  test('should handle nodes with different types of compare operators', () => {
    const nodes: Node[] = [
      {
        nodeKey: '1',
        variable: 'n1',
        properties: [
          { name: 'age', compare: '>=', value: 20, id: '1' },
          { name: 'name', compare: '!=', value: 'Charlie', id: '2' },
        ],
      },
    ];

    const callback = vi.fn();

    encodeProperties(nodes, callback);

    expect(callback).toHaveBeenCalledWith(nodes[0], nodes[0].properties, [
      { name: 'age', compare: '>=', value: 20, id: '1', statement: 'age >= 20' },
      { name: 'name', compare: '!=', value: 'Charlie', id: '2', statement: 'name != Charlie' },
    ]);
  });

  test('should work when no nodes are passed', () => {
    const nodes: Node[] = [];

    const callback = vi.fn();

    encodeProperties(nodes, callback);

    expect(callback).not.toHaveBeenCalled();
  });
});
