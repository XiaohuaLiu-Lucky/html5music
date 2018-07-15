// 2. 渲染当前第一首歌的信息
(function($, root) {
    var $scope = $(document.body);
    // 2.1 渲染当前这首歌的歌曲信息
    function renderInfo(info) {
        // info当前这首歌的歌曲信息
        var html = '<div class="song-name">' + info.song + '</div> \
                 <div class="singer-name">' + info.singer + '</div> \
                 <div class="album-name">' + info.album + '</div>';
        $scope.find('.song-info').html(html);
    }
    // 2.2 渲染当前这首歌的图片
    function renderImg(src) {
        // 高斯模糊
        var img = new Image();
        img.src = src;
        img.onload = function() {
            // 模糊图片并添加到body上面去。
            root.blurImg(img, $scope);
        }
        // 渲染图片
        $scope.find('.img-wrapper img').attr('src',src);
    }
     // 2.3 渲染当前这首歌是否喜欢
    function renderIsLike(isLike) {
        // true -> 显示实心的心
        // false-> 显示空心的心
        if(isLike) {
            $scope.find('.like-btn').addClass('liking');
        }else {
            $scope.find('.like-btn').removeClass('liking');
        }
        
    }

    // 暴露接口
    root.render = function(data) {
        renderInfo(data);
        renderImg(data.image);
        renderIsLike(data.isLike);
    }

})(window.Zepto,window.player || (window.player = {} ));