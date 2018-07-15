// 控制index的模块--控制管理器--用controlManager去管理我们的index
// 用controlmanager进行上一首，下一首的控制
(function($, root) {
    // 管理index的，写成一个对象，构造出一个对象，写一个构造函数。
    $scope = $(document.body);
    function ControlManager(len) {
        this.index = 0;
        this.length = len;
    }
    ControlManager.prototype =  {
        // 操作index的函数写在原型上
        prev: function() {
            return this.getIndex(-1);
        },
        next: function() {
            return this.getIndex(1);
        },
        getIndex: function(val) {
            // 处理临界值问题
            var index = this.index;
            var len = this.length;
            var curIndex = (index + val + len) % len;
            this.index = curIndex;
            return curIndex;
        },
        changeIndex: function(index) {
            if(index < 0 || index >= this.length) {
                this.index = 0;
            }
            this.index = index;
        }
    }
    root.ControlManager = ControlManager;
})(window.Zepto, window.player || (window.player = {}));