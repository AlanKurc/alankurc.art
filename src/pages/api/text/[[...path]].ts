import { NextApiHandler } from 'next';

import { pageBlocks, parseRequest } from '../../../lib/pageRequest';
import { renderText } from '../../../lib/textPage';

const text: NextApiHandler = async (req, res) => {
  const route = parseRequest(req.url ?? '/');
  const body = renderText(await pageBlocks(route));

  res.status(route.page === 'missing' ? 404 : 200);
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.setHeader('Vary', 'User-Agent, Accept');
  res.send(body);
};

export default text;
