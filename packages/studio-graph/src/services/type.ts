export type ServiceQueries<T extends { id: string; query: (...args: any[]) => Promise<any> }> = {
  [K in T['id']]: T extends { id: K } ? T['query'] : never;
};
