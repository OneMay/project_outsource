var express = require('express');
var router = express.Router();
var cookies = require('cookies');
var moment = require('moment');
var User = require('../models/user');
var InvitationCode = require('../models/invitationcode');
var Product = require('../models/product');
var Order = require('../models/order');
var Loan = require('../models/loan');
var MembersDemeanor = require('../models/Members_demeanor');
var Withdrawals = require('../models/withdrawals');
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
Date.prototype.Format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份         
        "d+": this.getDate(), //日         
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时         
        "H+": this.getHours(), //小时         
        "m+": this.getMinutes(), //分         
        "s+": this.getSeconds(), //秒         
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度         
        "S": this.getMilliseconds() //毫秒         
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
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
                            invitation_code: userInfo.invitation_code,
                            member_mark: userInfo.member_mark
                        }), {
                            'httpOnly': false,
                            'path': '/'
                        });
                        next()
                    }
                })
            } else {
                res.cookies.set('serInfo', null, {
                    'httpOnly': false,
                    'path': '/'
                });
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
    var email = req.body.email || '';
    var reg1 = /tuijianinvitationFirst/;
    var reg2 = /tuijianinvitation001/;
    //用户是否为空
    if (!(username && password && phoneNumber && bankNumber)) {
        responseData.code = 400;
        responseData.message = '填写内容不能为空！';
        res.json(responseData);
        return;
    } else {
        if (invitation_code_from_people) {
            if (reg1.test(invitation_code_from_people) || invitation_code_from_people == "tuijianinvitation001") {
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
                                var random = parseInt((Math.random() * 16358200 + 108004550), 10);
                                //保存用户信息到数据库
                                var user = new User({
                                    username: username,
                                    password: password,
                                    phoneNumber: phoneNumber,
                                    bankNumber: bankNumber,
                                    invitation_code_from_people: 'tuijianinvitation001',
                                    invitation_code: 'tuijianinvitationFirst' + random + (count + 1),
                                    power: 0,
                                    email: email
                                });
                                var invitationCode = new InvitationCode({
                                    invitation_code: 'tuijianinvitationFirst' + random + (count + 1)
                                });
                                invitationCode.save();
                                return user.save();
                            } else if (reg1.test(invitation_code_from_people)) {
                                var random = parseInt((Math.random() * 16358200 + 108004550), 10);
                                var user = new User({
                                    username: username,
                                    password: password,
                                    phoneNumber: phoneNumber,
                                    bankNumber: bankNumber,
                                    invitation_code_from_people: invitation_code_from_people,
                                    invitation_code: 'tuijianinvitationFirst' + random + (count + 1),
                                    power: 0,
                                    email: email
                                });
                                var invitationCode = new InvitationCode({
                                    invitation_code: 'tuijianinvitationFirst' + random + (count + 1)
                                });
                                invitationCode.save();
                                return user.save();
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
                    InvitationCode.count().then(function(count) {
                        var random = parseInt((Math.random() * 16358200 + 108004550), 10);
                        var user = new User({
                            username: username,
                            password: password,
                            phoneNumber: phoneNumber,
                            bankNumber: bankNumber,
                            email: email,
                            invitation_code_from_people: 'tuijianinvitation001',
                            invitation_code: 'tuijianinvitationFirst' + random + (count + 1)
                        });
                        var invitationCode = new InvitationCode({
                            invitation_code: 'tuijianinvitationFirst' + random + (count + 1)
                        });
                        invitationCode.save();
                        return user.save();
                    })
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
                        invitation_code: userInfo.invitation_code,
                        member_mark: userInfo.member_mark
                    }
                }
                Object.assign(responseData, userInfoL);

                res.cookies.set('userInfo', JSON.stringify({
                    _id: userInfo._id,
                    username: encodeURI(userInfo.username),
                    phoneNumber: userInfo.phoneNumber,
                    invitation_code: userInfo.invitation_code,
                    member_mark: userInfo.member_mark
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
    //获取积分
router.post('/user/member_mark', function(req, res, next) {
        var _id = req.body._id;
        if (_id) {
            User.findOne({
                _id: _id
            }).then(function(userInfo) {
                if (userInfo) {
                    var userInfoL = {
                        userInfo: {
                            _id: userInfo._id,
                            username: userInfo.username,
                            member_mark: userInfo.member_mark
                        }
                    }
                    Object.assign(responseData, userInfoL);
                    responseData.code = 200;
                    responseData.message = "成功";
                    res.json(responseData);
                } else {
                    var userInfoL = {
                        userInfo: {}
                    }
                    Object.assign(responseData, userInfoL);
                    responseData.code = 404;
                    responseData.message = "失败";
                    res.json(responseData);
                }
            })
        } else {
            responseData.code = 404;
            responseData.message = "失败";
            res.json(responseData);
        }
    })
    /**
     * 获取用户列表
     */


/**
 *会员商城产品列表
 */
router.get('/get/mallpageList', function(req, res, next) {
    var page = 0;
    var sum = 0;
    // var count = 6;
    // var index = page * count;
    Product.count().then(function(count) {
        if (count > 0) {
            Product.find().sort({ '_id': -1 }).then(function(productListInfo) {
                var productList = [];
                productListInfo.forEach(function(value, index) {
                    productList.push({
                        _id: value._id,
                        ProductIntegration: value.ProductIntegration,
                        productDescription: value.productDescription,
                        productImageUrl: value.productImageUrl,
                        productInventory: value.productInventory,
                        productName: value.productName,
                        number: (index + 1)
                    })
                    sum = index;
                })

                responseData.message = '查询成功';
                if (sum + 1 == productListInfo.length) {
                    var productList1 = {
                            productList,
                            count: count
                        }
                        //responseData.productList = productList;
                    Object.assign(responseData, productList1);
                    res.json(responseData);
                }
            })
        } else {
            responseData.code = '404';
            responseData.message = '数据库无记录';
            var productList1 = {
                    productList: [],
                    count: 0,
                }
                //responseData.productList = productList;
            Object.assign(responseData, productList1);
            return res.json(responseData);
        }
    })

})

/**
 *单个会员商城产品
 */
router.post('/get/mallpageItem', function(req, res, next) {
    var page = 0;
    var sum = 0;
    var _id = req.body._id;
    // var count = 6;
    // var index = page * count;
    Product.findOne({
        _id: _id
    }).then(function(productListInfo) {
        if (productListInfo) {
            var productList = productListInfo;

            responseData.message = '查询成功';
            var productList1 = {
                    productList
                }
                //responseData.productList = productList;
            Object.assign(responseData, productList1);
            res.json(responseData);
        } else {
            responseData.code = 404;
            responseData.message = '数据库无记录';
            var productList = [];
            var productList1 = {
                    productList
                }
                //responseData.productList = productList;
            Object.assign(responseData, productList1);
            res.json(responseData);
        }

    })

})

/**
 * 会员商品订购
 */
router.post('/set/shoppingCart', function(req, res, next) {
    var _userId = req.body._userId;
    var mallObj = JSON.parse(req.body.mallObj);
    Product.findOne({
        _id: mallObj._mallId
    }).then(function(productInfo) {
        if (productInfo && productInfo.productInventory > 0 && productInfo.productInventory >= mallObj.inventory) {
            User.findOne({
                _id: _userId
            }).then(function(userInfo) {
                if (userInfo) {
                    if (mallObj.integration && (parseInt(userInfo.member_mark) >= parseInt(productInfo.ProductIntegration)) && (parseInt(productInfo.ProductIntegration) == parseInt(mallObj.integration))) {
                        var productInfo_id = productInfo._id;
                        productInfo.productInventory = (parseInt(productInfo.productInventory) - parseInt(mallObj.inventory)) > 0 ? (parseInt(productInfo.productInventory) - parseInt(mallObj.inventory)) : 0;
                        delete productInfo._id;
                        Product.update({ _id: productInfo_id }, productInfo, function(err) {});
                        var userInfo_id = userInfo._id;
                        userInfo.member_mark = (parseInt(userInfo.member_mark) - parseInt(productInfo.ProductIntegration)) > 0 ? (parseInt(userInfo.member_mark) - parseInt(productInfo.ProductIntegration)) : 0;
                        delete userInfo._id;
                        User.update({ _id: userInfo_id }, userInfo, function(err) {});
                        var order = new Order({
                            _userId: _userId,
                            _mallId: mallObj._mallId,
                            mallName: productInfo.productName,
                            inventory: mallObj.inventory,
                            consignee: mallObj.consignee,
                            consigneePhone: mallObj.consigneePhone,
                            consigneeAddress: mallObj.consigneeAddress,
                            integration: mallObj.integration,
                            money: 0,
                            isExamine: true,
                            time: moment().format('YYYY-MM-DD HH:mm:ss')
                        })
                        order.save();
                        responseData.code = 200;
                        responseData.message = '成功';
                        res.json(responseData);
                        return;
                    } else {
                        var productInfo_id = productInfo._id;
                        productInfo.productInventory = (parseInt(productInfo.productInventory) - parseInt(mallObj.inventory)) > 0 ? (parseInt(productInfo.productInventory) - parseInt(mallObj.inventory)) : 0;
                        delete productInfo._id;
                        Product.update({ _id: productInfo_id }, productInfo, function(err) {});
                        var userInfo_id = userInfo._id;
                        userInfo.member_mark = (parseInt(userInfo.member_mark) - parseInt(mallObj.integration)) > 0 ? (parseInt(userInfo.member_mark) - parseInt(mallObj.integration)) : 0;
                        delete userInfo._id;
                        User.update({ _id: userInfo_id }, userInfo, function(err) {});
                        var order = new Order({
                            _userId: _userId,
                            _mallId: mallObj._mallId,
                            mallName: productInfo.productName,
                            inventory: mallObj.inventory,
                            consignee: mallObj.consignee,
                            consigneePhone: mallObj.consigneePhone,
                            consigneeAddress: mallObj.consigneeAddress,
                            integration: mallObj.integration,
                            money: parseInt(productInfo.ProductIntegration) * parseInt(mallObj.inventory) - parseInt(userInfo.member_mark),
                            isExamine: false,
                            time: moment().format('YYYY-MM-DD HH:mm:ss')
                        })
                        order.save();
                        responseData.code = 200;
                        responseData.message = '成功';
                        res.json(responseData);
                        return;
                    }
                } else {
                    responseData.code = 404;
                    responseData.message = '无此用户信息';
                    res.json(responseData);
                    return;
                }
            })
        } else {
            responseData.code = 404;
            responseData.message = '无此商品信息或者库存不足';
            res.json(responseData);
            return;
        }
    })
})

/**
 * 用户订单查看
 */
router.post('/get/orderList', function(req, res, next) {
    var _id = req.body._userId || '233';
    var sum = 0;
    User.findOne({
        _id: _id
    }).then(function(userInfo) {
        if (userInfo) {
            Order.find({
                _userId: _id
            }).then(function(orderListInfo) {
                if (orderListInfo) {
                    var orderList = orderListInfo;

                    responseData.message = '查询成功';
                    var orderList1 = {
                        orderList
                    }
                    Object.assign(responseData, orderList1);
                    return res.json(responseData);

                } else {
                    var orderList = [];
                    responseData.code = 404;
                    responseData.message = '数据库无此用户订单记录';
                    var orderList1 = {
                        orderList
                    }
                    Object.assign(responseData, orderList1);
                    return res.json(responseData);
                }
            })
        } else {
            responseData.code = 404;
            responseData.message = '数据库无此用户';
            return res.json(responseData)
        }
    })
})


/**
 * /贷款订单录入
 */
router.post('/set/loan', function(req, res, next) {
    var _userId = req.body._userId;
    var name = req.body.name;
    var money = req.body.money;
    if (_userId && name > 0 && money) {
        User.findOne({
            _id: _userId
        }).then(function(userInfo) {
            if (userInfo) {
                var loan = new Loan({
                    _userId: _userId,
                    name: name,
                    money: parseFloat(money) > 0 ? parseFloat(money) : 0,
                    fail: false,
                    success: false,
                    time: moment().format('YYYY-MM-DD HH:mm:ss')
                })
                loan.save();
                responseData.code = 200;
                responseData.message = '成功';
                res.json(responseData);
                return;
            } else {
                responseData.code = 404;
                responseData.message = '无此用户信息';
                res.json(responseData);
                return;
            }
        })
    } else {
        responseData.code = 404;
        responseData.message = '信息有误';
        res.json(responseData);
        return;
    }

})

//文章列表
/**
 * 通过limit(Number)限制每次取到的数据条数，
 * skip():忽略数据的条数
 * 每页显示2条
 * 1:1-2,skip:0->(当前页-1)*limit
 * 2:3-4,skip:2
 * 实现分页
 */
router.get('/get/membersDemeanorList', function(req, res, next) {
    var currentPage = parseInt(req.query.currentPage) || 1;
    var limit = 6;
    var page = 0;
    var sum = 0;
    // var count = 6;
    // var index = page * count;
    MembersDemeanor.count().then(function(count) {
        if (count > 0) {
            //计算总页数
            page = Math.ceil(count / limit);
            //取值不能超过page
            currentPage = Math.min(currentPage, page)
                //取值不能小于1；
            currentPage = Math.max(currentPage, 1);
            var skip = (currentPage - 1) * limit;
            MembersDemeanor.find().sort({ '_id': -1 }).limit(limit).skip(skip).then(function(membersDemeanorListInfo) {
                //console.log(productList);
                //var results = productList.slice(index,index + count);
                var membersDemeanorList = [];
                membersDemeanorListInfo.forEach(function(value, index) {
                    membersDemeanorList.push({
                        _id: value._id,
                        title: value.title,
                        content: value.content,
                        membersDemeanoPhoto: value.membersDemeanoPhoto,
                        time: new Date(value.time).Format("yyyy-MM-dd HH:mm:ss"),
                        number: (currentPage - 1) * 6 + (index + 1)
                    })
                    sum = index;
                })

                responseData.message = '查询成功';
                if (sum + 1 == membersDemeanorListInfo.length) {
                    var membersDemeanorList1 = {
                            membersDemeanorList,
                            currentPage: currentPage,
                            page: page,
                            count: count,
                            limit: limit
                        }
                        //responseData.productList = productList;
                    Object.assign(responseData, membersDemeanorList1);
                    res.json(responseData);
                }
            })
        } else {
            responseData.code = '404';
            responseData.message = '数据库无记录';
            var membersDemeanorList1 = {
                    membersDemeanorList: [],
                    currentPage: 1,
                    page: page,
                    count: 0,
                    limit: limit
                }
                //responseData.productList = productList;
            Object.assign(responseData, membersDemeanorList1);
            return res.json(responseData);
        }
    })

})

//文章单个
router.post('/get/membersDemeanorItem', function(req, res, next) {
    var _id = req.body._id;
    MembersDemeanor.findOne({
        _id: _id
    }).then(function(membersDemeanorListInfo) {
        if (membersDemeanorListInfo) {
            responseData.message = '查询成功';
            var membersDemeanorList = membersDemeanorListInfo;
            var membersDemeanorList1 = {
                    membersDemeanorList
                }
                //responseData.productList = productList;
            Object.assign(responseData, membersDemeanorList1);
            res.json(responseData);
        } else {
            responseData.code = '404';
            responseData.message = '数据库无记录';
            var membersDemeanorList1 = {
                    membersDemeanorList: {}
                }
                //responseData.productList = productList;
            Object.assign(responseData, membersDemeanorList1);
            return res.json(responseData);
        }
    })

})

/**
 * /提现录入
 */
router.post('/set/withdrawals', function(req, res, next) {
    var _userId = req.body._userId;
    var money = req.body.money;
    if (_userId && name > 0 && money) {
        User.findOne({
            _id: _userId
        }).then(function(userInfo) {
            if (userInfo && userInfo.member_mark >= 500 && (money <= userInfo.member_mark)) {
                var id = userInfo._id;
                userInfo.member_mark = (parseInt(userInfo.member_mark) - parseInt(money)) > 0 ? (parseInt(userInfo.member_mark) - parseInt(money)) : 0;
                delete userInfo._id;
                User.update({ _id: id }, userInfo, function(err) {});
                var withdrawals = new Withdrawals({
                    _userId: _userId,
                    money: parseFloat(money) > 0 ? parseFloat(money) : 0,
                    success: false,
                    time: moment().format('YYYY-MM-DD HH:mm:ss')
                })
                withdrawals.save();
                responseData.code = 200;
                responseData.message = '成功，将在下月15号结算处理';
                res.json(responseData);
                return;
            } else {
                responseData.code = 404;
                responseData.message = '不能提现';
                res.json(responseData);
                return;
            }
        })
    } else {
        responseData.code = 404;
        responseData.message = '信息有误';
        res.json(responseData);
        return;
    }

})

/**
 * 用户贷款查看
 */
router.post('/get/loanList', function(req, res, next) {
    var _id = req.body._userId || '233';
    var sum = 0;
    User.findOne({
        _id: _id
    }).then(function(userInfo) {
        if (userInfo) {
            Loan.find({
                _userId: _id
            }).then(function(loanListInfo) {
                if (loanListInfo) {
                    var loanList = loanListInfo;

                    responseData.message = '查询成功';
                    var loanList1 = {
                        loanList
                    }
                    Object.assign(responseData, loanList1);
                    return res.json(responseData);

                } else {
                    var loanList = [];
                    responseData.code = 404;
                    responseData.message = '数据库无此用户订单记录';
                    var loanList1 = {
                        loanList
                    }
                    Object.assign(responseData, loanList1);
                    return res.json(responseData);
                }
            })
        } else {
            responseData.code = 404;
            responseData.message = '数据库无此用户';
            return res.json(responseData)
        }
    })
})

/**
 * 用户提现查看
 */
router.post('/get/WithdrawalsList', function(req, res, next) {
    var _id = req.body._userId || '233';
    var sum = 0;
    User.findOne({
        _id: _id
    }).then(function(userInfo) {
        if (userInfo) {
            Withdrawals.find({
                _userId: _id
            }).then(function(WithdrawalsListInfo) {
                if (WithdrawalsListInfo) {
                    var WithdrawalsList = WithdrawalsListInfo;

                    responseData.message = '查询成功';
                    var WithdrawalsList1 = {
                        WithdrawalsList
                    }
                    Object.assign(responseData, WithdrawalsList1);
                    return res.json(responseData);

                } else {
                    var WithdrawalsList = [];
                    responseData.code = 404;
                    responseData.message = '数据库无此用户订单记录';
                    var WithdrawalsList1 = {
                        WithdrawalsList
                    }
                    Object.assign(responseData, WithdrawalsList1);
                    return res.json(responseData);
                }
            })
        } else {
            responseData.code = 404;
            responseData.message = '数据库无此用户';
            return res.json(responseData)
        }
    })
})
module.exports = router;