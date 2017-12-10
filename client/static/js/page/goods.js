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

    $.ajax({
        url: 'http:localhost:9090/cartlist',
        type: 'GET',
        dataType: 'json',
        cache: false,
        error: function() {
            console.log("error");
        },
        success: function(data) {
            var div = " <div class='cartGoods'>" +
                "<div class='yes'>" +
                "<span></span>" +
                "</div>" +
                "<div class='descrip'>" +
                "<a href='#'>" + "<img src=" + data[j].imgSrc + ">" + data[j].cartName + "</a>" +
                "</div>" +
                "<div class='price'>" +
                "<span>" + data[j].price + " 积分</span>" +
                "</div>" +
                "<div class='count'>" +
                "<div class='box'>" +
                "<span class='msCount'>-</span>" +
                "<input type='text' value='1' maxlength='2' class='sum'>" +
                "<span class='psCount'>+</span>" +
                "</div>" +
                "</div>" +
                "<div class='sumPrice'>" +
                "<span>" + data[j].sumprice + "</span>" +
                "</div>" +
                "<div class='operation'>" +
                "<span>删除</span>" +
                "</div>" +
                "</div>";
            for (j = 0; j < data.length; j++) {
                $("#cart").find('.cartList').append(div);
            }
        }
    });

    $('#detail').find('.insertCar').click(function() {
        var imgSrc = $('#detail').find('#img').attr('src');
        var goodsName = $('#detail').find('.goodsName').html();
        var integral = $('#detail').find('.integral').html();
        $.ajax({
            url: 'http:localhost:9090/cartlist',
            type: 'GET',
            dataType: 'json',
            data: { imgSrc: imgSrc, goodsName: goodsName, integral: integral },
            cache: false,
            error: function() {
                console.log("error");
            },
            success: function() {
                alert("添加成功")
            }
        })
    })
})