$(function() {
    $.ajax({
        url: 'http:localhost:9090/list',
        type: 'GET',
        dataType: 'json',
        cache: false,
        error: function() {
            console.log("error");
        },
        success: function(data) {
            var $goodsList = $(".goodsList");
            for (i = 0; i < data.length; i++) {
                $(".goodsList").append("<li>" +
                    "<a href='#' target='_blank' class='goodsImg'>" + "<img src=" + data[i].imgSrc + ">" + "</a>" +
                    "<a href='#' target='_blank' class='goodsName'>" + data[i].goodsName + "</a>" +
                    "<span>" + "<i>" + data[i].integral + "</i>" + "积分</span > " +
                    " </li>");
            }
        }
    })



    $.ajax({
        url: 'http:localhost:9090/goods',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            $('#detail').find('#img').attr("src", +data.imgSrc);
            $('#detail').find('.goodsName').html(data.goodsName);
            $('#detail').find('.describe').html(data.describe);
            $('#detail').find('.integral').html(data.integral);
            $('#detail').find('.stock').html(data.stock);
        },
        error: function(err) {
            console.log(err);
        }
    });
    $('#detail').find('.msCount').attr('disabled', false);
    var $count = $('#detail').find('.count')
    $('#detail').find('.psCount').click(function() {
        $count.val(Math.abs(parseInt($count.val())) + 1);
        if (parseInt($count.val()) != 1 || ($count.val() == data.stock)) {
            $('#detail').find('.msCount').attr('disabled', false);
        };
    })
    $('#detail').find('.msCount').click(function() {
        if (parseInt($count.val()) == 1) {
            $('#detail').find('.msCount').attr('disabled', true);
        } else {
            $count.val(Math.abs(parseInt($count.val())) - 1);
        }
    });

    $('#detail').find('.insertCar').click(function() {
        var $name = $('#detail').find('.goodsName').html(data.goodsName);
        var $integral = $('#detail').find('.integral').html(data.integral);
        var $stock = $('#detail').find('.stock').html(data.stock);

        //查看库存是否还有<=0  
        if ($stock = 0) {
            return;
        }

        //无论购物车中是否有该商品,库存都要-1  

        //在添加之前确定该商品在购物车中是否存在,若存在,则数量+1,若不存在则创建行  
        var $trs = $("#goods>tr");
        for (var i = 0; i < $trs.length; i++) {
            var $gtds = $trs.eq(i).children();
            var gName = $gtds.eq(0).html();
            if (name == gName) { //若存在  
                var num = parseInt($gtds.eq(2).children().eq(1).val());
                $gtds.eq(2).children().eq(1).val(++num); //数量+1  
                //金额从新计算  
                $gtds.eq(3).html(price * num);
                return; //后面代码不再执行  
            }
        }
        //若不存在,创建后追加  


        //总计功能  
        total();
    })
    var div = " <div class='cartGoods'>" +
        "<div class='yes'>" +
        "<span></span>" +
        "</div>" +
        "<div class='descrip'>" +
        "<a href='#'>" + "<img src='. / static / images / test.png '>放假阿卡数据</a>" +
        "</div>" +
        "<div class='price'>" +
        "<span>354 积分</span>" +
        "</div>" +
        "<div class='count'>" +
        "<div class='box'>" +
        "<span class='msCount'>-</span>" +
        "<input type='text' value='1' maxlength='2' class='sum'>" +
        "<span class='psCount'>+</span>" +
        "</div>" +
        "</div>" +
        "<div class='sumPrice'>" +
        "<span>" + "345 积分 " + "</span>" +
        "</div>" +
        "<div class='operation'>" +
        "<span>删除</span>" +
        "</div>" +
        "</div>"
        //追加到#goods后面  
    $("#cart").find('.cartList').append(div);
})