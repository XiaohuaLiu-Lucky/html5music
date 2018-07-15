// 歌词：http://www.lrcgc.com/ =》搜丑八怪 =》显示LRC标签 开
// 当前多少秒应该显示什么歌，现在把它存成一个数组
// 可以获取当前播放的时间，然后对应的文字移动
// 像轮播图一样让所有的歌词展示到里面去，但是只显示进度条下面的区域
// 刚开始的时候显示一行字，然后到多少秒让整个区域往上移动，一直移动最后一句话。
(function($, root) {
    $scope = $(document.body);
    var reg = /:/g;
    var curDuration;
    var height;
    var lyricsList;
    var lastSecond = 0;
    // 发送ajax获取歌词
    function getLyrics(url) {
        $.ajax({
            type: 'GET',
            url: url,
            success: function(lyricsData) {
                 lyricsList = lyricsData['data'];
                 console.log(lyricsList);
            },
            error: function(data) {
                alert('资源请求失败');
            }
        });
    }
    getLyrics('https://www.easy-mock.com/mock/5aa777952b0894377fc764ea/html5music/lyrics');
    // 渲染歌词
    function renderLyrics(index,duration) {
        curDuration = duration;
        // 当前歌词信息
        var lyrics = lyricsList[index];
         // 当前这首歌歌词的长度
         var length = lyrics.length;
        // 一句歌词信息
        var single;
        var html = "";
        for(var i = 0; i < length; i++) {
            single = lyrics[i];
            var len = single.length - 1; //1或者2
            var classname = '';
            // 可能一首歌有两个类名
            for(var j = 0; j< len; j++) {
                var time = (single[j].replace(reg, '.')).split('.');
                var second = time[0] * 60 + (+time[1]);
                // 排除NaN
                if(second == second) {
                    classname += second + ' ';
                }
            }
            html +='<li class="'+classname+'">' + single[len] + '</li>';
        }
        $scope.find('.lyrics ul').html(html);
        height = $scope.find('.lyrics li').offset().height;
    }
    function lyricsRun(percent) {
        // 求当前秒数
        var second = Math.round(percent * curDuration);
        // 避免一秒内相同效果执行多次
        if(lastSecond != second) {
            // 判断有没有当前秒数的类名
            if($scope.find('.'+second).length !== 0) {
                // 移除上一个当前活动类
                $('.lyrics .active').removeClass('active');
                // 求出当前活动li在兄弟节点中的索引，并添加当前样式
                var index = $('.'+second).index();
                $scope.find('.lyrics li').eq(index).addClass('active');
                $scope.find('.lyrics ul').css({
                    'top':'-' + (index - 1) * height + 'px'
                });
            }
            lastSecond = second;
        }
    }
    root.lyrics = {
        renderLyrics: renderLyrics,
        lyricsRun: lyricsRun
    }
})(window.Zepto, window.player || (window.player = {}));