$(function () {
        //左边菜单鼠标悬停事件 start
        $(".a_lnav ul li").hover(function () {
            var _this = $(this);
            _this.addClass("a_lnavacon");
            _this.find("a").addClass("current");
       
        }, function () {
            var _this = $(this);
                _this.removeClass("a_lnavacon");
                _this.find("a").removeClass("current");
       
        });
    //  $(".a_lnav ul li").click(function(){
    //      var _this = $(this);

    //  })
        

})