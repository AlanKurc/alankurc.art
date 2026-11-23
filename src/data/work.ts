export type WorkEntry = {
  company: string;
  title: string;
  start: string;
  end: string;
  link?: string;
};

export const Work: WorkEntry[] = [
  {
    company: 'Mercado Libre',
    title: 'Software Engineer',
    start: '2022',
    end: 'Present',
    link: 'https://www.linkedin.com/company/mercadolibre/',
  },
  {
    company: 'Escuela Da Vinci',
    title: 'Teacher',
    start: '2022',
    end: '2022',
    link: 'https://davinci.edu.ar/',
  },
  {
    company: 'ESET',
    title: 'Full Stack Developer',
    start: '2021',
    end: '2022',
    link: 'http://www.eset.com/',
  },
  {
    company: 'No Limits Design',
    title: 'Frontend Developer',
    start: '2019',
    end: '2021',
    link: 'https://www.nolimitsdesign.com.ar/',
  },
];
