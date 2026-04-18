import { defineTests } from '../../_test-utils';

export default defineTests('browser-history', (t) => {
  t.visible('example-1', { 
    operations: [
      ['BrowserHistory', 'eiu.edu.vn'],
      ['visit', 'google.com'],
      ['visit', 'facebook.com'],
      ['visit', 'youtube.com'],
      ['back', 1],
      ['back', 1],
      ['forward', 1],
      ['visit', 'linkedin.com'],
      ['forward', 2],
      ['back', 2],
      ['back', 7]
    ],
    expected: [null, null, null, null, 'facebook.com', 'google.com', 'facebook.com', null, 'linkedin.com', 'google.com', 'eiu.edu.vn'] 
  });

  t.hidden('only-back', {
    operations: [
      ['BrowserHistory', 'home'],
      ['back', 10],
      ['back', 100]
    ],
    expected: [null, 'home', 'home']
  });

  t.hidden('forward-limit', {
    operations: [
      ['BrowserHistory', 'home'],
      ['forward', 10],
      ['visit', 'a'],
      ['forward', 5],
      ['back', 1],
      ['forward', 100]
    ],
    expected: [null, 'home', null, 'a', 'home', 'a']
  });
});
