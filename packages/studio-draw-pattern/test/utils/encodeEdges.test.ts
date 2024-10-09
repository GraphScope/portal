import { describe, it, expect, vi } from 'vitest';
import { Edge } from '../../src/types/edge';
import { encodeEdges } from '../../src/utils/encode';

describe('encodeEdges', () => {
  it('should encode a single edge correctly', () => {
    const edges: Edge[] = [
      {
        id: 'e1',
        isErgodic: false,
      },
    ];

    const callback = vi.fn();
    encodeEdges(edges, callback);

    const expectedEdge = {
      ...edges[0],
      statement: ':KNOWS',
    };

    expect(callback).toHaveBeenCalledWith(edges[0], expectedEdge);
  });

  it('should handle edge with no label', () => {
    const edges: Edge[] = [
      {
        id: 'e2',
        isErgodic: false,
      },
    ];

    const callback = vi.fn();
    encodeEdges(edges, callback);

    const expectedEdge = {
      ...edges[0],
      statement: '',
    };

    expect(callback).toHaveBeenCalledWith(edges[0], expectedEdge);
  });

  it('should encode multiple edges correctly', () => {
    const edges: Edge[] = [
      {
        id: 'e1',
        isErgodic: false,
      },
      {
        id: 'e2',
        isErgodic: false,
      },
    ];

    const callback = vi.fn();
    encodeEdges(edges, callback);

    expect(callback).toHaveBeenCalledTimes(2);

    expect(callback).toHaveBeenCalledWith(edges[0], {
      ...edges[0],
      statement: ':FRIEND',
    });

    expect(callback).toHaveBeenCalledWith(edges[1], {
      ...edges[1],
      statement: ':LIKES',
    });
  });

  it('should handle edge with empty data', () => {
    const edges: Edge[] = [
      {
        id: 'e3',
        isErgodic: false,
        // @ts-ignore
        dat: {},
      },
    ];

    const callback = vi.fn();
    encodeEdges(edges, callback);

    const expectedEdge = {
      ...edges[0],
      statement: '',
    };

    expect(callback).toHaveBeenCalledWith(edges[0], expectedEdge);
  });

  it('should override existing statement', () => {
    const edges: Edge[] = [
      {
        id: 'e4',
        isErgodic: false,
        statement: ':OLD_STATEMENT',
      },
    ];

    const callback = vi.fn();
    encodeEdges(edges, callback);

    const expectedEdge = {
      ...edges[0],
      statement: ':NEW_LABEL',
    };

    expect(callback).toHaveBeenCalledWith(edges[0], expectedEdge);
  });

  it('should handle edge with missing data', () => {
    const edges: Edge[] = [
      {
        edgeKey: 'e5',
        isErgodic: false,
      } as any, // Simulating incomplete edge object
    ];

    const callback = vi.fn();
    encodeEdges(edges, callback);

    const expectedEdge = {
      ...edges[0],
      statement: '',
    };

    expect(callback).toHaveBeenCalledWith(edges[0], expectedEdge);
  });

  it('should encode edge with different labels', () => {
    const edges: Edge[] = [
      {
        id: 'e6',
        isErgodic: false,
      },
    ];

    const callback = vi.fn();
    encodeEdges(edges, callback);

    const expectedEdge = {
      ...edges[0],
      statement: ':LOVES',
    };

    expect(callback).toHaveBeenCalledWith(edges[0], expectedEdge);
  });

  it('should handle self-loop edge', () => {
    const edges: Edge[] = [
      {
        id: 'e7',
        isErgodic: false,
        sourceNode: 'n1',
        targetNode: 'n1',
      },
    ];

    const callback = vi.fn();
    encodeEdges(edges, callback);

    const expectedEdge = {
      ...edges[0],
      statement: ':SELF_LOOP',
    };

    expect(callback).toHaveBeenCalledWith(edges[0], expectedEdge);
  });

  it('should skip undefined edge', () => {
    const edges = [undefined] as any;

    const callback = vi.fn();
    expect(() => encodeEdges(edges, callback)).not.toThrow();
    expect(callback).toHaveBeenCalledTimes(0);
  });

  it('should call callback for every edge', () => {
    const edges: Edge[] = [
      {
        id: 'e8',
        isErgodic: false,
      },
      {
        id: 'e9',
        isErgodic: false,
      },
    ];

    const callback = vi.fn();
    encodeEdges(edges, callback);

    expect(callback).toHaveBeenCalledTimes(2);
  });
});
