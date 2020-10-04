const gulp = require("gulp");
const { series } = require("gulp");
const del = require("del");
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const browserSync = require("browser-sync").create();
const templatejs = require("gulp-templatejs");
const less = require("gulp-less");

const webpackStream = require("webpack-stream");

const webpackConfig = {
  mode: "development",
  devtool: "inline-source-map", //调试工具显示
  entry: "./src/index.js",
  output: {
    path: "/dist/",
    filename: "index.js",
  },
  module: {}, //下面有该内容的详细介绍
};

function clean(cb) {
  del(["dist/**"]);
  cb();
}

function buildTemplate(cb) {
  gulp
    .src(["./src/**.tmpl"])
    .pipe(
      templatejs({
        sTag: "<#",
        eTag: "#>",
        expression: 'require("@templatejs/runtime")',
        sandbox: false, // 沙箱模式
      })
    )
    .pipe(gulp.dest("dist"));
  cb();
}

function buildCss(cb) {
  gulp.src("./src/*.less").pipe(less()).pipe(gulp.dest("dist"));
  cb();
}

function buildJs() {
  return gulp
    .src("./src/**.js")
    .pipe(webpackStream(webpackConfig))
    .pipe(gulp.dest("dist"));

  return browserify({
    entries: "./src/index.js",
    debug: true,
    transform: [
      babelify.configure({
        presets: ["es2015"],
      }),
    ],
  })
    .bundle()
    .pipe(source("index.js"))
    .pipe(gulp.dest("dist"));
}

function createDevServer(cb) {
  // 创建server
  browserSync.init({
    port: 8888,
    server: {
      baseDir: "example",
      routes: {
        "/dist": "dist",
        "/example": "example",
      },
    },
    open: true,
  });
  cb();
}

function watch() {
  // 监听src目录
  gulp
    .watch("./src/**.less")
    .on("change", series(buildCss, browserSync.reload));
  gulp
    .watch("./src/**.tmpl")
    .on("change", series(buildTemplate, browserSync.reload));
  gulp.watch("./src/*.js").on("change", series(buildJs, browserSync.reload));
  // 监听example目录
  gulp.watch("./example/*.html").on("change", browserSync.reload);
}

exports.build = series(clean, buildTemplate, buildCss, buildJs);
exports.dev = series(
  clean,
  buildTemplate,
  buildCss,
  buildJs,
  createDevServer,
  watch
);
