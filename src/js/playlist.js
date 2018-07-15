// 点击list-btn弹出播放列表
// 首先需要去渲染playlist的dom节点。
(function($, root) {
    var $scope = $(document.body);
    var control;
    // 包裹成一个jquery对象
    var $playList = $('<div class="playlist"> \
                        <div class="play-header">播放列表</div> \
                        <ul class="list-wrapper"> \
                        </ul> \
                        <div class="close-btn">关闭</div> \
                    </div>');
    bindEvent();
    // 渲染播放列表DOM
    function renderList(data) {
        var len = data.length;
        var html = '';
        for(var i = 0; i < len; i++) {
            html +='<li><h3>' + data[i].song + ' - <span>' + data[i].singer + '</span></h3></li>';
        }
        $playList.find('.list-wrapper').html(html);
        $scope.append($playList);
    }
    // 绑定事件
    function bindEvent() {
        $playList.on('click','.close-btn',function() {
            $playList.removeClass('show');
        });
        $playList.find('ul').on('click','li',function() {
            // 当前节点在兄弟节点中的索引
            var index = $(this).index();
            control.changeIndex(index);
            // 点击哪首歌就变红色
            signSong(index);
            // 隔200毫秒让其消失
            setTimeout(function() {
                $playList.removeClass('show');
            },200);
            // 播放
            $scope.trigger('play:change',[index, true]);
            $scope.find('.play-btn').addClass('playing');
        });
    }
    // 显示出来
    function show(controlmanager) {
        control = controlmanager;
        signSong(control.index);
        $playList.addClass('show');
    }
    // 歌曲标记为红色
    function signSong(index) {
        $playList.find('.sign').removeClass('sign');
        $playList.find('li').eq(index).addClass('sign');
    }
    root.list = {
        renderList: renderList,
        show : show
    }
})(window.Zepto, window.player || (window.player = {}));
