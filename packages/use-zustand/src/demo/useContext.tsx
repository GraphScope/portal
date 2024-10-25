import { useContext as useZustandContext } from '../index';
export interface IStore {
  count: number;
  name: string;
}
export const initialStore: IStore = {
  count: 0,
  name: 'hello',
};
export const useContext = () => useZustandContext<IStore>();
