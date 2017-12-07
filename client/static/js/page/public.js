window.onload = function() {
    (function cookies() {
        var cookie = document.cookie;
        var reg = /adminuserInfo=(.+)/;
        if (reg.test(cookie)) {
            var adminUser = reg.exec(cookie)[1];
            var adminUserName = JSON.parse(adminUser).username;
            $('.am-icon-dashboard').html('欢迎系统管理员：' + adminUserName);
        } else {
            window.location.href = '/admin/login.html';
        }
    })();
    $("#adminlogout").click(function() {
        $.ajax({
            url: '/admin/user/logout',
            type: 'GET',
            cache: false,
            dataType: 'json',
            success: function(data) {
                if (data.redirectUrl) {
                    window.location.href = data.redirectUrl;
                }
            },
            err: function(err) {
                console.log(err);
            }
        })
    });

    /**
     * 库存
     */
    document.getElementById('addInventory').onclick = function() {
        setInventory(1);
    }
    document.getElementById('subInventory').onclick = function() {
        setInventory(-1);
    }

    function setInventory(num) {
        var sum = parseInt($('#inventory')[0].value);
        if (sum + num <= 0) {
            $('#inventory')[0].value = 0;
        } else {
            $('#inventory')[0].value = sum + num;
        }
    }
}