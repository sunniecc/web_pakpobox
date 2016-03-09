/**
 * @fileOverview 文件编译配置
 * @version 1.0.0
 * @author <a href="mailto:lucienxu@tencent.com">lucienxu</a>
 * @date 2015/08/15
 * @copyright Copyright (c) 2014, Tencent Inc. All rights reserved.
 * @see [link]
 *
 * @example
 *
 * 命令说明
 * gulp - 开发模式
 * gulp build - 发布编译
 *
 * 新增页面，编辑webpack.config.js文件
 */
var gulp = require('gulp');
var less = require('gulp-less');
var copy = require('gulp-copy');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var gutil = require("gulp-util");
var webpack = require("webpack");

var webpackConfig = require('./webpack.config.js');

var dir_src = "src/js/";
var dir_dist = "assets/js/";

// build all third lib to lib.js
gulp.task('lib', function(){
    var libs = [
        'lib/jquery/jquery.min.js',
        'lib/angular/angular.min.js',
        'lib/moment/moment.min.js',
        'lib/bootstrap/bootstrap.min.js',
        'lib/bootstrap/daterangepicker.js',
        'lib/bootstrap/bootstrap-multiselect.js',
        //'lib/echarts/echarts-custom',
    ];

    libs = libs.map(function(item, i){
        return dir_src + item;
    });
    return gulp.src(libs)
        .pipe(uglify())
        .pipe(concat('lib.js'))
        .pipe(gulp.dest(dir_dist));
});

gulp.task('webpack:build-dev', function(callback) {
    webpack(webpackConfig, function(err, stats) {
        if(err) throw new gutil.PluginError('build-dev', err);
        gutil.log('[webpack:build-dev]', stats.toString({
            colors: true
        }));
        callback();
    });
    gulp.src('src/less/**/*.*')
        .pipe(less())
        .on('error', function(e){console.log(e);} )
        .pipe(concat('style.css'))
        .pipe(gulp.dest('assets/css'));
});

gulp.task("webpack:build", function(callback) {
    var buildConfig = Object.create(webpackConfig);
    buildConfig.plugins = buildConfig.plugins.concat(
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.DedupePlugin()
    );

    webpack(buildConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build", err);
        gutil.log("[webpack:build]", stats.toString({
            colors: true
        }));
        //gulp.src('assets/js/*')
        //    .pipe(uglify())
        //    .pipe(gulp.dest('./assets/js'))
        callback();
    });
    //gulp.src('assets/js/*')
    //    .pipe(uglify())
    //    .pipe(gulp.dest('./assets/js'))

    gulp.src('src/less/**/*.*')
        .pipe(less())
        .on('error', function(e){console.log(e);} )
        .pipe(concat('style.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('assets/css'));
});

gulp.task("build-dev", ["webpack:build-dev"], function() {
    gulp.watch([dir_src + "**/*.*", "src/less/**/*.*", "src/tpl/**/*.*"], ["webpack:build-dev"]);
});

gulp.task("build", ["webpack:build"]);

gulp.task("default", ["build-dev"]);