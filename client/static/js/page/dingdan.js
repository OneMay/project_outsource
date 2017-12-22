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
    $.ajax({
        url: "http://localhost:9090/api/get/loanList",
        type: "post",
        dataType: "json",
        data: { _userId: userId },
        success: function(messageInfo) {
            var loanlength = messageInfo.loanList.length;
            if (loanlength == 0) {
                $('#cart').find('.emptyLoan').css("display", "block")
                $('#cart').find('.loanList').css("display", "none")
            } else {
                $('#cart').find('.emptyLoan').css("display", "none")
                $('#cart').find('.loanList').css("display", "block")
                for (var i = 0; i < loanlength; i++) {
                    var name = messageInfo.loanList[i].name;
                    var money = messageInfo.loanList[i].money;
                    var time = messageInfo.loanList[i].time;
                    var success = messageInfo.loanList[i].success;
                    var fail = messageInfo.loanList[i].fail
                    var a = function() {
                        if (success == true) {
                            if (fail == false) {
                                return "审核通过";
                            }
                        } else {
                            if (fail == false) {
                                return "审核中";
                            } else {
                                return "审核未通过";
                            }
                        }
                    };
                    var b = function() {
                        if (fail == true) {
                            return "贷款失败";
                        } else {
                            if (success == false) {
                                return "审核中";
                            } else {
                                return "贷款成功";
                            }
                        }
                    };

                    var div = "<div class='loanCart'>" +
                        "<span class='name'>" + name + "</span>" +
                        "<span class='count'>" + money + "</span>" +
                        "<span class='consignee'>" + a() + "</span>" +
                        "<span class='consigneePhone'>" + b() + "</span>" +
                        "<span class='consigneeAddress'>" + time + "</span>" +
                        "</div>";
                    $("#cart").find('.loanList').append(div);
                }

            }
        }
    })
    $.ajax({
        url: "http://localhost:9090/api/get/WithdrawalsList",
        type: "post",
        dataType: "json",
        data: { _userId: userId },
        success: function(messageInfo) {
            var Withdrawalslength = messageInfo.WithdrawalsList.length;
            if (Withdrawalslength == 0) {
                $('#cart').find('.emptyWithdrawals').css("display", "block")
                $('#cart').find('.Withdrawals').css("display", "none")
            } else {
                $('#cart').find('.emptyWithdrawals').css("display", "none")
                $('#cart').find('.Withdrawals').css("display", "block")
                for (var i = 0; i < Withdrawalslength; i++) {
                    var Withdrawalsmoney = messageInfo.WithdrawalsList[i].money;
                    var Withdrawalstime = messageInfo.WithdrawalsList[i].time;
                    var Withdrawalssuccess = function() {
                        if (messageInfo.WithdrawalsList[i].success == true) {
                            return "提现成功";
                        } else {
                            return "审核中";
                        }
                    };
                    var div = "<div class='WithdrawalsCart'>" +
                        "<span class='count'>" + Withdrawalsmoney + "</span>" +
                        "<span class='consignee'>" + Withdrawalssuccess() + "</span>" +
                        "<span class='consigneeAddress'>" + Withdrawalstime + "</span>" +
                        "</div>";
                    $("#cart").find('.WithdrawalsList').append(div);
                }

            }
        }
    })
    $('#cart').find('.cartopen').on("click", function() {
        $('#cart').find('.cartbox').toggle(300)
    })
    $('#cart').find('.loanopen').on("click", function() {
        $('#cart').find('.loanbox').toggle(300)
    })
    $('#cart').find('.Withdrawalsopen').on("click", function() {
        $('#cart').find('.Withdrawalsbox').toggle(300)
    })
})