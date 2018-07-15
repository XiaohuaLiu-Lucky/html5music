var $ = window.Zepto;
var root = window.player;
var $scope = $(document.body);
var songList;
// 接收new ControlManager的对象
var controlmanager;
var audio = new root.AudioManager();
// 1. 首先去服务器将所有的歌曲资源请求下来，因为我们不知道有几首歌曲。
function getData(url) {
    $.ajax({
        type: 'GET',
        url: url,
        success: function(mockdata) {
            var data = mockdata['data'];
            songList = data;
            // 构造函数
            controlmanager = new root.ControlManager(data.length);
            bindClick();
             // 2. 渲染第一首歌的歌曲信息
            // root.render(data[0]);
            $scope.trigger('play:change',0);
            bindTouch();
            root.list.renderList(data);
        },
        error: function(data) {
            alert('资源请求失败');
        }
    });
}
// 3. 切换，点击左切换到上一首，点击右切换到下一首。
// var index = 0; //代表第一次加载第0首。
// 取消移动端click事件的300ms延迟，就可以在移动端使用click了。
$(function() {
    FastClick.attach(document.body);
});
function bindClick() {
    // 移动端click事件有300ms延迟
    // 上一首，下一首这么写不好，在这里面直接让index=0了，直接去改变index的值了，那如果你这么
    // 去写一个程序的话，我可以不写--,++。我直接去写index = 3,4,5。直接去改变index不好。
    // 怎么办，可以把控制index写成一个模块，写成一个函数，让这个index，只能按照我们想要的逻辑去操作。
    // 让它--，让它++，不把index暴露到index.js里面去。
    // $scope.on('click','.prev-btn',function() {
    //     if(index === 0) {
    //         index = songList.length - 1;
    //     }else {
    //         index --;
    //     }
    //     root.render(songList[index]);
    // }).on('click','.next-btn',function() {
    //     if(index === songList.length - 1) {
    //         index = 0;
    //     }else {
    //         index ++;
    //     }
    //     root.render(songList[index]);
    // });


    // bindClick里面都用到了root.render(songList[index]);
    // 因为不管是上一首还是下一首都需要去渲染歌曲的信息，渲染歌曲的图片，渲染歌曲是否喜欢。
    // 当把这个项目完善完了，会发现还需要渲染当前这首歌的音乐资源。
    // 还需要渲染播放列表里当前这首标记会红色的歌曲信息
    // 所以会有很多重复的地方，故把它摘出来。
    $scope.on('click','.prev-btn',function() {
        var index = controlmanager.prev();
        // root.render(songList[index]);
        $scope.trigger('play:change',index);
    }).on('click','.next-btn',function() {
        var index = controlmanager.next();
        // root.render(songList[index]);
        // 触发自定义事件
        $scope.trigger('play:change',index);
    }).on('click','.play-btn',function() {
        // 如果是暂停，让你播放。如果是播放让你暂停
        // 变图标
        if(audio.status === 'pause') {
            audio.play();
            // $(this).addClass('playing');
            // 点击播放的时候开启
            root.processor.startProcessor();
        }else {
            audio.pause();
            // $(this).removeClass('playing');
            root.processor.stop();
        }
        $(this).toggleClass('playing');
    });
    // 来一个自定义事件(函数也可以)--切换上一首下一首
    $scope.on('play:change',function(event,index,flag) {
        // 渲染页面信息
        root.render(songList[index]);
        // 加载音频资源---换歌曲音频源
        audio.setAudioSource(songList[index].audio);
         // 现在有一个问题，当你正在播放的时候，点击下一首，需要自动播放，但是没有自动播放
         if(audio.status === 'play'|| flag) {
            audio.play();
            root.processor.startProcessor();
         }
         //  接下来就写进度条，进度条也是一个模块
         root.processor.renderAllTime(songList[index].duration);
        //  进度条的渲染当前时间和渲染进度条也是一个动画 requestAnimationFrame渲染动画非常好用。
        // 让进度条更新到0
         root.processor.update(0);
          // 渲染歌词
        root.lyrics.renderLyrics(index,songList[index].duration);
    })
    $scope.on('click','.list-btn',function() {
        root.list.show(controlmanager);
    });
}
// 拖拽进度条，拖拽当前的时间
// 播放的情况下，拖拽进度条需要取消当前时间和进度条走的状态
function bindTouch() {
    var offset = $scope.find('.pro-wrapper').offset();
    var left = offset.left;
    var width = offset.width;
    $scope.on('touchstart','.slider-point',function() {
        root.processor.stop();
        audio.pause();
        $scope.find('.play-btn').removeClass('playing');
    }).on('touchmove','.slider-point',function(e) {
        var x = e.changedTouches[0].clientX;
        var percent = (x - left) / width;
        if(percent < 0 || percent > 1) {
            percent = 0;
        }
        root.processor.update(percent);
    }).on('touchend','.slider-point',function(e) {
        var x = e.changedTouches[0].clientX;
        var percent = (x - left) / width;
        if(percent < 0 || percent > 1) {
            percent = 0;
        }
        // 松手就得播放当前这首歌的音频
        var curDuration = songList[controlmanager.index].duration;
        var curTime = curDuration * percent;
        audio.jumpToPlay(curTime);
        root.processor.startProcessor(percent);
        $scope.find('.play-btn').addClass('playing');
    });
}
getData('https://www.easy-mock.com/mock/5aa777952b0894377fc764ea/html5music/getMusicInfo');