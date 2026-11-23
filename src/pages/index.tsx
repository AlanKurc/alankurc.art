import { GetStaticProps } from 'next';

import { Clock } from '../components/Clock';
import { ContributionSkyline } from '../components/ContributionSkyline';
import { IndexList, IndexRow, IndexSection, Lede, ProjectRow, WorkRow } from '../components/Index';
import { JsonLd } from '../components/JsonLd';
import { PageShell } from '../components/PageShell';
import { Name, SiteDescription, SiteUrl } from '../data/bio';
import { Elsewhere, GitHubUser } from '../data/links';
import { SideProjects } from '../data/projects';
import { Work } from '../data/work';
import { Activity, fetchActivity } from '../lib/githubActivity';

const currentJob = Work.find((entry) => entry.end === 'Present');

const profilePage = {
  '@type': 'ProfilePage',
  mainEntity: {
    '@type': 'Person',
    name: Name,
    url: SiteUrl,
    image: `${SiteUrl}/assets/blog/authors/kurc.jpeg`,
    jobTitle: currentJob?.title,
    worksFor: currentJob && {
      '@type': 'Organization',
      name: currentJob.company,
      url: currentJob.link,
    },
    address: { '@type': 'PostalAddress', addressLocality: 'Buenos Aires', addressCountry: 'AR' },
    sameAs: Elsewhere.map((link) => link.href).filter((href) => !href.startsWith('mailto:')),
  },
};

const website = { '@type': 'WebSite', name: Name, url: SiteUrl };

type Props = {
  activity: Activity | null;
};

export default function Home({ activity }: Props) {
  return (
    <PageShell seoDescription={SiteDescription}>
      <JsonLd data={profilePage} />
      <JsonLd data={website} />
      <Lede>
        <p className="plate-inline">
          &#34;Happiness is like a butterfly, which, when pursued, is always just beyond your grasp,
          but which, if you will sit down quietly, may alight upon you&#34;{' '}
          <span className="text-body">- Nathaniel Hawthorne</span>
        </p>
      </Lede>
      <Clock />

      {activity && (
        <IndexSection
          label="github"
          more={{
            href: `https://github.com/${GitHubUser}`,
            label: GitHubUser,
            context: 'on GitHub',
            external: true,
          }}
        >
          <ContributionSkyline activity={activity} />
        </IndexSection>
      )}

      <IndexSection label="projects" more={{ href: '/work', label: 'more', context: 'projects' }}>
        <IndexList>
          {SideProjects.map((project) => (
            <ProjectRow key={project.title} project={project} />
          ))}
        </IndexList>
      </IndexSection>

      <IndexSection label="work" more={{ href: '/work', label: 'more', context: 'work' }}>
        <IndexList>
          {Work.slice(0, 3).map((entry) => (
            <WorkRow key={entry.company} entry={entry} />
          ))}
        </IndexList>
      </IndexSection>

      <IndexSection label="elsewhere">
        <IndexList>
          {Elsewhere.map((link) => (
            <IndexRow
              key={link.key}
              href={link.href}
              external={link.href.startsWith('http')}
              lead={link.key}
              main={link.value}
              trail={<span aria-hidden="true">↗</span>}
            />
          ))}
        </IndexList>
      </IndexSection>
    </PageShell>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const activity = await fetchActivity(GitHubUser);

  return {
    props: { activity },
    revalidate: 3600,
  };
};
