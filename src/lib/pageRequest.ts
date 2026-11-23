import { GitHubUser } from '../data/links.ts';
import { fetchContributionDays } from './githubActivity.ts';
import type { Block } from './textPage.ts';
import { aboutPage, homePage, missingPage, workPage } from './textPages.ts';

type Page = 'home' | 'work' | 'about' | 'missing';
export type Route = { page: Page };

const pages = new Map<string, Page>([
  ['', 'home'],
  ['index', 'home'],
  ['work', 'work'],
  ['about', 'about'],
]);

// next start hands an API route the URL from before the middleware's rewrite, without the path
// param, and a direct call has the /api/text or /api/markdown one, so the page path comes from
// either form of the URL.
export function parseRequest(url: string): Route {
  const { pathname } = new URL(url, 'http://localhost');
  const path = pathname
    .replace(/^\/api\/(?:text|markdown)(?=\/|$)/, '')
    .replace(/\.md$/i, '')
    .replace(/^\/|\/$/g, '');
  return { page: pages.get(path) ?? 'missing' };
}

export async function pageBlocks(route: Route): Promise<Block[]> {
  switch (route.page) {
    case 'home':
      return homePage(await fetchContributionDays(GitHubUser));
    case 'work':
      return workPage();
    case 'about':
      return aboutPage();
    case 'missing':
      return missingPage();
  }
}
