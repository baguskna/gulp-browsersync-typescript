const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

// Sass task
function scssTask() {
  return src('app/scss/styles.scss', { sourcemaps: true })
  .pipe(sass())
  .pipe(postcss([cssnano()]))
  .pipe(dest('dist', { sourcemaps: '.' }));
}

// TS task
function tsTask() {
  return tsProject.src()
  .pipe(tsProject()).js
  .pipe(dest("dist", { sourcemaps: '.' }));
}

// Browsersync task
function browserSyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: '.'
    }
  });
  cb();
}

function browserSyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch task
function watchTask() {
  watch('*.html', browserSyncReload);
  watch(['app/scss/**/*.scss', 'app/ts/**/*.ts'], series(scssTask, tsTask, browserSyncReload))
}

// Default gulp task
exports.default = series(
  scssTask,
  tsTask,
  browserSyncServe,
  watchTask
);
