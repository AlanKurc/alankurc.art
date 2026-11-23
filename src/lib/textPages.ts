import { AboutExtended } from '../data/bio.ts';
import { Elsewhere, GitHubUser } from '../data/links.ts';
import { FavMedia } from '../data/media.ts';
import { PastProjects, type Project, SideProjects } from '../data/projects.ts';
import { Work, type WorkEntry } from '../data/work.ts';
import { LEVELS } from './activityStats.ts';
import { monthYear } from './date.ts';
import { type ContributionDay, weeklyTotals } from './githubActivity.ts';
import { type Block, type Row, type Run, literal, lowered } from './textPage.ts';

const count = new Intl.NumberFormat('en-US');

const pathTrail = (path: string) => [literal(path, 'faint')];

const pathRow = (label: string, path: string): Row => ({
  lead: [],
  main: [lowered(label, 'faint')],
  trail: pathTrail(path),
  href: path,
});

const workRow = (entry: WorkEntry): Row => ({
  lead: [lowered(`${entry.start}–${entry.end === 'Present' ? 'now' : entry.end}`, 'faint')],
  main: [lowered(entry.company)],
  trail: [lowered(entry.title, 'faint')],
});

const projectRow = (project: Project): Row => ({
  lead: [lowered(project.title)],
  main: [lowered(project.description, 'body')],
  trail: project.href
    ? [literal(new URL(project.href).hostname.replace(/^www\./, ''), 'faint')]
    : [],
  href: project.href,
});

const paragraph = (...runs: Run[]): Block => ({ kind: 'paragraph', runs });

export function homePage(days: ContributionDay[] | null): Block[] {
  const github: Block[] = days
    ? [
        {
          kind: 'art',
          label: 'github',
          more: [literal(`github.com/${GitHubUser}`, 'faint')],
          lines: contributionBars(
            days.map((day) => day.date),
            days.map((day) => day.count),
          ),
        },
      ]
    : [];
  return [
    { kind: 'header' },
    paragraph(
      lowered("building AI at motion — we're hiring!"),
      literal('\n'),
      lowered(
        'exploring what software engineering looks like when agents do most of the typing.',
        'body',
      ),
    ),
    ...github,
    { kind: 'section', label: 'projects', rows: SideProjects.map(projectRow) },
    {
      kind: 'section',
      label: 'work',
      more: pathTrail('/work'),
      rows: Work.slice(0, 3).map(workRow),
    },
    {
      kind: 'section',
      label: 'elsewhere',
      rows: Elsewhere.map((link) => ({
        lead: [lowered(link.key, 'faint')],
        main: [
          literal(
            link.href.startsWith('mailto:') ? link.value : link.href.replace(/^https?:\/\//, ''),
          ),
        ],
        href: link.href,
      })),
    },
  ];
}

export function workPage(): Block[] {
  const mobile = PastProjects.slice(2).map((project) => project.title);
  return [
    { kind: 'header', current: 'work' },
    paragraph(
      lowered(
        'Building AI at Motion. Care about the gap between “it works” and “it feels right”. Usually that’s where the real work is.',
      ),
    ),
    { kind: 'section', label: 'timeline', rows: Work.map(workRow) },
    { kind: 'section', label: 'side projects', rows: SideProjects.map(projectRow) },
    {
      kind: 'section',
      label: 'past',
      rows: PastProjects.slice(0, 2).map((project) => ({
        lead: [lowered(project.title)],
        main: [lowered(project.description, 'body')],
        href: project.href,
      })),
    },
    paragraph(
      lowered(
        `And many mobile apps for companies like ${mobile.slice(0, -1).join(', ')}, and ${mobile.at(-1)}.`,
        'body',
      ),
    ),
  ];
}

export function aboutPage(): Block[] {
  return [
    { kind: 'header', current: 'about' },
    paragraph(lowered(AboutExtended, 'body')),
    {
      kind: 'section',
      label: 'favorite books & tv shows',
      rows: FavMedia.map((media) => ({
        lead: [lowered(media.name)],
        main: [lowered(media.type, 'faint')],
      })),
    },
  ];
}

export function missingPage(): Block[] {
  return [
    { kind: 'header' },
    paragraph(lowered("404. That page isn't here.")),
    { kind: 'section', rows: [pathRow('← home', '/')] },
  ];
}

const stepsPerRow = 2;

export function contributionBars(dates: string[], counts: number[]): Run[][] {
  const weeks = weeklyTotals(dates, counts);
  const peak = Math.max(...weeks.map((week) => week.total));
  const levels = weeks.map(({ total }) =>
    total ? Math.max(1, Math.round((total / peak) * LEVELS)) : 0,
  );
  const bars = Array.from({ length: LEVELS / stepsPerRow }, (_, i) => {
    const floor = LEVELS - stepsPerRow * (i + 1);
    return levels.map((level) => barCell(level, floor));
  });

  let months = '';
  let week = 0;
  dates.forEach((date, i) => {
    if (i > 0 && new Date(`${date}T00:00:00Z`).getUTCDay() === 0) week += 1;
    const label = monthYear(date).slice(0, 3);
    if (date.endsWith('-01') && week + label.length <= weeks.length) {
      months = months.padEnd(week) + label;
    }
  });

  const total = count.format(counts.reduce((sum, value) => sum + value, 0));
  const caption = `${total} contributions`;
  return [
    ...bars,
    [lowered(months, 'faint')],
    [
      literal(total),
      literal(' contributions', 'faint'),
      literal(' '.repeat(Math.max(3, weeks.length - caption.length - 'past year'.length))),
      literal('past year', 'faint'),
    ],
  ];
}

function barCell(level: number, floor: number): Run {
  if (level >= floor + stepsPerRow) return literal('█');
  if (level === floor + 1) return literal('▄');
  return level === 0 && floor === 0 ? literal('·', 'faint') : literal(' ');
}
