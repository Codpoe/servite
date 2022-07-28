import path from 'upath';
import fs from 'fs-extra';
import chokidar from 'chokidar';
import cpy from 'cpy';

function toDist(file) {
  return path.normalize(file).replace(/^src\//, 'dist/');
}

if (process.argv[2] === '-w') {
  // copy files in theme to the dist directory whenever they change.
  chokidar
    .watch('src/client/app/**/*.{html,css}')
    .on('change', file => cpy(file, toDist(file)))
    .on('add', file => fs.copy(file, toDist(file)))
    .on('unlink', file => fs.remove(toDist(file)));
} else {
  cpy('src/client/app/**/*.{html,css}', 'dist/client/app');
}
