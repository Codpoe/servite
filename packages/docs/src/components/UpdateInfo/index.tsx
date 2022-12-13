import { useAppState } from 'servite/client';
import { DocsRepoInfo } from '@/types';
import { DOCS_REPO_INFO } from '@/constants';
import { Link } from '../Link';
import { Pencil } from '../Icons';

/**
 * Based on https://github.com/vuejs/vuepress/blob/master/packages/%40vuepress/theme-default/components/PageEdit.vue
 */
function createEditLink(
  { repo, branch = 'master', dir }: DocsRepoInfo,
  path: string
) {
  repo = repo.replace(/\/$/, '');
  dir = dir?.replace(/\/$/, '');
  path = `/${path}`;

  if (repo.includes('bitbucket.org')) {
    return (
      repo +
      `/src` +
      `/${branch}` +
      `${dir ? '/' + dir : ''}` +
      path +
      `?mode=edit&spa=0&at=${branch}&fileviewer=file-view-default`
    );
  }

  if (repo.includes('gitlab.com')) {
    return repo + `/-/edit` + `/${branch}` + (dir ? '/' + dir : '') + path;
  }

  repo = /^[a-z]+:/i.test(repo) ? repo : `https://github.com/${repo}`;

  return repo + '/edit' + `/${branch}` + `${dir ? '/' + dir : ''}` + path;
}

export function UpdateInfo() {
  const { pageData } = useAppState();

  const editLink = pageData?.filePath
    ? createEditLink(DOCS_REPO_INFO, pageData.filePath)
    : '';

  const lastUpdated = pageData?.meta?.updatedTime
    ? new Date(pageData.meta.updatedTime).toLocaleString()
    : '';

  if (!editLink && !lastUpdated) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center sm:space-x-8 text-sm">
      {editLink && (
        <Link className="flex items-center font-medium" to={editLink}>
          <Pencil className="mr-1" />
          Edit this page on GitHub
        </Link>
      )}
      {lastUpdated && (
        <div>
          <span className="mr-1 text-c-text-2">Last updated</span>
          <span className="text-c-text-1">{lastUpdated}</span>
        </div>
      )}
    </div>
  );
}
