import gulp from 'gulp';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import del from 'del';
import merge from 'merge2';
import jspmDeps from './bin/jspm-deps.js';
import Builder from 'systemjs-builder';

import config from './gulpfile.config.js';
import tsConfig from './tsconfig.json';

var $ = require('gulp-load-plugins')({
    lazy: true
});

/**
 * Error notification settings
 */
function errorAlert(err) {
    $.notify.onError({
        message: '<%= error.message %>',
        sound: 'Sosumi'
    })(err);
    console.log(err.toString());
}


/**
 * The 'browserSync' task start BrowserSync and open the browser.
 *
 */
let bs = browserSync.create();

gulp.task('server', () => {

    let browser = 'google chrome';
    let files = [
        config.src.watchFiles,
        config.typescript,
        config.systemjs
    ];
    let serverConfig = null;
    let options = {
        open: false, // Disabled because of bug: https://github.com/BrowserSync/browser-sync/issues/877
        port: 3000,
        directory: true,
        notify: true,
        startPath: config.indexHTML,
        files: files,
        browser: browser
    };

    try {
        $.nodemon({
            script: 'server/server.js',
            watch: ['server/!(*spec).js'],
            env: {
                'NODE_ENV': 'development'
            }
        });

        serverConfig = require('./server/config.json');
        options.proxy = `${serverConfig.host}:${serverConfig.port}`;
        $.util.log(`REST Server found at ${serverConfig.host}:${serverConfig.port}. Using browser-sync as proxy`);
    } catch (error) {
        $.util.log('No REST Server present. Using browser-sync as server');
        options.server = {
            baseDir: './'
        };
    }

    bs.init(options);

    gulp.watch(['.src/**/*.scss', './ui/**/*.scss'], ['sass']);
});

/**
 * Test Server
 **/

gulp.task('test-server', () => {
    gulp.src('./server/*spec.js')
        .pipe($.mocha({
            timeout: 3000,
            reporter: 'list'
        }));
});

gulp.task('watch', () => {
    gulp.watch('./server/*spec.js', ['test-server']);
    gulp.watch('./**/*.scss', ['sass']);
    gulp.watch('./**/*.ts', ['typescript']);
});

/**
 * The CSS preprocessing tasks.
 */
gulp.task('sass', () => {
    return gulp.src(config.src.styles)
        .pipe($.plumber({ errorHandler: errorAlert }))
        .pipe($.sourcemaps.init())
        .pipe($.sass().on('error', $.sass.logError))
        .pipe(gulp.dest(config.dist.styles))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(`${config.src.basePath}/styles`))
        .pipe(bs.reload({ stream: true, notify: true }))
        .on('error', errorAlert)
        .pipe($.notify({message: 'Styles compiled', onLast: true}));
});

gulp.task('less', () => {
    return gulp.src(config.src.styles)
        .pipe($.sourcemaps.init())
        .pipe($.less())
        .pipe(gulp.dest(config.dist.styles))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(`${config.src.basePath}/styles`))
        .pipe(bs.stream());
});

/**
 * The 'clean' task delete 'dist' directory.
 */
gulp.task('clean', (done) => {
    return del(config.dist.basePath, done);
});

/**
 * The 'copy' task just copies files from A to B. We use it here
 * to copy our files that haven't been copied by other tasks
 * e.g. (favicon, etc.) into the `dist` directory.
 */
gulp.task('copy', () => {
    return merge[
        gulp.src(config.src.baseFiles).pipe(gulp.dest(config.dist.basePath)),
        gulp.src(config.src.images).pipe(gulp.dest(config.dist.images)),
        gulp.src(config.src.data).pipe(gulp.dest(config.dist.data)),
        gulp.src(config.src.fonts).pipe(gulp.dest(config.dist.fonts))
    ];
});

/**
 * The 'compile' task compile all js, css and html files.
 */
gulp.task('compile', ['bundle', 'html', 'sass'], () => {
    return gulp.src(`${config.src.basePath}index.html`)
        .pipe($.inject(gulp.src(`${config.dist.scripts}*.js`, {
            read: false
        })))
        .pipe($.usemin())
        .pipe(gulp.dest(config.dist.basePath));
});

/**
 * The 'htmlhint' task defines the rules of our hinter as well as which files we
 * should check. It helps to detect errors and potential problems in our
 * HTML code.
 */
gulp.task('htmlhint', () => {
    return gulp.src(config.src.templates)
        .pipe($.htmlhint({
            'doctype-first': false,
            'spec-char-escape': false
        }))
        .pipe($.htmlhint.reporter())
        .pipe($.htmlhint.failReporter());
});

/**
 * The HTML convert templates to JS task.
 */

gulp.task('html', ['htmlhint'], () => {
    return gulp.src(config.src.templates)
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe($.ngHtml2js({
            moduleName: config.templatesModuleName,
            prefix: 'modules/'
        }))
        .pipe($.concat(`${config.templatesModuleName}.js`))
        .pipe(gulp.dest(config.dist.scripts));
});

/**
 * The 'TSLint' task.
 */
gulp.task('tslint', () => {
    return gulp.src(config.src.typescripts)
        .pipe($.plumber())
        .pipe($.tslint())
        .pipe($.tslint.report('prose', {
            emitError: false
        }));
});

/**
 * The 'Typescript' task.
 */


gulp.task('typescript', ['tslint'], () => {
    let project = $.typescript.createProject(config.tsconfig);

    let result = gulp.src(config.src.typescripts)
        .pipe($.typescript(project));

    return merge([
        result.dts.pipe(gulp.dest(config.dist.scripts)),
        result.js.pipe(gulp.dest(config.dist.scripts))
    ]);
});

/**
 * The 'Bundle' task.
 */

gulp.task('bundle', ['tslint'], (done) => {
    let builder = new Builder(config.root);

    builder
        .loadConfig(config.systemconfig)
        .then(() => {
            return builder.buildStatic(
                `${config.src.basePath}index.ts`,
                `${config.dist.scripts}bundle.js`, {
                    minify: false,
                    mangle: false,
                    separateCSS: true,
                    sourceMaps: false
                });
        }).then(() => {
            done();
        });
});

/**
 * The 'build' task gets app ready for deployment by processing files
 * and put them into directory ready for production.
 */
gulp.task('build', (done) => {
    runSequence(
        ['clean'], config.build,
        done
        );
});

gulp.task('default', ['server']);
