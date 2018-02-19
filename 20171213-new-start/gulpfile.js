var gulp = require('gulp');
var browserSync = require('browser-sync').create();

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        browser: ["chrome"],// "firefox", "iexplore"],
        port: 5555,
        server: {
            baseDir: ''
        },
    });
});

// Dev task with browserSync
gulp.task('default', ['browserSync'], function() {
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('**/*.html', browserSync.reload);
    gulp.watch('**/*.js', browserSync.reload);
    gulp.watch('**/*.css', browserSync.reload);
    gulp.watch('**/*.cfg', browserSync.reload);
    gulp.watch('**/ibmsg', browserSync.reload);
});
