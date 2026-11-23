import assert from 'node:assert/strict';
import { test } from 'node:test';

import { parseRequest } from './pageRequest.ts';

test('a request names its page with or without the route prefix and .md', () => {
  const page = (url: string) => parseRequest(url).page;
  assert.deepEqual(
    [
      '/index.md',
      '/api/text',
      '/api/markdown/work.md?x=1',
      '/notes/nope.md',
      '/api/texts',
    ].map(page),
    ['home', 'home', 'work', 'missing', 'missing'],
  );
});
