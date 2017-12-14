$(function() {
    var cookie = document.cookie;
    var userId, reg;
    if (cookie) {
        reg = cookie.match(/userInfo=(\S*)}/);
        userId = reg[1] ? reg[1].match(/_id":"(\S*)","username/)[1] : '';
    }

    $.ajax({
        url: "http://localhost:9090/api/get/orderList",
        type: "post",
        dataType: "json",
        data: { _userId: userId },
        success: function(messageInfo) {
            var length = messageInfo.orderList.length;
            if (length == 0) {
                $('#cart').find('.emptyCart').css("display", "block")
                $('#cart').find('.goodsCart').css("display", "none")
            } else {
                $('#cart').find('.emptyCart').css("display", "none")
                $('#cart').find('.goodsCart').css("display", "block")
                for (var i = 0; i < length; i++) {
                    var mallName = messageInfo.orderList[i].mallName;
                    var inventory = messageInfo.orderList[i].inventory;
                    var consignee = messageInfo.orderList[i].consignee;
                    var consigneePhone = messageInfo.orderList[i].consigneePhone;
                    var consigneeAddress = messageInfo.orderList[i].consigneeAddress;
                    var integration = messageInfo.orderList[i].integration;
                    var fail = messageInfo.orderList[i].fail;
                    var isExamine = function() {
                        if (messageInfo.orderList[i].isExamine == true) {
                            if (fail == true) {
                                return "订单失败";
                            } else {
                                return "审核通过";
                            }
                        } else {
                            return "审核中";
                        }
                    };
                    var Deliver_goods = function() {
                        if (messageInfo.orderList[i].Deliver_goods == true) {
                            return "已发货";
                        } else {
                            return "未发货"
                        }
                    };
                    var div = "<div class='cartGoods'>" +
                        "<span class='name'>" + mallName + "</span>" +
                        "<span class='count'>" + inventory + "</span>" +
                        "<span class='consignee'>" + consignee + "</span>" +
                        "<span class='consigneePhone'>" + consigneePhone + "</span>" +
                        "<span class='consigneeAddress'>" + consigneeAddress + "</span>" +
                        "<span class='integration'>" + integration + "</span>" +
                        "<span class='isExamine'>" + isExamine() + " </span>" +
                        "<span class='Deliver_goods'>" + Deliver_goods() + "</span>" +
                        "</div>";
                    $("#cart").find('.cartList').append(div);
                }

            }
        }
    })
})