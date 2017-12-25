$(function() {
    //商品列表页
    $.ajax({
            url: "/api/get/mallpageList",
            type: 'GET',
            dataType: 'json',
            success: function(productList) {
                var $goodsList = $(".goodsList");
                for (i = 0; i < productList.productList.length; i++) {
                    $(".goodsList").append("<li>" +
                        "<a href='goods.html?_Id=" + productList.productList[i]._id + "' target='_blank' class='goodsImg'>" + "<img src=" + productList.productList[i].productImageUrl + ">" + "</a>" +
                        "<a href='goods.html?_Id=" + productList.productList[i]._id + "' target='_blank' class='goodsName'>" + productList.productList[i].productName + "</a>" +
                        "<span>" + "<i>" + productList.productList[i].ProductIntegration + "</i>" + "积分</span > " +
                        " </li>");
                }

            },
            error: function() {
                console.log(productList.message);
            },
        })
        // 商品详情页
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) {
            return unescape(r[2]);
        };
        return null; //返回参数值
    }
    var id = getUrlParam('_Id');
    $.ajax({
        url: "/api/get/mallpageItem",
        type: 'post',
        dataType: 'json',
        data: { _id: id },
        success: function(productListInfo) {
            var productImageUrl = productListInfo.productList.productImageUrl;
            var productName = productListInfo.productList.productName;
            var productDescription = productListInfo.productList.productDescription;
            var ProductIntegration = productListInfo.productList.ProductIntegration;
            var productInventory = productListInfo.productList.productInventory;
            var productdescribe = productDescription.substring(0, 10);
            $('#detail').find('#img').attr("src", productImageUrl);
            $('#detail').find('.describe').attr("title", productDescription)
            $('#detail').find('.goodsName').html(productName);
            $('#detail').find('.describe').html(productdescribe);
            $('#detail').find('.integral').html(ProductIntegration);
            $('#detail').find('.stock').html(productInventory);
        },
        error: function(productList) {
            console.log(productList)
        }
    });
    //购买数量
    $('#detail').find('.msCount').attr('disabled', false);
    $('#detail').find('.psCount').attr('disabled', false);
    var $count = $('#detail').find('.count')
    $('#detail').find('.psCount').click(function() {
        if (parseInt($count.val()) == parseInt($('#detail').find('.stock').html()) || parseInt($('#detail').find('.stock').html()) < 1) {
            $('#detail').find('.psCount').attr('disabled', true);
        } else {
            $count.val(Math.abs(parseInt($count.val())) + 1);
        };
    })
    $('#detail').find('.msCount').click(function() {
        if (parseInt($count.val()) == 1) {
            $('#detail').find('.msCount').attr('disabled', true);
        } else {
            $count.val(Math.abs(parseInt($count.val())) - 1);
        }
    });
    //立即兑换
    var cookie = document.cookie;
    var userId, reg, member_mark, money;
    if (cookie) {
        reg = cookie.match(/userInfo=(\S*)}/);
        userId = reg[1] ? reg[1].match(/_id":"(\S*)","username/)[1] : '';
    }

    $('#detail').find('.nowBuy').click(function() {
        if (parseInt($('#detail').find('.stock').html()) < 1) {
            $('#detail').find('.warning').html("库存不足");
        } else {
            if (cookie && reg[1]) {
                $('#detail').find('.peopleMsg').css("display", "block")
            } else {
                window.location.href = 'login.html';
                setTimeout(() => {
                    window.location.href = reload();
                }, 3000);
            }
        }
    });
    //确定兑换
    $('#detail').find('.sure').click(function() {
        $.ajax({
            url: "/api/user/member_mark",
            type: 'post',
            dataType: 'json',
            data: {
                _id: userId,
            },
            success: function(userInfo) {
                member_mark = userInfo.userInfo.member_mark;
                console.log("rtwer")
                var mallObj = {
                    _mallId: id,
                    inventory: $count.val(),
                    consigneeAddress: $('#detail').find('#textarea').val(),
                    consigneePhone: $('#detail').find('.phonenumber').val(),
                    consignee: $('#detail').find('.youname').val(),
                    integration: parseInt($count.val()) * parseInt($('#detail').find('.integral').html()),
                    money: parseInt($count.val()) * parseInt($('#detail').find('.integral').html()) - parseInt(member_mark)
                }
                money = parseInt($count.val()) * parseInt($('#detail').find('.integral').html()) - parseInt(member_mark);
                if ($('#detail').find('#textarea').val() == '' || $('#detail').find('.phonenumber').val() == '' || $('#detail').find('.youname').val() == '') {
                    alert("收货信息不能为空");
                    return false;
                } else {
                    if (money < 0) {
                        $.ajax({
                            url: "/api/set/shoppingCart",
                            type: 'post',
                            dataType: 'json',
                            data: {
                                _userId: userId,
                                mallObj: JSON.stringify(mallObj)
                            },
                            success: function() {
                                $('#detail').find('.warningMsg').html("兑换成功");
                                setTimeout(() => {
                                    window.location.href = 'dingdan.html'
                                }, 2000);
                            },
                            error: function() {
                                console.log(shibai)
                            }
                        })
                    } else {
                        $('#detail').find('.chongzhi').html("你的积分不足,需要充值" + money + "分");
                        $('#detail').find('.erweima').show(300);
                        $('#detail').find('.czcg').click(function() {
                            $('#detail').find('.erweima').hide(300);
                            $.ajax({
                                url: "/api/set/shoppingCart",
                                type: 'post',
                                dataType: 'json',
                                data: {
                                    _userId: userId,
                                    mallObj: JSON.stringify(mallObj)
                                },
                                success: function() {
                                    $('#detail').find('.warningMsg').html("兑换成功");
                                    setTimeout(() => {
                                        window.location.href = 'dingdan.html'
                                    }, 2000);
                                },
                                error: function() {
                                    console.log(shibai)
                                }
                            })
                            $('#detail').find('.warningMsg').html("请等待后台审核处理，处理完成后将会在订单里面显示信息");
                            setTimeout(() => {
                                window.location.href = 'dingdan.html'
                            }, 2000);
                        })
                        $('#detail').find('.out').click(function() {
                            $('#detail').find('.erweima').hide(300);
                        })
                    }
                }
            },
            error: function() {
                console.log(shibai)
            }
        })

    })

    // $.ajax({
    //     url: 'http:localhost:9090/cartlist',
    //     type: 'GET',
    //     dataType: 'json',
    //     cache: false,
    //     error: function() {
    //         console.log("error");
    //     },
    //     success: function(data) {
    //         var div = " <div class='cartGoods'>" +
    //             "<div class='yes'>" +
    //             "<span></span>" +
    //             "</div>" +
    //             "<div class='descrip'>" +
    //             "<a href='#'>" + "<img src=" + data[j].imgSrc + ">" + data[j].cartName + "</a>" +
    //             "</div>" +
    //             "<div class='price'>" +
    //             "<span>" + data[j].price + " 积分</span>" +
    //             "</div>" +
    //             "<div class='count'>" +
    //             "<div class='box'>" +
    //             "<span class='msCount'>-</span>" +
    //             "<input type='text' value='1' maxlength='2' class='sum'>" +
    //             "<span class='psCount'>+</span>" +
    //             "</div>" +
    //             "</div>" +
    //             "<div class='sumPrice'>" +
    //             "<span>" + data[j].sumprice + "</span>" +
    //             "</div>" +
    //             "<div class='operation'>" +
    //             "<span>删除</span>" +
    //             "</div>" +
    //             "</div>";
    //         for (j = 0; j < data.length; j++) {
    //             $("#cart").find('.cartList').append(div);
    //         }
    //     }
    // });

    // $('#detail').find('.insertCar').click(function() {
    //     var imgSrc = $('#detail').find('#img').attr('src');
    //     var goodsName = $('#detail').find('.goodsName').html();
    //     var integral = $('#detail').find('.integral').html();
    //     $.ajax({
    //         url: 'http:localhost:9090/cartlist',
    //         type: 'GET',
    //         dataType: 'json',
    //         data: { imgSrc: imgSrc, goodsName: goodsName, integral: integral },
    //         cache: false,
    //         error: function() {
    //             console.log("error");
    //         },
    //         success: function() {
    //             alert("添加成功")
    //         }
    //     })
    // })
})