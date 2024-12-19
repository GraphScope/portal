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
      { id: '1', statement: ':A', variable: 'a' },
      { id: '2', statement: ':B', variable: 'b' },
    ];

    const edges: Edge[] = resetEdgesErgodicState([
      {
        id: 'e1',
        sourceNode: '1',
        targetNode: '2',
        statement: ':r',
        isErgodic: false,
      },
    ]);

    const result = generateMATCH(nodes, edges);
    expect(result).toEqual(['MATCH (a:A)-[:r]->(b:B)']);
  });

  it('should handle multiple edges connecting the same nodes', () => {
    const nodes: Node[] = [
      { id: '1', statement: ':A', variable: 'a' },
      { id: '2', statement: ':B', variable: 'b' },
    ];

    const edges: Edge[] = resetEdgesErgodicState([
      {
        id: 'e1',
        sourceNode: '1',
        targetNode: '2',
        statement: ':r1',
        isErgodic: false,
      },
      {
        id: 'e2',
        sourceNode: '1',
        targetNode: '2',
        statement: ':r2',
        isErgodic: false,
      },
    ]);

    const result = generateMATCH(nodes, edges);
    expect(result).toEqual(['MATCH (a:A)-[:r1]->(b:B)', 'MATCH (a:A)-[:r2]->(b:B)']);
  });

  it('should handle an edge with a property', () => {
    const nodes: Node[] = [
      { id: '1', statement: ':A', variable: 'a' },
      { id: '2', statement: ':B', variable: 'b' },
    ];

    const edges: Edge[] = resetEdgesErgodicState([
      {
        id: 'e1',
        sourceNode: '1',
        targetNode: '2',
        statement: ':r {weight: 2}',
        isErgodic: false,
      },
    ]);

    const result = generateMATCH(nodes, edges);
    expect(result).toEqual(['MATCH (a:A)-[:r1]->(b:B)', 'MATCH (a:A)-[:r2]->(b:B)']);
  });

  it('should handle an empty relations list in nodes', () => {
    const nodes: Node[] = [
      { id: '1', statement: ':A', variable: 'a', outRelations: new Set(), inRelations: new Set() },
    ];

    const edges: Edge[] = resetEdgesErgodicState([]);

    const result = generateMATCH(nodes, edges);
    expect(result).toEqual([]);
  });
});
