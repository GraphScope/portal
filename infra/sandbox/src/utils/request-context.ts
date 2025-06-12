import { AsyncLocalStorage } from "async_hooks";

export type RequestContext = {
  authorization?: string;
  xContainerId?: string;
  userId?: string;
  [key: string]: any;
};

const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

export function runWithContext<T>(context: RequestContext, fn: () => T) {
  return asyncLocalStorage.run(context, fn);
}

export function getContext(): RequestContext {
  return asyncLocalStorage.getStore() || {};
} 