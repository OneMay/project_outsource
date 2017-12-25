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

function checkEmil() {
    if (!(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test($regist.find('#emil').val()))) {
        $regist.find('.EmilWarning').html("你输入的邮箱格式有误，请重新输入！");
        return false;
    } else {
        $regist.find('.EmilWarning').html("");
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

function checkCode() {
    if ($regist.find("#haveCode:checked").val()) {
        $regist.find('.invitation_code').css("display", "block")
    } else {
        $regist.find('.invitation_code').css("display", "none")
    }

}

function registSubmit() {
    if ($regist.find('#phone').val() == '' || $regist.find('emil').val() == '' || $regist.find('#name').val() == '' || $regist.find('#bank').val() == '' || $regist.find('#password').val() == '' || $regist.find('#repassword').val() == '') {
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
                url: "/api/user/register",
                dataType: "json",
                data: {
                    username: $regist.find('#name').val(),
                    email: $regist.find('#emil').val(),
                    password: $regist.find('#password').val(),
                    phoneNumber: $regist.find('#phone').val(),
                    bankNumber: $regist.find('#bank').val(),
                    invitation_code_from_people: $regist.find('#invitation_code').val(),
                },
                success: function(messageInfo) {
                    if (messageInfo.code === 200) {
                        $regist.find('#msgWarning').html('注册成功！3s后自动跳转到登录界面...')
                        setTimeout(function() {
                            window.location.href = "login.html";
                        }, 3000);
                    } else {
                        $regist.find('#msgWarning').html('注册失败，请稍后重试!');
                    }
                },
                error: function(messageInfo) {
                    if (messageInfo === 400) {

                    }
                }
            });
        }
    }
}

var url = document.referrer;

function loginSubmit() {
    $.ajax({
        type: "post",
        url: "/api/user/login",
        datatype: "json",
        data: { phoneNumber: $login.find('#phone').val(), password: $login.find('#password').val() },
        success: function(messageInfo) {
            if (messageInfo.code === 200) {
                $login.find('#loginmsg').html("登录成功");
                setTimeout(() => {
                    window.location.href = url;
                }, 3000);
            } else {
                $login.find('#loginmsg').html("账号或密码错误");
            }
        },
        error: function(messageInfo) {
            if (messageInfo === 404) {
                $login.find('#loginmsg').html(messageInfo.message)
            }
        }
    })
}

function logout() {
    $.ajax({
        type: "get",
        url: "/api/user/logout",
        success: function() {
            window.location.reload();
            alert("退出成功");
        }
    })
}

var cookie = document.cookie;
var username, reg;
if (cookie) {
    reg = cookie.match(/userInfo=(\S*)}/);
    username = reg[1] ? reg[1].match(/username":"(\S*)","phone/)[1] : '';
    $("#header").find(".login").css("display", "none");
    $("#header").find(".username").html(decodeURI(username));
    $("#header").find(".logout").css("display", "block");
} else {
    $("#header").find(".login").css("display", "block");
    $("#header").find(".logout").css("display", "none");
}