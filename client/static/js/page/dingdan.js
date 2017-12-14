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
            var i;
            var div = "<div class='cartGoods'>" +
                "<span class='name'>" + messageInfo.orderList[i]._mallId + "</span>" +
                "<span class='count'>" + messageInfo.orderList[i].inventory + "</span>" +
                "<span class='consignee'>" + messageInfo.orderList[i].consignee + "</span>" +
                "<span class='consigneePhone'>" + messageInfo.orderList[i].consigneePhone + "</span>" +
                "<span class='consigneeAddress'>" + messageInfo.orderList[i].consigneeAddress + "</span>" +
                "<span class='integration'>" + messageInfo.orderList[i].integration + "</span>" +
                "<span class='isExamine'>" + messageInfo.orderList[i].isExamine + " </span>" +
                "<span class='Deliver_goods'>" + messageInfo.orderList[i].Deliver_goods + "</span>" +
                "</div>";
            alert(messageInfo.orderList.length)
            for (i = 0; i < messageInfo.orderList.length; i++) {
                $("#cart").find('.cartList').append(div);
            }

        }
    })
})