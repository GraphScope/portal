import { describe, it, expect, vi } from 'vitest';
import { Edge } from '../../src/types/edge';
import { encodeEdges } from '../../src/utils/encode';

describe('encodeEdges', () => {
  it('should encode a single edge correctly', () => {
    const edges: Edge[] = [
      {
        edgeKey: 'e1',
        isErgodic: false,
        data: {
          label: 'KNOWS',
        },
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
        edgeKey: 'e2',
        isErgodic: false,
        data: {
          label: '',
        },
      },
    ];

    const callback = vi.fn();
    encodeEdges(edges, callback);

    const expectedEdge = {
      ...edges[0],
      statement: undefined,
    };

    expect(callback).toHaveBeenCalledWith(edges[0], expectedEdge);
  });

  it('should encode multiple edges correctly', () => {
    const edges: Edge[] = [
      {
        edgeKey: 'e1',
        isErgodic: false,
        data: {
          label: '',
          data: {
            label: 'FRIEND',
          },
        },
      },
      {
        edgeKey: 'e2',
        isErgodic: false,
        data: {
          label: 'LIKES',
        },
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
        edgeKey: 'e3',
        isErgodic: false,
        // @ts-ignore
        data: {},
      },
    ];

    const callback = vi.fn();
    encodeEdges(edges, callback);

    const expectedEdge = {
      ...edges[0],
      statement: undefined,
    };

    expect(callback).toHaveBeenCalledWith(edges[0], expectedEdge);
  });

  it('should override existing statement', () => {
    const edges: Edge[] = [
      {
        edgeKey: 'e4',
        isErgodic: false,
        statement: ':OLD_STATEMENT',
        data: {
          label: 'NEW_LABEL',
        },
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
      statement: undefined,
    };

    expect(callback).toHaveBeenCalledWith(edges[0], expectedEdge);
  });

  it('should encode edge with different labels', () => {
    const edges: Edge[] = [
      {
        edgeKey: 'e6',
        isErgodic: false,
        data: {
          label: 'LOVES',
        },
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
        edgeKey: 'e7',
        isErgodic: false,
        sourceNode: 'n1',
        targetNode: 'n1',
        data: {
          label: 'SELF_LOOP',
        },
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
    expect(callback).not.toHaveBeenCalled();
  });

  it('should call callback for every edge', () => {
    const edges: Edge[] = [
      {
        edgeKey: 'e8',
        isErgodic: false,
        data: {
          label: 'CONNECTED_TO',
        },
      },
      {
        edgeKey: 'e9',
        isErgodic: false,
        data: {
          label: 'OWNS',
        },
      },
    ];

    const callback = vi.fn();
    encodeEdges(edges, callback);

    expect(callback).toHaveBeenCalledTimes(2);
  });
});
