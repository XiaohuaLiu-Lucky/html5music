// 引入插件之前要在命令行中下载插件cnpm install gulp-uglify --save-dev
// 下载完并且引用完了就可以去使用这个插件。
var gulp = require('gulp');
var cleanhtml = require('gulp-htmlclean');  //压缩html代码的插件。
var imagesmin = require('gulp-imagemin');  //压缩图片的插件。
var uglify = require('gulp-uglify'); //压缩js代码的插件。
var stripdebug = require('gulp-strip-debug'); //删除console.log()和debugger语法调试语句的插件。
var concat = require('gulp-concat'); //将多个js文件整合到一个js文件。
var deporder = require('gulp-deporder'); //整合js文件的时候可以添加依赖。
var less = require('gulp-less'); //将less文件转换为css文件
var postcss = require('gulp-postcss'); //css的自动补全操作和压缩得借助这个工具
var autoprefixer = require('autoprefixer'); //postcss里面的自动补全插件。
var cssnano = require('cssnano');   //postcss里面的压缩代码的插件
var connect = require('gulp-connect'); //开启一个服务器的插件。
var spritesmith = require('gulp.spritesmith'); //生成雪碧图插件
// 文件夹，src就是src文件夹
var folder = {
    src: './src/',
    build: './build/'
}
// process是nodejs里面的一个变量。
var devMode = process.env.NODE_ENV !== 'production';//如果不等于说明是开发模式。开发模式是true，就不压缩。
// 压缩后的代码不方便定位问题在哪里，不方便找问题。开发模式不压缩，等真正开发完了，bug都调试完成，之后再给他压缩就ok了

// 这个任务的作用就是转移文件,并压缩代码。
gulp.task('html',function(){
    // 读取一个文件
   var page = gulp.src(folder.src + 'html/*')
                  .pipe(connect.reload());
    if(!devMode) {
        page.pipe(cleanhtml());
    }
    page.pipe(gulp.dest(folder.build + 'html/')); //输出一个文件
})
gulp.task('pic',function() {
    gulp.src(folder.src + 'images/*')
        .pipe(imagesmin())
        .pipe(gulp.dest(folder.build + 'images/'));
});
// 当然js文件夹下面的全都是js，可以写*代表所有的文件或者*.js都可以。
// 读取文件后用pipe进行传输，因为是把它变成二进制的文件流的形式。
// 这里面要压缩js代码肯定是用插件去做的.
// gulp.dest(),生成它，转移它。
gulp.task('js',function() {
    // 咱们最好不合并容易出问题.pipe(deporder()).pipe(concat('main.js'))
    // 如果要js融合的话最好是去使用webpack的模块化功能，那个比这个更加灵活好用。
    var js = gulp.src(folder.src + 'js/*.js')
                    .pipe(connect.reload());
    if(!devMode) {
        js.pipe(uglify())
          .pipe(stripdebug());
    } 
    js.pipe(gulp.dest(folder.build + 'js/'));
});
// 这里注意一下，你想要压缩css,首先得把less转换为css之后才能压缩，
// 因为less的代码不认所以压缩不了。所以要先变成css代码再压缩。
gulp.task('css',function() {
    var css = gulp.src(folder.src + 'css/*')
                  .pipe(connect.reload())
                  .pipe(less());
    var options = [autoprefixer()];
    if(!devMode) {
        options.push(cssnano());
    }
    css.pipe(postcss(options))
        .pipe(gulp.dest(folder.build + 'css/'));
});

gulp.task('watch',function() {
    gulp.watch(folder.src + 'html/*',['html']);
    gulp.watch(folder.src + 'css/*',['css']);
    gulp.watch(folder.src + 'js/*',['js']);
    gulp.watch(folder.src + 'images/*',['pic']);
});

// 再创建一个任务
// port是端口号，默认是8080端口，咱们把它变成8081
// livereload:热启，当我们修改了index.html，一保存发生了什么，是不是执行html任务，压缩代码并转移。
// 但是我们浏览器不会刷新，你得自己手动刷新，刚修改的才会出来。livereload: true就是他可以自动去刷新
// 什么时候自动刷新，当html,js,css文件被放到build文件夹的时候自动刷新。
// 所以可以在拿的过程中，.pipe(connect),connect是一个对象，对象下面有个reload()这个函数，一执行就可以了。
// 因为如果修改了html,肯定执行html任务，那么我们执行html任务的同时，给它刷新一下我们的浏览器。
gulp.task('server',function() {
    connect.server({
        port: '8081',
        livereload: true
    }); //connect是一个对象，对象下面有一个server这个函数，去执行就OK了
});


// 这个任务不能改，就叫着默认的任务。然后一个数组，将任务写在里面去。那么现在直接敲gulp(后面不加任务),就相当于去
// 执行default这个任务，就是在执行default这个任务之前，去执行html,pic的任务的依赖。就是先执行html任务，再执行pic任务。
gulp.task('default',['html','pic','js','css','watch','server'],function() {
    console.log('finish');
});
// 可以看到先执行html任务，再执行pic任务，再执行default任务。
// 当然default任务里还可以写东西,可以看到打印出了finish，并且把任务做完了。
// 其实gulp.task()有3个参数，第一个参数是任务名称，第二个参数是执行这个任务之前先执行什么任务。
// 第三个参数是执行这个任务时的逻辑操作。
// 以上就是简单的gulp使用。
// 下节课。
// src文件夹里一般有4个文件夹，html，css，js, images。4个文件都写完了。
// 并且都进行gulp的前端的自动化构建工具，并且看它怎么去监听
// gulp制作雪碧图
gulp.task('sprite',function() {
    gulp.src(folder.src + 'images/xuebi/*')
        .pipe(spritesmith({
            imgName: 'sprite.png', //生成图的名称
            cssName: 'css/sprite.css', //对应生成的css文件
            padding: 5, //合成时两个图片的间距
            algorithm: 'binary-tree' //他有四个可选值，分别为top-down、left-right、diagonal、alt-diagonal、binary-tree
        }))
        .pipe(gulp.dest(folder.build + 'images/xuebi/'))
})