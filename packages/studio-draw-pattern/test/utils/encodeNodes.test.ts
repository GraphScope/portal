import { describe, expect, test, vi } from 'vitest';
import { Node } from '../../src/types/node';
import { encodeNodes } from '../../src/utils/encode';

describe('encodeNodes', () => {
  test('should encode a single node correctly', () => {
    const nodes: Node[] = [
      {
        id: '1',
        variable: 'n1',
        data: {
          id: '1',
          position: { x: 0, y: 0 }, // 添加 position
          data: { label: 'Person' },
        },
        properties: [],
      },
    ];

    const callback = vi.fn();

    encodeNodes(nodes, callback);

    const expectedNode = {
      ...nodes[0],
      statement: ':Person',
    };

    expect(callback).toHaveBeenCalledWith(nodes[0], expectedNode);
  });

  test('should handle multiple nodes', () => {
    const nodes: Node[] = [
      {
        id: '1',
        variable: 'n1',
        data: {
          id: '1',
          position: { x: 0, y: 0 },
          data: { label: 'Person' },
        },
        properties: [],
      },
      {
        id: '2',
        variable: 'n2',
        data: {
          id: '2',
          position: { x: 1, y: 1 },
          data: { label: 'Car' },
        },
        properties: [],
      },
    ];

    const callback = vi.fn();

    encodeNodes(nodes, callback);

    const expectedNode1 = { ...nodes[0], statement: ':Person' };
    const expectedNode2 = { ...nodes[1], statement: ':Car' };

    expect(callback).toHaveBeenCalledWith(nodes[0], expectedNode1);
    expect(callback).toHaveBeenCalledWith(nodes[1], expectedNode2);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test('should handle nodes with no label', () => {
    const nodes: Node[] = [
      {
        id: '1',
        variable: 'n1',
        data: {
          id: '1',
          position: { x: 0, y: 0 },
          data: { label: '' },
        },
        properties: [],
      },
    ];

    const callback = vi.fn();

    encodeNodes(nodes, callback);

    const expectedNode = { ...nodes[0], statement: '' };

    expect(callback).toHaveBeenCalledWith(nodes[0], expectedNode);
  });

  test('should handle nodes with undefined label', () => {
    const nodes: Node[] = [
      {
        id: '1',
        variable: 'n1',
        data: {
          id: '1',
          position: { x: 0, y: 0 },
          // @ts-ignore
          data: {},
        },
        properties: [],
      },
    ];

    const callback = vi.fn();

    encodeNodes(nodes, callback);

    const expectedNode = { ...nodes[0], statement: '' };

    expect(callback).toHaveBeenCalledWith(nodes[0], expectedNode);
  });

  test('should not break if node.data is undefined', () => {
    const nodes: Node[] = [
      {
        id: '1',
        variable: 'n1',
        properties: [],
      } as Node,
    ];

    const callback = vi.fn();

    encodeNodes(nodes, callback);

    const expectedNode = { ...nodes[0], statement: '' };

    expect(callback).toHaveBeenCalledWith(nodes[0], expectedNode);
  });

  test('should not break if node.data.data is undefined', () => {
    const nodes: Node[] = [
      {
        nodeKey: '1',
        variable: 'n1',
        data: {
          id: '1',
          position: { x: 0, y: 0 },
        },
        properties: [],
      } as unknown as Node,
    ];

    const callback = vi.fn();

    encodeNodes(nodes, callback);

    const expectedNode = { ...nodes[0], statement: '' };

    expect(callback).toHaveBeenCalledWith(nodes[0], expectedNode);
  });

  test('should handle nodes with no properties', () => {
    const nodes: Node[] = [
      {
        id: '1',
        variable: 'n1',
        data: {
          id: '1',
          position: { x: 0, y: 0 },
          data: { label: 'Animal' },
        },
      },
    ];

    const callback = vi.fn();

    encodeNodes(nodes, callback);

    const expectedNode = { ...nodes[0], statement: ':Animal' };

    expect(callback).toHaveBeenCalledWith(nodes[0], expectedNode);
  });

  test('should handle node with only nodeKey and variable', () => {
    const nodes: Node[] = [
      {
        id: '1',
        variable: 'n1',
      } as Node,
    ];

    const callback = vi.fn();

    encodeNodes(nodes, callback);

    const expectedNode = { ...nodes[0], statement: '' };

    expect(callback).toHaveBeenCalledWith(nodes[0], expectedNode);
  });

  test('should call callback for each node in array', () => {
    const nodes: Node[] = [
      {
        id: '1',
        variable: 'n1',
        data: {
          id: '1',
          position: { x: 0, y: 0 },
          data: { label: 'Person' },
        },
      },
      {
        id: '2',
        variable: 'n2',
        data: {
          id: '2',
          position: { x: 1, y: 1 },
          data: { label: 'Animal' },
        },
      },
    ];

    const callback = vi.fn();

    encodeNodes(nodes, callback);

    expect(callback).toHaveBeenCalledTimes(2);
  });

  test('should work when no nodes are passed', () => {
    const nodes: Node[] = [];

    const callback = vi.fn();

    encodeNodes(nodes, callback);

    expect(callback).not.toHaveBeenCalled();
  });
});
