const gulp = require("gulp");
const log = require("fancy-log");
const del = require("del");
const less = require("gulp-less");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const tsify = require("tsify");
const webserver = require("gulp-webserver");
const watchify = require('watchify');

const watchedBrowserify = watchify(browserify({
  basedir: '.',
  debug: true,
  entries: ['src/app.ts'],
  cache: {},
  packageCache: {}
}).plugin(tsify));

const paths = {
  tizen: ["src/index.html", "src/tizen/*"],
  image: ["src/image/**/*"]
};

gulp.task("clean", function() {
  log.warn("deleting dist folder");
  return del(["dist"]);
});

gulp.task("copy-tizen", function() {
  log.info("copying tizen project");
  return gulp.src(paths.tizen).pipe(gulp.dest("dist"));
});

gulp.task("copy-images", function() {
  log.info("copying images");
  return gulp.src(paths.image).pipe(gulp.dest("dist/image"));
});

gulp.task("processCSS", function () {
  log.info("processing less files");
  return gulp
    .src("src/css/*.less")
    .pipe(
      less().on("error", function(err) {
        log.error(err);
      })
    )
    .pipe(gulp.dest("dist/css"));
});

function CompileTSC() {
  log.info("Starting compilation");
  return watchedBrowserify
    .bundle()
    .pipe(source("app.js"))
    .pipe(gulp.dest("dist"));
}

gulp.task(
  "serve",
  function() {
    gulp.src("dist").pipe(webserver({ open: true }));
  }
);

gulp.task(
  "default",
  gulp.series(
    "clean",
    gulp.parallel("copy-tizen", "copy-images", "processCSS"),
    CompileTSC
  )
);

watchedBrowserify.on('update', CompileTSC);
watchedBrowserify.on('log', log);

