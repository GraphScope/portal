import { describe, it, expect } from 'vitest';
import { Node } from '../../src/types/node';
import { Edge } from '../../src/types/edge';
import { generateMATCH } from '../../src/utils/encode';

// Helper function to reset edge ergodicity for tests
const resetEdgesErgodicState = (edges: Edge[]) => {
  return edges.map(edge => ({ ...edge, isErgodic: false }));
};

describe('generateMATCH', () => {
  it('should return an empty array if there are no edges', () => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const result = generateMATCH(nodes, edges);
    expect(result).toEqual([]);
  });

  it('should generate a single MATCH statement for one node and one edge', () => {
    const nodes: Node[] = [
      { nodeKey: '1', statement: ':A', variable: 'a' },
      { nodeKey: '2', statement: ':B', variable: 'b' },
    ];

    const edges: Edge[] = resetEdgesErgodicState([
      {
        edgeKey: 'e1',
        sourceNode: '1',
        targetNode: '2',
        statement: ':r',
        data: { variable: 'r' },
        isErgodic: false,
      },
    ]);

    const result = generateMATCH(nodes, edges);
    expect(result).toEqual(['MATCH (a:A)-[:r]->(b:B)']);
  });

  it('should handle multiple edges connecting the same nodes', () => {
    const nodes: Node[] = [
      { nodeKey: '1', statement: ':A', variable: 'a' },
      { nodeKey: '2', statement: ':B', variable: 'b' },
    ];

    const edges: Edge[] = resetEdgesErgodicState([
      {
        edgeKey: 'e1',
        sourceNode: '1',
        targetNode: '2',
        statement: ':r1',
        data: { variable: 'r1' },
        isErgodic: false,
      },
      {
        edgeKey: 'e2',
        sourceNode: '1',
        targetNode: '2',
        statement: ':r2',
        data: { variable: 'r2' },
        isErgodic: false,
      },
    ]);

    const result = generateMATCH(nodes, edges);
    expect(result).toEqual(['MATCH (a:A)-[:r1]->(b:B)', 'MATCH (a:A)-[:r2]->(b:B)']);
  });

  it('should handle an edge with a property', () => {
    const nodes: Node[] = [
      { nodeKey: '1', statement: ':A', variable: 'a' },
      { nodeKey: '2', statement: ':B', variable: 'b' },
    ];

    const edges: Edge[] = resetEdgesErgodicState([
      {
        edgeKey: 'e1',
        sourceNode: '1',
        targetNode: '2',
        statement: ':r {weight: 2}',
        data: { variable: 'r' },
        isErgodic: false,
      },
    ]);

    const result = generateMATCH(nodes, edges);
    expect(result).toEqual(['MATCH (a:A)-[:r {weight: 2}]->(b:B)']);
  });

  it('should generate a MATCH for a chain of nodes and edges', () => {
    const nodes: Node[] = [
      { nodeKey: '1', statement: ':A', variable: 'a' },
      { nodeKey: '2', statement: ':B', variable: 'b' },
      { nodeKey: '3', statement: ':C', variable: 'c' },
    ];

    const edges: Edge[] = resetEdgesErgodicState([
      {
        edgeKey: 'e1',
        sourceNode: '1',
        targetNode: '2',
        statement: ':r1',
        data: { variable: 'r1' },
        isErgodic: false,
      },
      {
        edgeKey: 'e2',
        sourceNode: '2',
        targetNode: '3',
        statement: ':r2',
        data: { variable: 'r2' },
        isErgodic: false,
      },
    ]);

    const result = generateMATCH(nodes, edges);
    expect(result).toEqual(['MATCH (a:A)-[:r1]->(b:B)-[:r2]->(c:C)']);
  });

  it('should stop traversing if the edge isErgodic is true', () => {
    const nodes: Node[] = [
      { nodeKey: '1', statement: ':A', variable: 'a' },
      { nodeKey: '2', statement: ':B', variable: 'b' },
    ];

    const edges: Edge[] = resetEdgesErgodicState([
      {
        edgeKey: 'e1',
        sourceNode: '1',
        targetNode: '2',
        statement: ':r',
        data: { variable: 'r' },
        isErgodic: true, // Edge is already ergodic
      },
    ]);

    const result = generateMATCH(nodes, edges);
    expect(result).toEqual([]);
  });

  it('should handle loops in the graph', () => {
    const nodes: Node[] = [
      { nodeKey: '1', statement: ':A', variable: 'a' },
      { nodeKey: '2', statement: ':B', variable: 'b' },
    ];

    const edges: Edge[] = resetEdgesErgodicState([
      {
        edgeKey: 'e1',
        sourceNode: '1',
        targetNode: '2',
        statement: ':r1',
        data: { variable: 'r1' },
        isErgodic: false,
      },
      {
        edgeKey: 'e2',
        sourceNode: '2',
        targetNode: '1',
        statement: ':r2',
        data: { variable: 'r2' },
        isErgodic: false,
      },
    ]);

    const result = generateMATCH(nodes, edges);
    expect(result).toEqual(['MATCH (a:A)-[:r1]->(b:B)', 'MATCH (b:B)-[:r2]->(a:A)']);
  });

  it('should handle multiple relationships between the same pair of nodes', () => {
    const nodes: Node[] = [
      { nodeKey: '1', statement: ':A', variable: 'a' },
      { nodeKey: '2', statement: ':B', variable: 'b' },
    ];

    const edges: Edge[] = resetEdgesErgodicState([
      {
        edgeKey: 'e1',
        sourceNode: '1',
        targetNode: '2',
        statement: ':r1',
        data: { variable: 'r1' },
        isErgodic: false,
      },
      {
        edgeKey: 'e2',
        sourceNode: '1',
        targetNode: '2',
        statement: ':r2',
        data: { variable: 'r2' },
        isErgodic: false,
      },
    ]);

    const result = generateMATCH(nodes, edges);
    expect(result).toEqual(['MATCH (a:A)-[:r1]->(b:B)', 'MATCH (a:A)-[:r2]->(b:B)']);
  });

  it('should handle an empty relations list in nodes', () => {
    const nodes: Node[] = [
      { nodeKey: '1', statement: ':A', variable: 'a', outRelations: new Set(), inRelations: new Set() },
    ];

    const edges: Edge[] = resetEdgesErgodicState([]);

    const result = generateMATCH(nodes, edges);
    expect(result).toEqual([]);
  });

  it('should throw an error if targetNode does not exist', () => {
    const nodes: Node[] = [{ nodeKey: '1', statement: '(A)', variable: 'a' }];

    const edges: Edge[] = resetEdgesErgodicState([
      {
        edgeKey: 'e1',
        sourceNode: '1',
        targetNode: '2', // Node 2 doesn't exist
        statement: '[r]',
        data: { variable: 'r' },
        isErgodic: false,
      },
    ]);

    expect(() => generateMATCH(nodes, edges)).toThrowError('targetNode is not exist');
  });

  it('should throw an error if sourceNode does not exist', () => {
    const nodes: Node[] = [{ nodeKey: '2', statement: ':B', variable: 'b' }];

    const edges: Edge[] = resetEdgesErgodicState([
      {
        edgeKey: 'e1',
        sourceNode: '1', // Node 1 doesn't exist
        targetNode: '2',
        statement: ':r',
        data: { variable: 'r' },
        isErgodic: false,
      },
    ]);

    expect(() => generateMATCH(nodes, edges)).toThrowError('sourceNode is not exist');
  });
});
