//  接下来就写进度条，进度条也是一个模块
//  进度条有3部分，总时间的渲染，当前时间的渲染，
(function($, root) {
    var $scope = $(document.body);
    var curDuration;
    var frameId;
    var startTime = 0;
    var lastPercent = 0;
    // 秒转换为分和秒
    function formatTime(duration) {
        duration = Math.round(duration); //四舍五入取整
        var minute = parseInt(duration / 60);
        // var second = duration - minute * 60;
        var second = duration % 60;
        // 小于10，前面添个0
        if(minute < 10) {
            minute = '0' + minute;
        }
        if(second < 10) {
            second = '0' + second;
        }
        return minute + ':' + second;
    }
    // 渲染总时间--253秒，渲染是分:秒的形式
    function renderAllTime(duration) {
        lastPercent = 0; //切换上一首，下一首的时候都会调用renderAllTime;
        curDuration = duration;
        var allTime = formatTime(duration);
        $scope.find('.all-time').html(allTime);
    }
    // 一点击开始播放进度条就开始走，并且当前时间也会发生变化
    // 首先需要知道当前播放的是这首歌的百分之几，而且应该是实时的去监控。
    // 用requestAnimationFrame对动画有所优化，没有setInterval的卡顿
    // 比如播放1秒之后应该是4分13秒的百分之几
    function startProcessor(percentage) {
        lastPercent = percentage === undefined ? lastPercent : percentage;
        // 清掉上一次的进度条
        cancelAnimationFrame(frameId);
        // 记录一下你点开始的当前时间
        startTime = new Date().getTime();
        function frame() {
            var curTime = new Date().getTime();
            var percent = lastPercent + (curTime - startTime) / (curDuration * 1000);
            // console.log(percent);
            if(percent < 1) {
                frameId = requestAnimationFrame(frame);
                // 渲染当前的时间
                update(percent);
            }else {
                cancelAnimationFrame(frameId);
            }
        }
        frame();  
        // 用百分比去设置进度条，当前时间也是通过百分比算出来的。
        // 通过百分比计算进度条，然后重新渲染进度条就可以了
    }
    // 渲染当前时间--这个百分比下当前歌曲播放了多少时间
    function update(percent) {
        var curTime = formatTime(percent * curDuration);
        $scope.find('.cur-time').html(curTime);
        // 渲染进度条
        var percentage = (percent - 1) * 100 + '%';
        $scope.find('.pro-top').css({
            'transform':'translateX('+percentage+')'
        });
        // 歌词运动
        root.lyrics.lyricsRun(percent);
        
    }
    // 停止
    function stop() {
        var stopTime = new Date().getTime();
        lastPercent += (stopTime - startTime) / (curDuration * 1000);
        cancelAnimationFrame(frameId);
    }
    root.processor = {
        renderAllTime: renderAllTime,
        startProcessor: startProcessor,
        stop: stop,
        update: update
    } 
})(window.Zepto, window.player || (window.player = {}));