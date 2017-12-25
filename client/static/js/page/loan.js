$(function() {
    var cookie = document.cookie;
    var userId, reg;
    if (cookie) {
        reg = cookie.match(/userInfo=(\S*)}/);
        userId = reg[1] ? reg[1].match(/_id":"(\S*)","username/)[1] : '';
    }


    $(".wrap").find("#btn").click(function() {
        var obj = $("#loanname option:selected");
        var name = obj.text();
        var money = parseFloat($(".wrap").find(".input-number").val());
        $.ajax({
            url: "/api/set/loan",
            type: "post",
            dataType: "json",
            data: { _userId: userId, name: name, money: money },
            success: function() {
                alert(money)
                alert("成功")
            },
            error: function() {
                alert("失败")
            }
        })
    })
})