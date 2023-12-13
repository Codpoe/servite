import { LoaderFunction } from 'servite/client';

export interface LoaderData {
  list: number[];
  total: number;
}

export const loader: LoaderFunction = (): LoaderData => {
  return {
    list: [0, 1, 2],
    total: 3,
  };
};
