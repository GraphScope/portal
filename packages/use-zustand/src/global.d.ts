import { StoreApi, UseBoundStore } from 'zustand';
import { IStore } from '.';

declare global {
  interface Window {
    GLOBAL_INITIAL_STORE_MAP: Map<string, unknown>;
    GLOBAL_USE_STORE_MAP: Map<string, UseBoundStore<StoreApi<IStore<unknown>>>>;
  }
}

export {};
