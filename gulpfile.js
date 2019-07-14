const {
    src,
    dest,
    watch,
    series,
} = require('gulp');

const del = require('del');
const pug = require('gulp-pug');
const stylus = require('gulp-stylus');
const notify = require('gulp-notify');
const browserSync = require('browser-sync').create();

/**
 * Handler Errors
 */
function onHandlerError() {
    const args = Array.prototype.slice.call(arguments);

    notify.onError({
        title: 'Gulp Compile Error',
        message: '<%= error.message %>',
    }).apply(this, args);

    this.emit('end');
};


/* Instructions */

/**
 * Clean files in folder
 * @param {function} cb Callback function
 */
const clean = (cb) => {
    del([
        'dist/**',
        '!dist/.gitkeep',
    ]);

    return cb();
};


/**
 * Run server with function hotreload
 * @param {function} cb Callback function
 */
const serve = (cb) => {
    browserSync.init({
        server: {
            baseDir: './dist',
        },
    });

    return cb();
};


/**
 * Generate html files
 * @param {function} cb Callback function
 */
const html = (cb) => {
    src('src/views/*.pug')
        .pipe(pug()
            .on('error', onHandlerError))
        .pipe(dest('dist'))
        .pipe(browserSync.stream());

    return cb();
};


/**
 * Generate css files
 * @param {function} cb Callback function
 */
const css = (cb) => {
    src([
        'src/stylus/*.styl',
        'src/stylus/*.stylus',
    ])
        .pipe(stylus()
            .on('error', onHandlerError))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());

    return cb();
};


/**
 * Start monitoring changes in files
 * @param {function} cb Callback function
 */
const watches = (cb) => {
    watch('**/*.pug', html);
    watch([
        '**/*.styl',
        '**/*.stylus',
    ], css);

    return cb();
};


/* Export tasks */
exports.clean = clean;
exports.serve = serve;
exports.html = html;
exports.css = css;
exports.watches = watches;

exports.default = series(clean, css, html, serve, watches);
