import cpy from 'cpy';

['src/node', 'src/server', 'src/client'].forEach(dir => {
  cpy(['src/shared/*', '!src/shared/tsconfig.json'], dir);
});
