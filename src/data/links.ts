type ElsewhereLink = {
  key: string;
  value: string;
  href: string;
};

export const GitHubUser = 'AlanKurc';
const InstagramUser = 'ku_rc';

export const Elsewhere: ElsewhereLink[] = [
  { key: 'email', value: 'me@alankurc.art', href: 'me@alankurc.art' },
  { key: 'github', value: GitHubUser, href: `https://github.com/${GitHubUser}` },
  { key: 'instagram', value: `@${InstagramUser}`, href: `https://intagram.com/${InstagramUser}` },
  { key: 'linkedin', value: 'alan-kurc', href: 'https://www.linkedin.com/in/alan-kurc' },
];
