var express = require('express');
var router = express.Router();
var cookies = require('cookies');
var User = require('../models/user');
var InvitationCode = require('../models/invitationcode')
    //统一返回格式
var responseData;
router.use(function(req, res, next) {
    // res.cookies = new cookies(req, res);
    responseData = {
        code: 200,
        message: ''
    }
    next();
})
router.use(function(req, res, next) {
        var originalUrl = ['/api/user/']
        if (originalUrl.indexOf(req.originalUrl) >= 0) {
            if (req.session.user_id) {
                User.findOne({
                    _id: req.session.user_id
                }).then(function(userInfo) {
                    if (userInfo) {
                        console.log(userInfo)
                        res.cookies.set('userInfo', JSON.stringify({
                            _id: userInfo._id,
                            username: userInfo.username,
                            phoneNumber: userInfo.phoneNumber,
                            invitation_code: userInfo.invitation_code
                        }), {
                            'httpOnly': false,
                            'path': '/'
                        });
                        next()
                    }
                })
            } else {
                res.cookies.set('serInfo', null);
                res.redirect(301, '/login.html');
                return;
            }
        } else {
            next();
        }
    })
    /**
     * 用户注册
     *  注册逻辑
     *  1.用户名不能为空
     *  2.密码不能为空
     *  3.银行卡号不能为空
     *  3.电话号码是否已经被注册
     */
router.post('/user/register', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var phoneNumber = req.body.phoneNumber;
    var bankNumber = req.body.bankNumber;
    var invitation_code_from_people = req.body.invitation_code_from_people || '';
    var reg1 = /tuijianFirst/;
    var reg2 = /tuijianSecond/;
    var reg3 = /tuijianinvitation001/;
    //用户是否为空
    if (!(username && password && phoneNumber && bankNumber)) {
        responseData.code = 400;
        responseData.message = '填写内容不能为空！';
        res.json(responseData);
        return;
    } else {
        if (invitation_code_from_people) {
            if (reg1.test(invitation_code_from_people) || reg2.test(invitation_code_from_people) || reg3.test(invitation_code_from_people)) {
                //用户是否已经被注册
                User.findOne({
                    phoneNumber: phoneNumber
                }).then(function(userInfo) {
                    //console.log(userInfo)
                    if (userInfo) {
                        //数据库有此用户，已经被注册
                        responseData.code = 400;
                        responseData.message = '电话号码已经被注册了';
                        res.json(responseData);
                        return;
                    } else {
                        InvitationCode.count().then(function(count) {
                            if (invitation_code_from_people == 'tuijianinvitation001') {
                                //保存用户信息到数据库
                                var user = new User({
                                    username: username,
                                    password: password,
                                    phoneNumber: phoneNumber,
                                    bankNumber: bankNumber,
                                    invitation_code_from_people: 'tuijianinvitation001',
                                    invitation_code: 'tuijianFirst' + (count + 1),
                                    power: 1,
                                    invitation_people: 80
                                });
                                var invitationCode = new InvitationCode({
                                    invitation_code: 'tuijianFirst' + (count + 1)
                                });
                                invitationCode.save();
                                return user.save();
                            } else if (reg1.test(invitation_code_from_people)) {
                                User.findOne({
                                    invitation_code: invitation_code_from_people
                                }).then(function(userFromInfo) {
                                    if (userFromInfo && userFromInfo.invitated_people < userFromInfo.invitation_people) {
                                        var _id = userFromInfo._id;
                                        userFromInfo.invitated_people = userFromInfo.invitated_people + 1;
                                        delete userFromInfo._id;
                                        User.update({ _id: _id }, userFromInfo, function(err) {});
                                        var user = new User({
                                            username: username,
                                            password: password,
                                            phoneNumber: phoneNumber,
                                            bankNumber: bankNumber,
                                            invitation_code_from_people: invitation_code_from_people,
                                            invitation_code: 'tuijianSecond' + (count + 1),
                                            power: 2,
                                            invitation_people: 80
                                        });
                                        var invitationCode = new InvitationCode({
                                            invitation_code: 'tuijianSecond' + (count + 1)
                                        });
                                        invitationCode.save();
                                        return user.save();
                                    } else {
                                        responseData.code = 400;
                                        responseData.message = '此推荐码使用的次数已经用完！';
                                        res.json(responseData);
                                        return;
                                    }
                                })
                            } else if (reg2.test(invitation_code_from_people)) {
                                User.findOne({
                                    invitation_code: invitation_code_from_people
                                }).then(function(userFromInfo) {
                                    if (userFromInfo && userFromInfo.invitated_people < userFromInfo.invitation_people) {
                                        var _id = userFromInfo._id;
                                        userFromInfo.invitated_people = userFromInfo.invitated_people + 1;
                                        delete userFromInfo._id;
                                        User.update({ _id: _id }, userFromInfo, function(err) {});
                                        var user = new User({
                                            username: username,
                                            password: password,
                                            phoneNumber: phoneNumber,
                                            bankNumber: bankNumber,
                                            invitation_code_from_people: invitation_code_from_people
                                        });
                                        return user.save();
                                    } else {
                                        responseData.code = 400;
                                        responseData.message = '此推荐码使用的次数已经用完！';
                                        res.json(responseData);
                                        return;
                                    }
                                })
                            }
                        })
                    }
                }).then(function(newUserInfo) {
                    // console.log(newUserInfo);
                    responseData.message = '注册成功';
                    res.json(responseData);
                })
            } else {
                responseData.code = 400;
                responseData.message = '推荐码无效！';
                res.json(responseData);
                return;
            }
        } else {
            User.findOne({
                phoneNumber: phoneNumber
            }).then(function(userInfo) {
                //console.log(userInfo)
                if (userInfo) {
                    //数据库有此用户，已经被注册
                    responseData.code = 400;
                    responseData.message = '电话号码已经被注册了';
                    res.json(responseData);
                    return;
                } else {
                    var user = new User({
                        username: username,
                        password: password,
                        phoneNumber: phoneNumber,
                        bankNumber: bankNumber
                    });
                    return user.save();
                }
            }).then(function(userInfo) {
                responseData.message = '注册成功';
                return res.json(responseData);
            })
        }
    }
})

/**
 * 登录
 * 用户名，密码
 */
router.post('/user/login', function(req, res, next) {
    var phoneNumber = req.body.phoneNumber;
    var password = req.body.password;
    if (phoneNumber && password) {
        User.findOne({
            phoneNumber: phoneNumber,
            password: password
        }).then(function(userInfo) {
            if (!userInfo) {
                responseData.code = 404;
                responseData.message = '用户名或密码错误';
                res.json(responseData);
                return;
            }
            if (userInfo) {
                req.session.user_id = userInfo._id;
                responseData.code = 200;
                responseData.message = '登陆成功';
                responseData.redirectUrl = '/admin/index.html';
                var userInfoL = {
                    userInfo: {
                        _id: userInfo._id,
                        username: userInfo.username,
                        phoneNumber: userInfo.phoneNumber,
                        invitation_code: userInfo.invitation_code
                    }
                }
                Object.assign(responseData, userInfoL);

                res.cookies.set('userInfo', JSON.stringify({
                    _id: userInfo._id,
                    username: encodeURI(userInfo.username),
                    phoneNumber: userInfo.phoneNumber,
                    invitation_code: userInfo.invitation_code
                }), {
                    'httpOnly': false,
                    'path': '/'
                });
                res.json(responseData);
                return;

            }
        })
    }
})

/**
 * 退出
 */

router.get('/user/logout', function(req, res) {
    if (req.headers.cookie) {
        responseData.message = "退出成功！";
        responseData.redirectUrl = '/';
        res.cookies.set('userInfo', null, {
            'httpOnly': false,
            'path': '/'
        });
        delete req.session.user_id;
        res.json(responseData);
        return;
    } else {
        responseData.code = 500;
        responseData.message = "退出失败！";
        res.json(responseData);
        return;
    }

})

module.exports = router;