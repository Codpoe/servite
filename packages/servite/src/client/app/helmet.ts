import * as helmet from 'react-helmet-async';
// @ts-ignore
export const Helmet = helmet.Helmet || helmet.default?.Helmet;

export const HelmetProvider =
  // @ts-ignore
  helmet.HelmetProvider || helmet.default?.HelmetProvider;
