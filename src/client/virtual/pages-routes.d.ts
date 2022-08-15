export interface Route {
  path: string;
  component: any;
  children?: Route[];
  meta?: Record<string, any>;
}

export const routes: Route[];
export default routes;
