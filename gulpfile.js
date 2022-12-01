const gulp = require("gulp");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const tsProject = ts.createProject("tsconfig.json");
const merge = require("merge2");

gulp.task("default", () => {
    return Promise.resolve(
        console.log(">>>>>>>>>>  Use command `yarn build` to clean build SDK")
    );
});

gulp.task("compile", () => {
    const tsResult = 
            tsProject.src()  // OR: gulp.src(['src/**/*.ts'])
            .pipe(sourcemaps.init())
            .pipe(tsProject())

    return merge([
        tsResult.dts.pipe(gulp.dest('dist/types')),
        tsResult.js.pipe(sourcemaps.write('.')).pipe(gulp.dest('dist'))
    ]);
})