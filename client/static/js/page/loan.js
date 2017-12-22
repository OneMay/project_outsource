$(function() {
    var cookie = document.cookie;
    var userId, reg;
    if (cookie) {
        reg = cookie.match(/userInfo=(\S*)}/);
        userId = reg[1] ? reg[1].match(/_id":"(\S*)","username/)[1] : '';
    }


    $(".wrapper").find(".submit").click(function() {
        var obj = $("#loanname option:selected");
        var name = obj.text();
        var money = parseFloat($(".wrapper").find("input").val());
        $.ajax({
            url: "http://localhost:9090/api/set/loan",
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