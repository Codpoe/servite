import { Page, Route, SSREntry, SSREntryRender } from '../../shared/types';

export const render: SSREntryRender;

export const pages: Page[];

export const routes: Route[];

export const routerHandler: SSREntry['routerHandler'];
