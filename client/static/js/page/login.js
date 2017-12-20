window.onload = function() {
    var adminlogin = document.getElementById('adminlogin');
    var adminlogname = document.getElementById('adminlogname');
    var adminlogpass = document.getElementById('adminlogpass');
    (function cookies() {
        var cookie = document.cookie;
        var reg = /adminuserInfo=(.+)}(.+)/;
        alert(cookie)
        if (reg.test(cookie)) {
            window.location.href = '/admin/index.html'
        } else if (/adminuserInfo=(.+)/.test(cookie)) {
            window.location.href = '/admin/index.html'
        }
    })();
    adminlogin.onclick = adminlog;
    adminlogpass.onkeydown = function(event) {
        if (event.keyCode == 13) {
            adminlog();
        }
    }

    function adminlog() {
        if (adminlogname.value && adminlogpass.value) {
            $.ajax({
                url: '/admin/user/login',
                data: {
                    username: adminlogname.value,
                    password: adminlogpass.value
                },
                type: 'post',
                cache: false,
                dataType: 'json',
                success: function(data) {
                    if (data.userInfo) {
                        $('#loginmessage').html('登陆成功');
                        setTimeout(function() {
                            window.location.href = data.redirectUrl;
                        }, 1000)
                    } else {
                        $('#loginmessage').html('登陆失败，用户名或者密码错误！');
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            });
        } else {
            $('#loginmessage').html('用户名和密码不能为空！');
        }
    }
}