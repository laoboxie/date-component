const gulp = require("gulp");
const { series } = require("gulp");

const del = require("del");
const browserSync = require("browser-sync").create();
const less = require("gulp-less");
const webpackStream = require("webpack-stream");

const webpackConfig = {
  entry: "./src/index.js",
  output: {
    library: "futuCalendar",
    libraryTarget: "umd",
    filename: "./index.js",
  },
  resolve: {
    modulesDirectories: ["./node_modules"],
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: "string-loader",
      },
      {
        test: /\.js?$/,
        exclude: "./node_modules",
        loader: "babel-loader",
        query: {
          presets: ["es2015"],
        },
      },
    ],
  },
  // watch: true,
  devtool: "#source-map",
};

function clean(cb) {
  del(["dist/**"]);
  cb();
}

function buildCss(cb) {
  gulp.src("./src/**.less").pipe(less()).pipe(gulp.dest("dist"));
  cb();
}

function buildJs() {
  return gulp
    .src("./src/**.js")
    .pipe(webpackStream(webpackConfig))
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
    open: false,
  });
  cb();
}

function watch() {
  // 监听src目录
  gulp
    .watch("./src/**.less")
    .on("change", series(buildCss, browserSync.reload));
  gulp.watch("./src/**.html").on("change", series(buildJs, browserSync.reload));
  gulp.watch("./src/**.js").on("change", series(buildJs, browserSync.reload));
  // 监听example目录
  gulp.watch("./example/**.html").on("change", browserSync.reload);
}

exports.build = series(clean, buildCss, buildJs);
exports.dev = series(clean, buildCss, buildJs, createDevServer, watch);
