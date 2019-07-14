const {
    src,
    dest,
    watch,
    series,
} = require('gulp');

const del = require('del');
const pug = require('gulp-pug');
const stylus = require('gulp-stylus');
const browserSync = require('browser-sync').create();


/**
 * Instructions
 */
const clean = (cb) => {
    del([
        'dist/**',
        '!dist/.gitkeep',
    ]);

    return cb();
};

const serve = (cb) => {
    browserSync.init({
        server: {
            baseDir: './dist',
        },
    });

    return cb();
};

const html = (cb) => {
    src('src/views/*.pug')
        .pipe(pug())
        .pipe(dest('dist'))
        .pipe(browserSync.stream());

    return cb();
};

const css = (cb) => {
    src([
        'src/stylus/*.styl',
        'src/stylus/*.stylus',
    ])
        .pipe(stylus())
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());

    return cb();
};

const watches = (cb) => {
    watch('**/*.pug', html);
    watch([
        '**/*.styl',
        '**/*.stylus',
    ], css);

    return cb();
};


/**
 * Exports tasks
 */
exports.clean = clean;
exports.serve = serve;
exports.html = html;
exports.css = css;
exports.watches = watches;

exports.default = series(clean, css, html, serve, watches);
