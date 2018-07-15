// 音乐模块--整个页面有一个audio就可以了，只能同时播放一首歌。
// 故这里还是去写成一个构造函数
(function($, root) {
    var $scope = $(document.body);
    function AudioManager() {
        this.audio = new Audio();
        // 知道当前这首歌的状态，如果是暂停点击就让它播放，如果是播放点击就让它暂停。
        // 初始化的状态肯定是暂停状态
        this.status = 'pause';
        this.bindEvent();
    }
    AudioManager.prototype = {
        // 首先有一个播放的方法
        play: function() {
           this.audio.play();
           this.status = 'play';
        },
        pause: function() {
            this.audio.pause();
            this.status = 'pause';
        },
        // 切换上一首下一首需要换源
        setAudioSource: function(src) {
            this.audio.src = src;
            // load() 方法用于在更改来源或其他设置后对音频/视频元素进行更新。
            // 更改视频来源，并重载视频：
            this.audio.load();
        },
        // 跳转播放
        jumpToPlay: function(time) {
            this.audio.currentTime = time;
            this.play();
        },
        // 绑定监听歌曲是否播放完成事件
        bindEvent: function() {
            console.log('ended1');
            this.audio.onended = function() {
                // 触发下一首的click事件
                $scope.find('.next-btn').trigger('click');
                console.log('ended');
            }
        }
    }
    root.AudioManager = AudioManager;
})(window.Zepto,window.player || (window.player = {}));
