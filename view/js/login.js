var $login = $('#login');
var $regist = $('#regist');

function checkPhone() {
    if (!(/^1(3|4|5|7|8)\d{9}$/.test($regist.find('#phone').val()))) {
        $regist.find('.PhoneWarning').html("你输入的电话号码有误，请重新输入！");
        return false;
    } else {
        $regist.find('.PhoneWarning').html("");
        return true;
    }
};

function checkName() {
    if ($regist.find('#name').val() == '') {
        $regist.find('.nameWarning').html("姓名不能为空");
        return false;
    } else {
        $regist.find('.nameWarning').html("");
        return true;
    }
};

function checkBank() {
    if (!($regist.find('#bank').val().length == 19)) {
        $regist.find('.BankWarning').html("你输入的银行卡号有误，请重新输入！");
        return false;
    } else {
        $regist.find('.BankWarning').html("");
        return true;
    }
};

function checkPassword() {
    if (!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test($regist.find('#password').val()))) {
        $regist.find('.PasswordWarning').html("密码格式有误，请重新输入！");
        return false;
    } else {
        $regist.find('.PasswordWarning').html("");
        return true;
    }
}

function registSubmit() {
    if ($regist.find('#phone').val() == '' || $regist.find('#name').val() == '' || $regist.find('#bank').val() == '' || $regist.find('#password').val() == '' || $regist.find('#repassword').val() == '') {
        $regist.find('.msgWarning').html("信息不能为空");
        return false;
    } else {
        $regist.find('.msgWarning').html("");
        if (!($regist.find('#repassword').val() == $regist.find('#password').val())) {
            $regist.find('.RePasswordWarning').html("两次密码不一致，请核对后输入！");
            return false;
        } else {
            $regist.find('.RePasswordWarning').html("");
            $.ajax({
                type: "post",
                url: "http://localhost:9090/api/user/register",
                dataType: "json",
                data: {
                    username: $regist.find('#name').val(),
                    password: $regist.find('#password').val(),
                    phoneNumber: $regist.find('#phone').val(),
                    bankNumber: $regist.find('#bank').val(),
                    invitation_code_from_people: $regist.find('invitation_code').val(),
                },
                success: function(messageInfo) {
                    if (messageInfo.code === 200) {
                        alert('注册成功！3s后自动跳转到登录界面...')
                        setTimeout(function() {
                            window.location.href = "regist";
                        }, 3000);
                    } else {
                        alert('注册失败，请稍后重试!');
                    }
                },
                error: function(messageInfo) {}
            });
        }
    }
}

function loginSubmit() {
    $.ajax({
        type: "post",
        url: "http://localhost:9090/api/user/login",
        datatype: "json",
        data: { username: $login.find('#phone').val(), password: $login.find('#password').val() },
        success: function(messageInfo) {
            if (messageInfo.code === 200) {
                alert('登录成功！')
                window.location.href = "home";
            } else {
                alert('登录失败，请稍后重试!');
            }
        },
        error: function(messageInfo) {}
    })
}