var $login = $('#login');
var $regist = $('#regist');

function checkPhone() {
    if (!(/^1(3|4|5|7|8)\d{9}$/.test($regist.find('#phone').val()))) {
        $regist.find('.PhoneWarning').css("display", "block");
        return false;
    } else {
        $regist.find('.PhoneWarning').css("display", "none");
        return true;
    }
};

function checkPassword() {
    if (!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test($regist.find('#password').val()))) {
        $regist.find('.PasswordWarning').css("display", "block");
        return false;
    } else {
        $regist.find('.PasswordWarning').css("display", "none");
        return true;
    }
}

function registSubmit() {
    if (!($regist.find('#repassword').val() == $regist.find('#password').val())) {
        $regist.find('.RePasswordWarning').css("display", "block");
        return false;
    } else {
        $regist.find('.RePasswordWarning').css("display", "none");
        $.ajax({
            type: "post",
            url: "http://localhost:9090/regist",
            dataType: "json",
            data: { username: $regist.find('#phone').val(), password: $regist.find('#password').val(), repassword: $regist.find('#repassword').val() },
            success: function(result) {
                if (result.code === 1) {
                    alert('注册成功！3s后自动跳转到登录界面...')
                    setTimeout(function() {
                        window.location.href = "regist";
                    }, 3000);
                } else {
                    alert('注册失败，请稍后重试!');
                }
            },
            error: function(result) {}
        });
    }
}

function loginSubmit() {
    $.ajax({
        type: "post",
        url: "http://localhost:9090/login",
        datatype: "json",
        data: { username: $login.find('#phone').val(), password: $login.find('#password').val() },
        success: function(result) {
            if (result.code === 1) {
                alert('登录成功！')
                window.location.href = "home";
            } else {
                alert('登录失败，请稍后重试!');
            }
        },
        error: function(result) {}
    })
}