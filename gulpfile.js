const gulp = require('gulp');
const { src, dest, series, parallel, watch } = require('gulp');

/******************************************************************************** */
//html task
const htmlMin = require('gulp-htmlmin')
function htmltask() {
    return src('project/*.html')
        .pipe(htmlMin({ collapseWhitespace: true, removeComments: true }))
        .pipe(dest("build/assets"))
}
exports.html = htmltask;

/******************************************************************************** */
//image task
const imagemin = require('gulp-imagemin');

function imgTask() {
    return src('project/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/images'))
}
exports.img = imgTask;
/******************************************************************************** */
//css task
const gulpconcat = require('gulp-concat');
const cssmin = require('gulp-clean-css');

function cssTask() {
    return src('project/css/**/*.css')
        .pipe(gulpconcat("style.min.css"))
        .pipe(cssmin())
        .pipe(gulp.dest('build/assets'))
}

exports.css = cssTask;

/******************************************************************************** */
//Js task
const jsmin = require('gulp-terser');

function jsTask() {
    return src("project/js/**/*.js")
        .pipe(gulpconcat('script.mim.js'))
        .pipe(jsmin())
        .pipe(dest('build/assets'))
}
exports.js = jsTask;


/******************************************************************************** */
//Run more than one Task --------> [ series or parallel]
// exports.default = series(htmltask, cssTask, jsTask, imgTask);
// exports.default = parallel(htmltask, cssTask, jsTask, imgTask);


/******************************************************************************** */
//Watch task


function watchTask() {
    watch('project/*.html', series(htmltask, reloadTask))
    watch('project/js/**/*.js', series(jsTask, reloadTask))
    watch('project/css/**/*.css', series(cssTask, reloadTask))
}

const browseSynce = require('browser-sync');

function serve(done) {
    browseSynce(
        {
            server: {
                baseDir: 'build/assets'
            }
        } 
    )
    done()
}
function reloadTask(cb) {
    browseSynce.reload();
    cb();
}
exports.default = series(parallel(htmltask, cssTask, jsTask, imgTask), serve, watchTask);