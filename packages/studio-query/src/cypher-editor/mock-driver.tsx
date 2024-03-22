let timer: NodeJS.Timeout;
const MOCK_DATA = {
  nodes: [
    {
      id: 'mock-node-1',
      label: 'person',
      properties: {
        name: 'A',
        age: 29,
      },
    },
    {
      id: 'mock-node-2',
      label: 'person',
      properties: {
        name: 'B',
        age: 29,
      },
    },
    {
      id: 'mock-node-3',
      label: 'person',
      properties: {
        name: 'C',
        age: 29,
      },
    },
  ],
  edges: [
    {
      id: 'e_' + 'mock-edge-1',
      source: 'mock-node-1',
      target: 'mock-node-2',
      label: 'knows',
      properties: {
        weight: 0.8,
      },
    },
    {
      id: 'e_' + 'mock-edge-2',
      source: 'mock-node-2',
      target: 'mock-node-3',
      label: 'knows',
      properties: {
        weight: 0.2,
      },
    },
    {
      id: 'e_' + 'mock-edge-3',
      source: 'mock-node-3',
      target: 'mock-node-1',
      label: 'knows',
      properties: {
        weight: 0.4,
      },
    },
  ],
};
class MockDriver {
  public mock: boolean;

  constructor(uri: string, username?: string, password?: string) {
    this.mock = true;

    return {
      mock: this.mock,
      query: this.query,
    };
  }

  async query(cypher: string): Promise<any> {
    try {
      if (timer) {
        clearTimeout(timer);
      }
      return new Promise(resolve => {
        timer = setTimeout(() => {
          resolve(MOCK_DATA);
        }, 500);
      });
    } catch (error: any) {
      return {
        nodes: [],
        edges: [],
      };
    }
  }
}

export default MockDriver;
