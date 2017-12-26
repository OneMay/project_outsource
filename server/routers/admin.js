var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var moment = require('moment');
var adminUser = require('../models/adminuser');
var Product = require('../models/product');
var User = require('../models/user');
var Number_people = require('../models/Number_people');
var Order = require('../models/order');
var MembersDemeanor = require('../models/Members_demeanor');
var Loan = require('../models/loan');
var Withdrawals = require('../models/withdrawals');
//统一返回格式
var responseData;
var num = 0;
router.use(function(req, res, next) {
        responseData = {
            code: 200,
            message: ''
        }
        next();
    })
    //推荐奖励人数：80
    /*var number_people = new Number_people({
        numberPeople: 80
    })
    number_people.save();*/
    //时间格式化
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
        var originalUrl = ['/user/login', '/user/logout']
        if (originalUrl.indexOf(req._parsedUrl.pathname) < 0) {
            if (req.session.adminuser_id) {
                adminUser.findOne({
                    _id: req.session.adminuser_id
                }).then(function(userInfo) {
                    if (userInfo) {
                        req.session._garbage = Date();
                        req.session.touch();
                        res.cookies.set('adminuserInfo', JSON.stringify({
                            _id: userInfo._id,
                            username: userInfo.username
                        }), {
                            'httpOnly': false,
                            'path': '/admin'
                        });
                        next()
                    }
                })
            } else {
                res.cookies.set('adminuserInfo', null, {
                    'httpOnly': false,
                    'path': '/admin'
                });
                res.redirect(301, '/admin/login.html');
                return;
            }
        } else {
            next();
        }
    })
    //后台登陆
router.post('/user/login', function(req, res, next) {
        var username = req.body.username;
        var password = req.body.password;
        //用户是否为空
        if (username == '' || password == '') {
            responseData.code = 1;
            responseData.message = '用户名和密码不能为空';
            res.json(responseData);
            return;
        }
        //比较用户名和密码
        adminUser.findOne({
            username: username,
            password: password
        }).then(function(userInfo) {
            if (!userInfo) {
                responseData.code = 404;
                responseData.message = '用户名或密码错误',
                    res.json(responseData);
                return;
            } else {
                req.session.adminuser_id = userInfo._id;
                responseData.code = 200;
                responseData.message = '登陆成功';
                responseData.redirectUrl = '/admin/index.html';
                var userInfoL = {
                    userInfo: {
                        _id: userInfo._id,
                        username: userInfo.username
                    }
                }
                Object.assign(responseData, userInfoL);
                res.cookies.set('adminuserInfo', JSON.stringify({
                    _id: userInfo._id,
                    username: userInfo.username
                }), {
                    'httpOnly': false,
                    'path': '/admin'
                });
                res.json(responseData);
                return;
            }
        })
    })
    //退出
router.get('/user/logout', function(req, res) {
        if (req.headers.cookie) {
            responseData.message = "退出成功！";
            responseData.redirectUrl = '/admin/login.html';
            res.cookies.set('adminuserInfo', null, {
                'httpOnly': false,
                'path': '/admin'
            });
            delete req.session.adminuser_id;
            res.json(responseData);
            return;
        } else {
            responseData.code = 500;
            responseData.message = "退出失败！";
            res.json(responseData);
            return;
        }

    })
    /**
     * 会员商城商品录入
     * 需要字段：
     * productName: String,
     * productDescription: String,
     * productImageUrl: String,
     * ProductIntegration:Number,
     * productInventory:Number 
     */
router.post('/add/productmall', multipartMiddleware, function(req, res, next) {
        var productmallPoster = req.files.productmallPoster;
        var productName = req.body.productName;
        var productDescription = req.body.productDescription;
        var ProductIntegration = req.body.ProductIntegration;
        var productInventory = req.body.inventory;
        var filePath = productmallPoster.path || '';
        var originalFilename = productmallPoster.originalFilename;

        if (originalFilename) {
            fs.readFile(filePath, function(err, data) {
                var timestamp = Date.now();
                //var type = posterData.type.split('/')[1];
                //var poster = timestamp + '.' + type;
                //var newPath = path.join(__dirname, '../../', 'static/upload/' + poster); //生成服务器的储存地址
                var newPath = path.join(__dirname, '../../', 'client/static/upload/images/' + originalFilename); //生成服务器的储存地址
                fs.writeFile(newPath, data, function(err) {
                    //req.poster = originalFilename;
                    if (err) {
                        responseData.code = 500;
                        responseData.message = '上传失败';
                        res.json(responseData);
                        return;
                    } else {
                        var productImageUrl = '/static/upload/images/' + originalFilename;
                        if (productName && productDescription && ProductIntegration && productInventory) {
                            var product = new Product({
                                productName: productName,
                                productDescription: productDescription,
                                productImageUrl: productImageUrl,
                                ProductIntegration: ProductIntegration,
                                productInventory: productInventory
                            })
                            product.save();
                            responseData.code = 200;
                            responseData.message = '成功';
                            res.json(responseData);
                            return;
                        } else {
                            responseData.code = 404;
                            responseData.message = '失败';
                            res.json(responseData);
                            return;
                        }
                    }
                    next();
                })
            })
        } else {
            responseData.code = 404;
            responseData.message = '上传失败，未选择文件';
            res.json(responseData);
            return;
        }
    })
    //产品列表
    /**
     * 通过limit(Number)限制每次取到的数据条数，
     * skip():忽略数据的条数
     * 每页显示2条
     * 1:1-2,skip:0->(当前页-1)*limit
     * 2:3-4,skip:2
     * 实现分页
     */
router.get('/get/mallpageList', function(req, res, next) {
    var currentPage = parseInt(req.query.currentPage) || 1;
    var limit = 6;
    var page = 0;
    var sum = 0;
    // var count = 6;
    // var index = page * count;
    Product.count().then(function(count) {
        if (count > 0) {
            //计算总页数
            page = Math.ceil(count / limit);
            //取值不能超过page
            currentPage = Math.min(currentPage, page)
                //取值不能小于1；
            currentPage = Math.max(currentPage, 1);
            var skip = (currentPage - 1) * limit;
            Product.find().sort({ '_id': -1 }).limit(limit).skip(skip).then(function(productListInfo) {
                //console.log(productList);
                //var results = productList.slice(index,index + count);
                var productList = [];
                productListInfo.forEach(function(value, index) {
                    productList.push({
                        _id: value._id,
                        ProductIntegration: value.ProductIntegration,
                        productDescription: value.productDescription,
                        productImageUrl: value.productImageUrl,
                        productInventory: value.productInventory,
                        productName: value.productName,
                        number: (currentPage - 1) * 6 + (index + 1)
                    })
                    sum = index;
                })

                responseData.message = '查询成功';
                responseData.code = '200';
                if (sum + 1 == productListInfo.length) {
                    var productList1 = {
                            productList,
                            currentPage: currentPage,
                            page: page,
                            count: count,
                            limit: limit
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
                    currentPage: 1,
                    page: page,
                    count: 0,
                    limit: limit
                }
                //responseData.productList = productList;
            Object.assign(responseData, productList1);
            return res.json(responseData);
        }
    })

})

//会员商城库存修改
router.post('/set/productInventory', function(req, res, next) {
        var productInventory = parseInt(req.body.productInventory);
        var _id = req.body._id;
        Product.findOne({
            _id: _id
        }).then(function(productInfo) {
            if (productInfo) {
                var id = productInfo._id;
                productInfo.productInventory = (parseInt(productInfo.productInventory) + parseInt(productInventory)) > 0 ? (parseInt(productInfo.productInventory) + parseInt(productInventory)) : 0;
                delete productInfo._id;
                Product.update({ _id: id }, productInfo, function(err) {});
                responseData.message = '修改积分成功';
                return res.json(responseData);
            } else {
                responseData.code = 404;
                responseData.message = '修改积分失败';
                return res.json(responseData);
            }
        })
    })
    //删除产品
router.post('/delete/productmall', function(req, res, next) {
        var _id = req.body._id;
        //console.log(name);
        Product.findOne({
            _id: _id
        }).then(function(product) {
            if (product) {
                responseData.message = '删除成功';
                Product.remove({ _id: _id }, function(err) {})
                res.json(responseData);
                return;
            } else {
                responseData.code = 404;
                responseData.message = '删除失败，为找到此产品！';
                res.json(responseData);
                return;
            }
        })
    })
    //index.html
router.get('/findall', function(req, res, next) {
        var shangping, dingdan, daikuan, huiyuan;
        User.find().count().then(function(count) {
            huiyuan = count;
            Product.find().count().then(function(count) {
                shangping = count;
                Order.find().count().then(function(count) {
                    dingdan = count;
                    Loan.find().count().then(function(count) {
                        daikuan = count;
                        var responseData = {};
                        responseData.code = 200;
                        responseData.huiyuan = huiyuan;
                        responseData.shangping = shangping;
                        responseData.dingdan = dingdan;
                        responseData.daikuan = daikuan;
                        responseData.message = '成功！';
                        res.json(responseData);
                        return;
                    })
                })
            })
        })
    })
    /**
     * 获取普通vip列表
     */

router.post('/get/userlist', function(req, res, next) {
        var currentPage = parseInt(req.body.currentPage) || 1;
        var phoneNumber = req.body.phoneNumber;
        var limit = 6;
        var page = 0;
        var sum = 0;
        var number_people = 0;
        Number_people.findOne().then(function(numberPeopleInfo) {
            if (numberPeopleInfo) {
                number_people = numberPeopleInfo.numberPeople;
            } else {
                number_people = 80;
            }
        })
        if (!phoneNumber) {
            User.find({ isVip: false }).count().then(function(count) {
                if (count > 0) {
                    //计算总页数
                    page = Math.ceil(count / limit);
                    //取值不能超过page
                    currentPage = Math.min(currentPage, page)
                        //取值不能小于1；
                    currentPage = Math.max(currentPage, 1);
                    var skip = (currentPage - 1) * limit;
                    User.find({ isVip: false }).limit(limit).skip(skip).then(function(userListInfo) {
                        //console.log(productList);
                        //var results = productList.slice(index,index + count);
                        var userList = [];
                        userListInfo.forEach(function(value, index) {
                            userList.push({
                                _id: value._id,
                                username: value.username,
                                phoneNumber: value.phoneNumber,
                                bankNumber: value.bankNumber,
                                isVip: value.isVip,
                                invitated_people: value.invitated_people,
                                straight: value.straight,
                                secondhand: value.secondhand,
                                member_mark: value.member_mark,
                                power: value.power,
                                previnvitated_people: value.previnvitated_people,
                                usedmoney: value.usedmoney,
                                number: (currentPage - 1) * 6 + (index + 1)
                            })
                            sum = index;
                        })
                        responseData.message = '查询成功';
                        if (sum + 1 == userListInfo.length) {
                            var userList1 = {
                                    userList,
                                    currentPage: currentPage,
                                    page: page,
                                    count: count,
                                    limit: limit,
                                    number_people: number_people
                                }
                                //responseData.productList = productList;
                            Object.assign(responseData, userList1);
                            return res.json(responseData);
                        }
                    })
                } else {
                    responseData.code = '404';
                    responseData.message = '数据库无记录';
                    var userList1 = {
                            userList: [],
                            currentPage: 1,
                            page: page,
                            count: 0,
                            limit: limit,
                            number_people: number_people
                        }
                        //responseData.productList = productList;
                    Object.assign(responseData, userList1);
                    return res.json(responseData);
                }
            })
        } else {
            User.find({ phoneNumber: phoneNumber, isVip: false }).count().then(function(count) {
                if (count > 0) {
                    //计算总页数
                    page = Math.ceil(count / limit);
                    //取值不能超过page
                    currentPage = Math.min(currentPage, page)
                        //取值不能小于1；
                    currentPage = Math.max(currentPage, 1);
                    var skip = (currentPage - 1) * limit;
                    User.find({ phoneNumber: phoneNumber, isVip: false }).limit(limit).skip(skip).then(function(userListInfo) {
                        var userList = [];
                        var value = userListInfo[0];
                        if (userListInfo[0].invitation_code_from_people != 'tuijianinvitation001') {
                            User.findOne({ invitation_code: userListInfo[0].invitation_code_from_people }).then(function(userInfo) {
                                if (userInfo.invitation_code_from_people != 'tuijianinvitation001') {
                                    User.findOne({ invitation_code: userInfo.invitation_code_from_people }).then(function(users) {
                                        userList.push({
                                            _id: value._id,
                                            username: value.username,
                                            phoneNumber: value.phoneNumber,
                                            bankNumber: value.bankNumber,
                                            isVip: value.isVip,
                                            invitated_people: value.invitated_people,
                                            straight: value.straight,
                                            secondhand: value.secondhand,
                                            member_mark: value.member_mark,
                                            power: value.power,
                                            previnvitated_people: value.previnvitated_people,
                                            number: (currentPage - 1) * 6 + (1),
                                            lastphoneNumber: userInfo.phoneNumber,
                                            lasterphoneNumber: users.phoneNumber
                                        })
                                        sum = 1
                                        responseData.message = '查询成功';
                                        if (sum == userListInfo.length) {
                                            var userList1 = {
                                                    userList,
                                                    currentPage: currentPage,
                                                    page: page,
                                                    count: count,
                                                    limit: limit,
                                                    number_people: number_people
                                                }
                                                //responseData.productList = productList;
                                            Object.assign(responseData, userList1);
                                            return res.json(responseData);
                                        }
                                    })
                                } else {
                                    userList.push({
                                        _id: value._id,
                                        username: value.username,
                                        phoneNumber: value.phoneNumber,
                                        bankNumber: value.bankNumber,
                                        isVip: value.isVip,
                                        invitated_people: value.invitated_people,
                                        straight: value.straight,
                                        secondhand: value.secondhand,
                                        member_mark: value.member_mark,
                                        power: value.power,
                                        previnvitated_people: value.previnvitated_people,
                                        number: (currentPage - 1) * 6 + (1),
                                        lastphoneNumber: userInfo.phoneNumber,
                                        lasterphoneNumber: ''
                                    })
                                    sum = 1
                                    responseData.message = '查询成功';
                                    if (sum == userListInfo.length) {
                                        var userList1 = {
                                                userList,
                                                currentPage: currentPage,
                                                page: page,
                                                count: count,
                                                limit: limit,
                                                number_people: number_people
                                            }
                                            //responseData.productList = productList;
                                        Object.assign(responseData, userList1);
                                        return res.json(responseData);
                                    }
                                }
                            })
                        } else {
                            userList.push({
                                _id: value._id,
                                username: value.username,
                                phoneNumber: value.phoneNumber,
                                bankNumber: value.bankNumber,
                                isVip: value.isVip,
                                invitated_people: value.invitated_people,
                                straight: value.straight,
                                secondhand: value.secondhand,
                                member_mark: value.member_mark,
                                power: value.power,
                                previnvitated_people: value.previnvitated_people,
                                number: (currentPage - 1) * 6 + (1),
                                lastphoneNumber: '',
                                lasterphoneNumber: ''
                            })
                            sum = 1
                            responseData.message = '查询成功';
                            if (sum == userListInfo.length) {
                                var userList1 = {
                                        userList,
                                        currentPage: currentPage,
                                        page: page,
                                        count: count,
                                        limit: limit,
                                        number_people: number_people
                                    }
                                    //responseData.productList = productList;
                                Object.assign(responseData, userList1);
                                return res.json(responseData);
                            }
                        }
                        //console.log(productList);
                        //var results = productList.slice(index,index + count);
                    })
                } else {
                    responseData.code = '404';
                    responseData.message = '数据库无记录';
                    var userList1 = {
                            userList: [],
                            currentPage: 1,
                            page: page,
                            count: 0,
                            limit: limit,
                            number_people: number_people
                        }
                        //responseData.productList = productList;
                    Object.assign(responseData, userList1);
                    return res.json(responseData);
                }
            })
        }
    })
    /**
     * 获取高级vip列表
     */

router.post('/get/userViplist', function(req, res, next) {
    var currentPage = parseInt(req.body.currentPage) || 1;
    var phoneNumber = req.body.phoneNumber;
    var limit = 6;
    var page = 0;
    var sum = 0;
    var number_people = 0;
    Number_people.findOne().then(function(numberPeopleInfo) {
        if (numberPeopleInfo) {
            number_people = numberPeopleInfo.numberPeople;
        } else {
            number_people = 80;
        }
    })
    if (!phoneNumber) {
        User.find({ isVip: true }).count().then(function(count) {
            if (count > 0) {
                //计算总页数
                page = Math.ceil(count / limit);
                //取值不能超过page
                currentPage = Math.min(currentPage, page)
                    //取值不能小于1；
                currentPage = Math.max(currentPage, 1);
                var skip = (currentPage - 1) * limit;
                User.find({ isVip: true }).limit(limit).skip(skip).then(function(userListInfo) {
                    //console.log(productList);
                    //var results = productList.slice(index,index + count);
                    var userList = [];
                    userListInfo.forEach(function(value, index) {
                        userList.push({
                            _id: value._id,
                            username: value.username,
                            phoneNumber: value.phoneNumber,
                            bankNumber: value.bankNumber,
                            isVip: value.isVip,
                            invitated_people: value.invitated_people,
                            straight: value.straight,
                            secondhand: value.secondhand,
                            member_mark: value.member_mark,
                            power: value.power,
                            previnvitated_people: value.previnvitated_people,
                            number: (currentPage - 1) * 6 + (index + 1)
                        })
                        sum = index;
                    })
                    responseData.message = '查询成功';
                    if (sum + 1 == userListInfo.length) {
                        var userList1 = {
                                userList,
                                currentPage: currentPage,
                                page: page,
                                count: count,
                                limit: limit,
                                number_people: number_people
                            }
                            //responseData.productList = productList;
                        Object.assign(responseData, userList1);
                        return res.json(responseData);
                    }
                })
            } else {
                responseData.code = '404';
                responseData.message = '数据库无记录';
                var userList1 = {
                        userList: [],
                        currentPage: 1,
                        page: page,
                        count: 0,
                        limit: limit,
                        number_people: number_people
                    }
                    //responseData.productList = productList;
                Object.assign(responseData, userList1);
                return res.json(responseData);
            }
        })
    } else {
        User.find({ phoneNumber: phoneNumber, isVip: true }).count().then(function(count) {
            if (count > 0) {
                //计算总页数
                page = Math.ceil(count / limit);
                //取值不能超过page
                currentPage = Math.min(currentPage, page)
                    //取值不能小于1；
                currentPage = Math.max(currentPage, 1);
                var skip = (currentPage - 1) * limit;
                User.find({ phoneNumber: phoneNumber, isVip: true }).limit(limit).skip(skip).then(function(userListInfo) {
                    var userList = [];
                    var value = userListInfo[0];
                    if (userListInfo[0].invitation_code_from_people != 'tuijianinvitation001') {
                        User.findOne({ invitation_code: userListInfo[0].invitation_code_from_people }).then(function(userInfo) {
                            if (userInfo.invitation_code_from_people != 'tuijianinvitation001') {
                                User.findOne({ invitation_code: userInfo.invitation_code_from_people }).then(function(users) {
                                    userList.push({
                                        _id: value._id,
                                        username: value.username,
                                        phoneNumber: value.phoneNumber,
                                        bankNumber: value.bankNumber,
                                        isVip: value.isVip,
                                        invitated_people: value.invitated_people,
                                        straight: value.straight,
                                        secondhand: value.secondhand,
                                        member_mark: value.member_mark,
                                        power: value.power,
                                        previnvitated_people: value.previnvitated_people,
                                        number: (currentPage - 1) * 6 + (1),
                                        lastphoneNumber: userInfo.phoneNumber,
                                        lasterphoneNumber: users.phoneNumber
                                    })
                                    sum = 1
                                    responseData.message = '查询成功';
                                    if (sum == userListInfo.length) {
                                        var userList1 = {
                                                userList,
                                                currentPage: currentPage,
                                                page: page,
                                                count: count,
                                                limit: limit,
                                                number_people: number_people
                                            }
                                            //responseData.productList = productList;
                                        Object.assign(responseData, userList1);
                                        return res.json(responseData);
                                    }
                                })
                            } else {
                                userList.push({
                                    _id: value._id,
                                    username: value.username,
                                    phoneNumber: value.phoneNumber,
                                    bankNumber: value.bankNumber,
                                    isVip: value.isVip,
                                    invitated_people: value.invitated_people,
                                    straight: value.straight,
                                    secondhand: value.secondhand,
                                    member_mark: value.member_mark,
                                    power: value.power,
                                    previnvitated_people: value.previnvitated_people,
                                    number: (currentPage - 1) * 6 + (1),
                                    lastphoneNumber: userInfo.phoneNumber,
                                    lasterphoneNumber: ''
                                })
                                sum = 1
                                responseData.message = '查询成功';
                                if (sum == userListInfo.length) {
                                    var userList1 = {
                                            userList,
                                            currentPage: currentPage,
                                            page: page,
                                            count: count,
                                            limit: limit,
                                            number_people: number_people
                                        }
                                        //responseData.productList = productList;
                                    Object.assign(responseData, userList1);
                                    return res.json(responseData);
                                }
                            }
                        })
                    } else {
                        userList.push({
                            _id: value._id,
                            username: value.username,
                            phoneNumber: value.phoneNumber,
                            bankNumber: value.bankNumber,
                            isVip: value.isVip,
                            invitated_people: value.invitated_people,
                            straight: value.straight,
                            secondhand: value.secondhand,
                            member_mark: value.member_mark,
                            power: value.power,
                            previnvitated_people: value.previnvitated_people,
                            number: (currentPage - 1) * 6 + (1),
                            lastphoneNumber: '',
                            lasterphoneNumber: ''
                        })
                        sum = 1
                        responseData.message = '查询成功';
                        if (sum == userListInfo.length) {
                            var userList1 = {
                                    userList,
                                    currentPage: currentPage,
                                    page: page,
                                    count: count,
                                    limit: limit,
                                    number_people: number_people
                                }
                                //responseData.productList = productList;
                            Object.assign(responseData, userList1);
                            return res.json(responseData);
                        }
                    }
                    //console.log(productList);
                    //var results = productList.slice(index,index + count);
                })
            } else {
                responseData.code = '404';
                responseData.message = '数据库无记录';
                var userList1 = {
                        userList: [],
                        currentPage: 1,
                        page: page,
                        count: 0,
                        limit: limit,
                        number_people: number_people
                    }
                    //responseData.productList = productList;
                Object.assign(responseData, userList1);
                return res.json(responseData);
            }
        })
    }
})

/**
 * 获取单个会员列表
 */
router.post('/get/alluserlist', function(req, res, next) {
        var phoneNumber = req.body.phoneNumber;

        User.find({ phoneNumber: phoneNumber }).count().then(function(count) {
            if (count > 0) {
                User.find({ phoneNumber: phoneNumber }).then(function(userListInfo) {
                    var userList = userListInfo;
                    responseData.message = '查询成功';
                    var userList1 = {
                        userList
                    }
                    Object.assign(responseData, userList1);
                    return res.json(responseData);

                })
            } else {
                responseData.code = '404';
                responseData.message = '数据库无记录';
                var userList1 = {
                    userList: []
                }
                Object.assign(responseData, userList1);
                return res.json(responseData);
            }
        })

    })
    /**
     * 普通vip积分修改
     */
router.post('/set/vipmember_mark', function(req, res, next) {
    var member_mark = parseInt(req.body.member_mark);
    var _id = req.body._id;
    var isstraight = req.body.isstraight;
    User.findOne({
        _id: _id
    }).then(function(userInfo) {
        if (userInfo) {
            var _id = userInfo._id;
            userInfo.member_mark = (parseInt(userInfo.member_mark) + member_mark) > 0 ? (parseInt(userInfo.member_mark) + member_mark) : 0;
            if (isstraight == 'straight') {
                userInfo.straight = 0;
                delete userInfo._id;
                User.update({ _id: _id }, userInfo, function(err) {});
                responseData.message = '修改积分成功';
                return res.json(responseData);
            } else if (isstraight == 'secondhand') {
                userInfo.secondhand = 0;
                delete userInfo._id;
                User.update({ _id: _id }, userInfo, function(err) {});
                responseData.message = '修改积分成功';
                return res.json(responseData);
            } else if (isstraight == 'invitated') {
                Number_people.findOne().then(function(numberPeopleInfo) {
                    if (numberPeopleInfo && (parseInt(userInfo.invitated_people) - parseInt(userInfo.previnvitated_people) > numberPeopleInfo.numberPeople)) {
                        userInfo.previnvitated_people = userInfo.invitated_people;
                        userInfo.power = userInfo.power + 1;
                        delete userInfo._id;
                        User.update({ _id: _id }, userInfo, function(err) {});
                        responseData.message = '修改积分成功';
                        return res.json(responseData);
                    } else {
                        responseData.code = 404;
                        responseData.message = '修改积分失败';
                        return res.json(responseData);
                    }
                })
            } else if (isstraight == 'all') {
                delete userInfo._id;
                User.update({ _id: _id }, userInfo, function(err) {});
                responseData.message = '修改积分成功';
                return res.json(responseData);
            } else {
                responseData.code = 404;
                responseData.message = '修改积分失败';
                return res.json(responseData);
            }
        } else {
            responseData.code = 404;
            responseData.message = '修改积分失败';
            return res.json(responseData);
        }
    })
})

/**
 * vip删除
 */
router.post('/delete/vip', function(req, res, next) {
    var _id = req.body._id;
    User.findOne({
        _id: _id
    }).then(function(userInfo) {
        if (userInfo) {
            responseData.message = '删除成功';
            User.remove({ _id: _id }, function(err) {})
            res.json(responseData);
            return;
        } else {
            responseData.code = 404;
            responseData.message = '删除失败，没有此会员信息！';
            res.json(responseData);
            return;
        }
    })
})

/**
 *设置为高级会员
 */
router.post('/set/viper', function(req, res, next) {
        var _id = req.body._id;
        var userGlobal;
        var finish = false;
        User.findOne({
            _id: _id,
            isVip: false
        }).then(function(userInfo) {
            if (userInfo) {
                userGlobal = userInfo;
                var _id = userInfo._id;
                userInfo.isVip = true;
                delete userInfo._id;
                User.update({ _id: _id }, userInfo, function(err) {});
                if (userInfo.invitation_code_from_people != 'tuijianinvitation001') {
                    User.findOne({
                        invitation_code: userInfo.invitation_code_from_people
                    }).then(function(userInfo) {
                        if (userInfo) {
                            var _id = userInfo._id;
                            userInfo.straight = userInfo.straight + 1;
                            delete userInfo._id;
                            User.update({ _id: _id }, userInfo, function(err) {});
                            if (userInfo.invitation_code_from_people != 'tuijianinvitation001') {
                                User.findOne({
                                    invitation_code: userInfo.invitation_code_from_people
                                }).then(function(userInfo) {
                                    if (userInfo) {
                                        var _id = userInfo._id;
                                        userInfo.secondhand = userInfo.secondhand + 1;
                                        delete userInfo._id;
                                        User.update({ _id: _id }, userInfo, function(err) {});
                                    }
                                })
                            }
                        }
                    }).then(function(userListInfo) {
                        if (userGlobal) {
                            var user = userGlobal;

                            function callback(user) {
                                if (user.invitation_code_from_people != 'tuijianinvitation001') {
                                    User.findOne({
                                        invitation_code: user.invitation_code_from_people
                                    }).then(function(userListInfo) {
                                        if (userListInfo) {
                                            var _id = userListInfo._id;
                                            userListInfo.invitated_people = userListInfo.invitated_people + 1;
                                            delete userListInfo._id;
                                            User.update({ _id: _id }, userListInfo, function(err) {});
                                            if (userListInfo.invitation_code_from_people != 'tuijianinvitation001') {
                                                callback(userListInfo);
                                            }
                                        }
                                    })
                                }
                            }
                            callback(user)
                        }
                    }).then(function(userInfo) {
                        setTimeout(function() {
                            responseData.code = 200;
                            responseData.message = '设置高级会员成功2';
                            return res.json(responseData);

                        }, 1000);
                    })
                } else {
                    responseData.code = 200;
                    responseData.message = '设置高级会员成功';
                    return res.json(responseData);
                }
            } else {
                responseData.code = 404;
                responseData.message = '设置高级会员失败';
                return res.json(responseData);
            }
        })
    })
    /**
     *设置为普通会员
     */
router.post('/set/tovip', function(req, res, next) {
    var _id = req.body._id;
    var userGlobal;
    var finish = false;
    User.findOne({
        _id: _id,
        isVip: true
    }).then(function(userInfo) {
        if (userInfo) {
            userGlobal = userInfo;
            var _id = userInfo._id;
            userInfo.isVip = false;
            delete userInfo._id;
            User.update({ _id: _id }, userInfo, function(err) {});
            if (userInfo.invitation_code_from_people != 'tuijianinvitation001') {
                User.findOne({
                    invitation_code: userInfo.invitation_code_from_people
                }).then(function(userInfo) {
                    if (userInfo) {
                        var _id = userInfo._id;
                        userInfo.straight = userInfo.straight - 1;
                        delete userInfo._id;
                        User.update({ _id: _id }, userInfo, function(err) {});
                        if (userInfo.invitation_code_from_people != 'tuijianinvitation001') {
                            User.findOne({
                                invitation_code: userInfo.invitation_code_from_people
                            }).then(function(userInfo) {
                                if (userInfo) {
                                    var _id = userInfo._id;
                                    userInfo.secondhand = userInfo.secondhand - 1;
                                    delete userInfo._id;
                                    User.update({ _id: _id }, userInfo, function(err) {});
                                }
                            })
                        }
                    }
                }).then(function(userListInfo) {
                    if (userGlobal) {
                        var user = userGlobal;

                        function callback(user) {
                            if (user.invitation_code_from_people != 'tuijianinvitation001') {
                                User.findOne({
                                    invitation_code: user.invitation_code_from_people
                                }).then(function(userListInfo) {
                                    if (userListInfo) {
                                        var _id = userListInfo._id;
                                        userListInfo.invitated_people = userListInfo.invitated_people - 1;
                                        delete userListInfo._id;
                                        User.update({ _id: _id }, userListInfo, function(err) {});
                                        if (userListInfo.invitation_code_from_people != 'tuijianinvitation001') {
                                            callback(userListInfo);
                                        }
                                    }
                                })
                            }
                        }
                        callback(user)
                    }
                }).then(function(userInfo) {
                    setTimeout(function() {
                        responseData.code = 200;
                        responseData.message = '设置普通会员成功2';
                        return res.json(responseData);

                    }, 1000);
                })
            } else {
                responseData.code = 200;
                responseData.message = '设置普通会员成功';
                return res.json(responseData);
            }
        } else {
            responseData.code = 404;
            responseData.message = '设置普通会员失败';
            return res.json(responseData);
        }
    })
})

//推荐奖人数设置
router.post('/set/number_people', function(req, res, next) {
    var number_people = req.body.number_people;
    Number_people.findOne().then(function(numberPeopleInfo) {
        if (numberPeopleInfo) {
            var _id = numberPeopleInfo._id;
            numberPeopleInfo.numberPeople = number_people;
            delete numberPeopleInfo._id;
            Number_people.update({ _id: _id }, numberPeopleInfo, function(err) {});
            responseData.code = 200;
            responseData.message = '修改成功';
            return res.json(responseData);
        } else {
            responseData.code = 404;
            responseData.message = '修改失败';
            return res.json(responseData);
        }
    })
})

/**
 * 会员商城未审核订单
 */
router.get('/get/examineList', function(req, res, next) {
    var currentPage = parseInt(req.query.currentPage) || 1;
    var limit = 6;
    var page = 0;
    var sum = 0;
    Order.find({ isExamine: false, fail: false }).count().then(function(count) {
        if (count > 0) {
            //计算总页数
            page = Math.ceil(count / limit);
            //取值不能超过page
            currentPage = Math.min(currentPage, page)
                //取值不能小于1；
            currentPage = Math.max(currentPage, 1);
            var skip = (currentPage - 1) * limit;
            Order.find({ isExamine: false, fail: false }).limit(limit).skip(skip).then(function(orderListInfo) {
                //console.log(productList);
                //var results = productList.slice(index,index + count);
                var orderList = [];
                orderListInfo.forEach(function(value, index) {
                    var ind = index;
                    User.findOne({
                        _id: value._userId
                    }).then(function(userInfo) {
                        orderList.push({
                            _id: value._id,
                            username: userInfo.username,
                            phoneNumber: userInfo.phoneNumber,
                            isVip: userInfo.isVip ? '高级会员' : '普通会员',
                            mallName: value.mallName,
                            money: value.money,
                            inventory: value.inventory,
                            time: new Date(value.time).Format("yyyy-MM-dd HH:mm:ss"),
                            number: (currentPage - 1) * 6 + (ind + 1)
                        })
                        sum = index;
                        responseData.message = '查询成功';
                        if (orderListInfo.length == orderList.length) {
                            var orderList1 = {
                                    orderList,
                                    currentPage: currentPage,
                                    page: page,
                                    count: count,
                                    limit: limit
                                }
                                //responseData.productList = productList;
                            Object.assign(responseData, orderList1);
                            return res.json(responseData);
                        }
                    })
                })
            })
        } else {
            responseData.code = '404';
            responseData.message = '数据库无记录';
            var orderList1 = {
                    orderList: [],
                    currentPage: 1,
                    page: page,
                    count: 0,
                    limit: limit
                }
                //responseData.productList = productList;
            Object.assign(responseData, orderList1);
            return res.json(responseData);
        }
    })
})

/**
 * 订单删除
 */
router.post('/delete/order', function(req, res, next) {
        var _id = req.body._id;
        Order.findOne({
            _id: _id
        }).then(function(orderInfo) {
            if (orderInfo) {
                responseData.message = '删除成功';
                Order.remove({ _id: _id }, function(err) {})
                res.json(responseData);
                return;
            } else {
                responseData.code = 404;
                responseData.message = '删除失败，没有此订单信息！';
                res.json(responseData);
                return;
            }
        })
    })
    //会员商城审核通过
router.post('/set/setToDeliver', function(req, res, next) {
        var _id = req.body._id;
        if (_id) {
            Order.findOne({
                _id: _id
            }).then(function(orderInfo) {
                if (orderInfo) {
                    var _id = orderInfo._id;
                    orderInfo.isExamine = true;
                    delete orderInfo._id;
                    Order.update({ _id: _id }, orderInfo, function(err) {});
                    User.findOne({_id:orderInfo._userId}).then(function(userInfo){
                        var _id = userInfo._id;
                        userInfo.usedmoney=parseFloat(userInfo.usedmoney)+parseFloat(orderInfo.money)
                        delete userInfo._id;
                        User.update({ _id: _id }, userInfo, function(err) {});
                    })
                    responseData.code = 200;
                    responseData.message = '修改成功';
                    return res.json(responseData);
                } else {
                    responseData.code = 404;
                    responseData.message = '修改失败';
                    return res.json(responseData);
                }
            })
        } else {
            responseData.code = 404;
            responseData.message = '修改失败';
            return res.json(responseData);
        }
    })
    //会员商城审核不通过
router.post('/set/setToFail', function(req, res, next) {
        var _id = req.body._id;
        if (_id) {
            Order.findOne({
                _id: _id
            }).then(function(orderInfo) {
                if (orderInfo) {
                    var _id = orderInfo._id;
                    orderInfo.fail = true;
                    delete orderInfo._id;
                    Order.update({ _id: _id }, orderInfo, function(err) {});
                    responseData.code = 200;
                    responseData.message = '修改成功';
                    return res.json(responseData);
                } else {
                    responseData.code = 404;
                    responseData.message = '修改失败';
                    return res.json(responseData);
                }
            })
        } else {
            responseData.code = 404;
            responseData.message = '修改失败';
            return res.json(responseData);
        }
    })
    /**
     * 会员商城未发货订单
     */
router.get('/get/deliverList', function(req, res, next) {
        var currentPage = parseInt(req.query.currentPage) || 1;
        var limit = 6;
        var page = 0;
        var sum = 0;
        Order.find({ isExamine: true, Deliver_goods: false }).count().then(function(count) {
            if (count > 0) {
                //计算总页数
                page = Math.ceil(count / limit);
                //取值不能超过page
                currentPage = Math.min(currentPage, page)
                    //取值不能小于1；
                currentPage = Math.max(currentPage, 1);
                var skip = (currentPage - 1) * limit;
                Order.find({ isExamine: true, Deliver_goods: false }).limit(limit).skip(skip).then(function(orderListInfo) {
                    //console.log(productList);
                    //var results = productList.slice(index,index + count);
                    var orderList = [];
                    orderListInfo.forEach(function(value, index) {
                        var ind = index;
                        User.findOne({
                            _id: value._userId
                        }).then(function(userInfo) {
                            orderList.push({
                                _id: value._id,
                                username: userInfo.username,
                                phoneNumber: userInfo.phoneNumber,
                                isVip: userInfo.isVip ? '高级会员' : '普通会员',
                                mallName: value.mallName,
                                money: value.money,
                                inventory: value.inventory,
                                consignee: value.consignee,
                                consigneePhone: value.consigneePhone,
                                consigneeAddress: value.consigneeAddress,
                                time: new Date(value.time).Format("yyyy-MM-dd HH:mm:ss"),
                                number: (currentPage - 1) * 6 + (ind + 1)
                            })
                            sum = index;
                            responseData.message = '查询成功';
                            if (orderListInfo.length == orderList.length) {
                                var orderList1 = {
                                        orderList,
                                        currentPage: currentPage,
                                        page: page,
                                        count: count,
                                        limit: limit
                                    }
                                    //responseData.productList = productList;
                                Object.assign(responseData, orderList1);
                                return res.json(responseData);
                            }
                        })
                    })
                })
            } else {
                responseData.code = '404';
                responseData.message = '数据库无记录';
                var orderList1 = {
                        orderList: [],
                        currentPage: 1,
                        page: page,
                        count: 0,
                        limit: limit
                    }
                    //responseData.productList = productList;
                Object.assign(responseData, orderList1);
                return res.json(responseData);
            }
        })
    })
    //会员商城发货
router.post('/set/delivergoods', function(req, res, next) {
        var _id = req.body._id;
        if (_id) {
            Order.findOne({
                _id: _id
            }).then(function(orderInfo) {
                if (orderInfo) {
                    var _id = orderInfo._id;
                    orderInfo.Deliver_goods = true;
                    delete orderInfo._id;
                    Order.update({ _id: _id }, orderInfo, function(err) {});
                    responseData.code = 200;
                    responseData.message = '修改成功';
                    return res.json(responseData);
                } else {
                    responseData.code = 404;
                    responseData.message = '修改失败';
                    return res.json(responseData);
                }
            })
        } else {
            responseData.code = 404;
            responseData.message = '修改失败';
            return res.json(responseData);
        }
    })
    //商城未通过列表
router.get('/get/orderErrorList', function(req, res, next) {
        var currentPage = parseInt(req.query.currentPage) || 1;
        var limit = 6;
        var page = 0;
        var sum = 0;
        Order.find({ isExamine: false, fail: true }).count().then(function(count) {
            if (count > 0) {
                //计算总页数
                page = Math.ceil(count / limit);
                //取值不能超过page
                currentPage = Math.min(currentPage, page)
                    //取值不能小于1；
                currentPage = Math.max(currentPage, 1);
                var skip = (currentPage - 1) * limit;
                Order.find({ isExamine: false, fail: true }).limit(limit).skip(skip).then(function(orderListInfo) {
                    //console.log(productList);
                    //var results = productList.slice(index,index + count);
                    var orderList = [];
                    orderListInfo.forEach(function(value, index) {
                        var ind = index;
                        User.findOne({
                            _id: value._userId
                        }).then(function(userInfo) {
                            orderList.push({
                                _id: value._id,
                                username: userInfo.username,
                                phoneNumber: userInfo.phoneNumber,
                                isVip: userInfo.isVip ? '高级会员' : '普通会员',
                                mallName: value.mallName,
                                money: value.money,
                                inventory: value.inventory,
                                consignee: value.consignee,
                                consigneePhone: value.consigneePhone,
                                consigneeAddress: value.consigneeAddress,
                                time: new Date(value.time).Format("yyyy-MM-dd HH:mm:ss"),
                                number: (currentPage - 1) * 6 + (ind + 1)
                            })
                            sum = index;
                            responseData.message = '查询成功';
                            if (orderListInfo.length == orderList.length) {
                                var orderList1 = {
                                        orderList,
                                        currentPage: currentPage,
                                        page: page,
                                        count: count,
                                        limit: limit
                                    }
                                    //responseData.productList = productList;
                                Object.assign(responseData, orderList1);
                                return res.json(responseData);
                            }
                        })
                    })
                })
            } else {
                responseData.code = '404';
                responseData.message = '数据库无记录';
                var orderList1 = {
                        orderList: [],
                        currentPage: 1,
                        page: page,
                        count: 0,
                        limit: limit
                    }
                    //responseData.productList = productList;
                Object.assign(responseData, orderList1);
                return res.json(responseData);
            }
        })
    })
    //商城成功列表
router.get('/get/orderSuccessList', function(req, res, next) {
        var currentPage = parseInt(req.query.currentPage) || 1;
        var limit = 6;
        var page = 0;
        var sum = 0;
        Order.find({ isExamine: true, fail: false, Deliver_goods: true }).count().then(function(count) {
            if (count > 0) {
                //计算总页数
                page = Math.ceil(count / limit);
                //取值不能超过page
                currentPage = Math.min(currentPage, page)
                    //取值不能小于1；
                currentPage = Math.max(currentPage, 1);
                var skip = (currentPage - 1) * limit;
                Order.find({ isExamine: true, fail: false, Deliver_goods: true }).limit(limit).skip(skip).then(function(orderListInfo) {
                    //console.log(productList);
                    //var results = productList.slice(index,index + count);
                    var orderList = [];
                    orderListInfo.forEach(function(value, index) {
                        var ind = index;
                        User.findOne({
                            _id: value._userId
                        }).then(function(userInfo) {
                            orderList.push({
                                _id: value._id,
                                username: userInfo.username,
                                phoneNumber: userInfo.phoneNumber,
                                isVip: userInfo.isVip ? '高级会员' : '普通会员',
                                mallName: value.mallName,
                                money: value.money,
                                inventory: value.inventory,
                                consignee: value.consignee,
                                consigneePhone: value.consigneePhone,
                                consigneeAddress: value.consigneeAddress,
                                time: new Date(value.time).Format("yyyy-MM-dd HH:mm:ss"),
                                number: (currentPage - 1) * 6 + (ind + 1)
                            })
                            sum = ind;
                            responseData.message = '查询成功';
                            if (orderListInfo.length == orderList.length) {
                                var orderList1 = {
                                        orderList,
                                        currentPage: currentPage,
                                        page: page,
                                        count: count,
                                        limit: limit
                                    }
                                    //responseData.productList = productList;
                                Object.assign(responseData, orderList1);
                                return res.json(responseData);
                            }
                        })
                    })
                })
            } else {
                responseData.code = '404';
                responseData.message = '数据库无记录';
                var orderList1 = {
                        orderList: [],
                        currentPage: 1,
                        page: page,
                        count: 0,
                        limit: limit
                    }
                    //responseData.productList = productList;
                Object.assign(responseData, orderList1);
                return res.json(responseData);
            }
        })
    })
    /**
     * 会员风采文章添加
     */
router.post('/add/MembersDemeanor', multipartMiddleware, function(req, res, next) {
    var MembersDemeanorFile = req.files.MembersDemeanorFile;
    var MembersDemeanorTitle = req.body.MembersDemeanorTitle;
    var MembersDemeanorContent = req.body.MembersDemeanorContent;
    var filePath = MembersDemeanorFile.path || '';
    var originalFilename = MembersDemeanorFile.originalFilename;

    if (originalFilename) {
        fs.readFile(filePath, function(err, data) {
            var timestamp = Date.now();
            //var type = posterData.type.split('/')[1];
            //var poster = timestamp + '.' + type;
            //var newPath = path.join(__dirname, '../../', 'static/upload/' + poster); //生成服务器的储存地址
            var newPath = path.join(__dirname, '../../', 'client/static/upload/images/' + originalFilename); //生成服务器的储存地址
            fs.writeFile(newPath, data, function(err) {
                //req.poster = originalFilename;
                if (err) {
                    responseData.code = 500;
                    responseData.message = '上传失败';
                    res.json(responseData);
                    return;
                } else {
                    var membersDemeanoPhoto = '/static/upload/images/' + originalFilename;
                    if (MembersDemeanorTitle && MembersDemeanorContent) {
                        var membersDemeanor = new MembersDemeanor({
                            title: MembersDemeanorTitle,
                            content: MembersDemeanorContent,
                            membersDemeanoPhoto: [membersDemeanoPhoto],
                            time: moment().format('YYYY-MM-DD HH:mm:ss')
                        })
                        membersDemeanor.save();
                        responseData.code = 200;
                        responseData.message = '成功';
                        res.json(responseData);
                        return;
                    } else {
                        responseData.code = 404;
                        responseData.message = '失败';
                        res.json(responseData);
                        return;
                    }
                }
                next();
            })
        })
    } else {
        responseData.code = 404;
        responseData.message = '上传失败，未选择文件';
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

//删除文章
router.post('/delete/membersDemeanoritem', function(req, res, next) {
    var _id = req.body._id;
    //console.log(name);
    MembersDemeanor.findOne({
        _id: _id
    }).then(function(membersDemeanorInfo) {
        if (membersDemeanorInfo) {
            responseData.message = '删除成功';
            MembersDemeanor.remove({ _id: _id }, function(err) {})
            res.json(responseData);
            return;
        } else {
            responseData.code = 404;
            responseData.message = '删除失败，为找到此产品！';
            res.json(responseData);
            return;
        }
    })
})

//贷款未处理订单
router.get('/get/loanNocList', function(req, res, next) {
        var currentPage = parseInt(req.query.currentPage) || 1;
        var limit = 6;
        var page = 0;
        var sum = 0;
        Loan.find({ success: false, fail: false }).count().then(function(count) {
            if (count > 0) {
                //计算总页数
                page = Math.ceil(count / limit);
                //取值不能超过page
                currentPage = Math.min(currentPage, page)
                    //取值不能小于1；
                currentPage = Math.max(currentPage, 1);
                var skip = (currentPage - 1) * limit;
                Loan.find({ success: false, fail: false }).limit(limit).skip(skip).then(function(loanListInfo) {
                    var loanList = [];
                    loanListInfo.forEach(function(value, index) {
                        var ind = index;
                        User.findOne({
                            _id: value._userId
                        }).then(function(userInfo) {
                            loanList.push({
                                _id: value._id,
                                _userId: value._userId,
                                username: userInfo.username,
                                phoneNumber: userInfo.phoneNumber,
                                isVip: userInfo.isVip ? '高级会员' : '普通会员',
                                name: value.name,
                                money: value.money,
                                time: new Date(value.time).Format("yyyy-MM-dd HH:mm:ss"),
                                number: (currentPage - 1) * 6 + (ind + 1)
                            })
                            responseData.message = '查询成功';
                            if (loanListInfo.length == loanList.length) {
                                var loanList1 = {
                                        loanList,
                                        currentPage: currentPage,
                                        page: page,
                                        count: count,
                                        limit: limit
                                    }
                                    //responseData.productList = productList;
                                Object.assign(responseData, loanList1);
                                return res.json(responseData);
                            }
                        })
                    })
                })
            } else {
                responseData.code = '404';
                responseData.message = '数据库无记录';
                var loanList1 = {
                        loanList: [],
                        currentPage: 1,
                        page: page,
                        count: 0,
                        limit: limit
                    }
                    //responseData.productList = productList;
                Object.assign(responseData, loanList1);
                return res.json(responseData);
            }
        })
    })
    //贷款失败订单
router.get('/get/loanFailList', function(req, res, next) {
        var currentPage = parseInt(req.query.currentPage) || 1;
        var limit = 6;
        var page = 0;
        var sum = 0;
        Loan.find({ success: false, fail: true }).count().then(function(count) {
            if (count > 0) {
                //计算总页数
                page = Math.ceil(count / limit);
                //取值不能超过page
                currentPage = Math.min(currentPage, page)
                    //取值不能小于1；
                currentPage = Math.max(currentPage, 1);
                var skip = (currentPage - 1) * limit;
                Loan.find({ success: false, fail: true }).limit(limit).skip(skip).then(function(loanListInfo) {
                    var loanList = [];
                    loanListInfo.forEach(function(value, index) {
                        var ind = index;
                        User.findOne({
                            _id: value._userId
                        }).then(function(userInfo) {
                            loanList.push({
                                _id: value._id,
                                username: userInfo.username,
                                phoneNumber: userInfo.phoneNumber,
                                isVip: userInfo.isVip ? '高级会员' : '普通会员',
                                name: value.name,
                                money: value.money,
                                time: new Date(value.time).Format("yyyy-MM-dd HH:mm:ss"),
                                number: (currentPage - 1) * 6 + (ind + 1)
                            })
                            responseData.message = '查询成功';
                            if (loanListInfo.length == loanList.length) {
                                var loanList1 = {
                                        loanList,
                                        currentPage: currentPage,
                                        page: page,
                                        count: count,
                                        limit: limit
                                    }
                                    //responseData.productList = productList;
                                Object.assign(responseData, loanList1);
                                return res.json(responseData);
                            }
                        })
                    })
                })
            } else {
                responseData.code = '404';
                responseData.message = '数据库无记录';
                var loanList1 = {
                        loanList: [],
                        currentPage: 1,
                        page: page,
                        count: 0,
                        limit: limit
                    }
                    //responseData.productList = productList;
                Object.assign(responseData, loanList1);
                return res.json(responseData);
            }
        })
    })
    //贷款成功订单
router.get('/get/loanSuccessList', function(req, res, next) {
    var currentPage = parseInt(req.query.currentPage) || 1;
    var limit = 6;
    var page = 0;
    var sum = 0;
    Loan.find({ success: true, fail: false }).count().then(function(count) {
        if (count > 0) {
            //计算总页数
            page = Math.ceil(count / limit);
            //取值不能超过page
            currentPage = Math.min(currentPage, page)
                //取值不能小于1；
            currentPage = Math.max(currentPage, 1);
            var skip = (currentPage - 1) * limit;
            Loan.find({ success: true, fail: false }).limit(limit).skip(skip).then(function(loanListInfo) {
                var loanList = [];
                loanListInfo.forEach(function(value, index) {
                    var ind = index;
                    User.findOne({
                        _id: value._userId
                    }).then(function(userInfo) {
                        loanList.push({
                            _id: value._id,
                            username: userInfo.username,
                            phoneNumber: userInfo.phoneNumber,
                            isVip: userInfo.isVip ? '高级会员' : '普通会员',
                            name: value.name,
                            money: value.money,
                            grant: value.grant,
                            time: new Date(value.time).Format("yyyy-MM-dd HH:mm:ss"),
                            number: (currentPage - 1) * 6 + (ind + 1)
                        })
                        responseData.message = '查询成功';
                        if (loanListInfo.length == loanList.length) {
                            var loanList1 = {
                                    loanList,
                                    currentPage: currentPage,
                                    page: page,
                                    count: count,
                                    limit: limit
                                }
                                //responseData.productList = productList;
                            Object.assign(responseData, loanList1);
                            return res.json(responseData);
                        }
                    })
                })
            })
        } else {
            responseData.code = '404';
            responseData.message = '数据库无记录';
            var loanList1 = {
                    loanList: [],
                    currentPage: 1,
                    page: page,
                    count: 0,
                    limit: limit
                }
                //responseData.productList = productList;
            Object.assign(responseData, loanList1);
            return res.json(responseData);
        }
    })
})

//贷款失败
router.post('/set/setLoanFail', function(req, res, next) {
    var _id = req.body._id;
    if (_id) {
        Loan.findOne({
            _id: _id
        }).then(function(loanInfo) {
            if (loanInfo) {
                var _id = loanInfo._id;
                loanInfo.fail = true;
                delete loanInfo._id;
                Loan.update({ _id: _id }, loanInfo, function(err) {});
                responseData.code = 200;
                responseData.message = '修改成功';
                return res.json(responseData);
            } else {
                responseData.code = 404;
                responseData.message = '修改失败';
                return res.json(responseData);
            }
        })
    } else {
        responseData.code = 404;
        responseData.message = '修改失败';
        return res.json(responseData);
    }
})

//贷款成功
router.post('/set/setLoanSuccess', function(req, res, next) {
    var _id = req.body._id;
    if (_id) {
        Loan.findOne({
            _id: _id
        }).then(function(loanInfo) {
            if (loanInfo) {
                var _id = loanInfo._id;
                loanInfo.success = true;
                delete loanInfo._id;
                Loan.update({ _id: _id }, loanInfo, function(err) {});
                responseData.code = 200;
                responseData.message = '修改成功';
                return res.json(responseData);
            } else {
                responseData.code = 404;
                responseData.message = '修改失败';
                return res.json(responseData);
            }
        })
    } else {
        responseData.code = 404;
        responseData.message = '修改失败';
        return res.json(responseData);
    }
})

//删除贷款订单
router.post('/delete/loanitem', function(req, res, next) {
    var _id = req.body._id;
    //console.log(name);
    Loan.findOne({
        _id: _id
    }).then(function(loanInfo) {
        if (loanInfo) {
            responseData.message = '删除成功';
            Loan.remove({ _id: _id }, function(err) {})
            res.json(responseData);
            return;
        } else {
            responseData.code = 404;
            responseData.message = '删除失败，为找到此订单！';
            res.json(responseData);
            return;
        }
    })
})

//贷款成功积分录入
router.post('/set/DKmember_mark', function(req, res, next) {
    var member_mark = parseInt(req.body.member_mark);
    var _id = req.body._id;
    Loan.findOne({
        _id: _id
    }).then(function(loaninfo) {
        if (loaninfo && (loaninfo.grant == false)) {
            var id = loaninfo._id;
            loaninfo.grant = true;
            User.findOne({
                _id: loaninfo._userId
            }).then(function(userInfo) {
                if (userInfo) {
                    var _id = userInfo._id;
                    userInfo.member_mark = (parseInt(userInfo.member_mark) + member_mark) > 0 ? (parseInt(userInfo.member_mark) + member_mark) : 0;
                    delete userInfo._id;
                    User.update({ _id: _id }, userInfo, function(err) {});
                    delete loaninfo._id;
                    Loan.update({ _id: id }, loaninfo, function(err) {});
                    responseData.message = '修改积分成功';
                    return res.json(responseData);
                } else {
                    responseData.code = 404;
                    responseData.message = '修改积分失败';
                    return res.json(responseData);
                }
            })
        } else {
            responseData.code = 404;
            responseData.message = '修改积分失败';
            return res.json(responseData);
        }
    })
})

//提现未处理订单
router.get('/get/withdrawalsNo', function(req, res, next) {
    var currentPage = parseInt(req.query.currentPage) || 1;
    var limit = 6;
    var page = 0;
    var sum = 0;
    Withdrawals.find({ success: false }).count().then(function(count) {
        if (count > 0) {
            //计算总页数
            page = Math.ceil(count / limit);
            //取值不能超过page
            currentPage = Math.min(currentPage, page)
                //取值不能小于1；
            currentPage = Math.max(currentPage, 1);
            var skip = (currentPage - 1) * limit;
            Withdrawals.find({ success: false }).limit(limit).skip(skip).then(function(WithdrawalsInfo) {
                var withdrawalsList = [];
                WithdrawalsInfo.forEach(function(value, index) {
                    var ind = index;
                    User.findOne({
                        _id: value._userId
                    }).then(function(userInfo) {
                        withdrawalsList.push({
                            _id: value._id,
                            _userId: value._userId,
                            username: userInfo.username,
                            phoneNumber: userInfo.phoneNumber,
                            bankNumber: userInfo.bankNumber,
                            isVip: userInfo.isVip ? '高级会员' : '普通会员',
                            money: value.money,
                            time: new Date(value.time).Format("yyyy-MM-dd HH:mm:ss"),
                            number: (currentPage - 1) * 6 + (ind + 1)
                        })
                        responseData.message = '查询成功';
                        if (WithdrawalsInfo.length == withdrawalsList.length) {
                            var withdrawalsList1 = {
                                    withdrawalsList,
                                    currentPage: currentPage,
                                    page: page,
                                    count: count,
                                    limit: limit
                                }
                                //responseData.productList = productList;
                            Object.assign(responseData, withdrawalsList1);
                            return res.json(responseData);
                        }
                    })
                })
            })
        } else {
            responseData.code = '404';
            responseData.message = '数据库无记录';
            var withdrawalsList1 = {
                    withdrawalsList: [],
                    currentPage: 1,
                    page: page,
                    count: 0,
                    limit: limit
                }
                //responseData.productList = productList;
            Object.assign(responseData, withdrawalsList1);
            return res.json(responseData);
        }
    })
})

//提现成功订单
router.get('/get/withdrawalsSu', function(req, res, next) {
    var currentPage = parseInt(req.query.currentPage) || 1;
    var limit = 6;
    var page = 0;
    var sum = 0;
    Withdrawals.find({ success: true }).count().then(function(count) {
        if (count > 0) {
            //计算总页数
            page = Math.ceil(count / limit);
            //取值不能超过page
            currentPage = Math.min(currentPage, page)
                //取值不能小于1；
            currentPage = Math.max(currentPage, 1);
            var skip = (currentPage - 1) * limit;
            Withdrawals.find({ success: true }).limit(limit).skip(skip).then(function(WithdrawalsInfo) {
                var withdrawalsList = [];
                WithdrawalsInfo.forEach(function(value, index) {
                    var ind = index;
                    User.findOne({
                        _id: value._userId
                    }).then(function(userInfo) {
                        withdrawalsList.push({
                            _id: value._id,
                            _userId: value._userId,
                            username: userInfo.username,
                            phoneNumber: userInfo.phoneNumber,
                            bankNumber: userInfo.bankNumber,
                            isVip: userInfo.isVip ? '高级会员' : '普通会员',
                            money: value.money,
                            time: new Date(value.time).Format("yyyy-MM-dd HH:mm:ss"),
                            number: (currentPage - 1) * 6 + (ind + 1)
                        })
                        responseData.message = '查询成功';
                        if (WithdrawalsInfo.length == withdrawalsList.length) {
                            var withdrawalsList1 = {
                                    withdrawalsList,
                                    currentPage: currentPage,
                                    page: page,
                                    count: count,
                                    limit: limit
                                }
                                //responseData.productList = productList;
                            Object.assign(responseData, withdrawalsList1);
                            return res.json(responseData);
                        }
                    })
                })
            })
        } else {
            responseData.code = '404';
            responseData.message = '数据库无记录';
            var withdrawalsList1 = {
                    withdrawalsList: [],
                    currentPage: 1,
                    page: page,
                    count: 0,
                    limit: limit
                }
                //responseData.productList = productList;
            Object.assign(responseData, withdrawalsList1);
            return res.json(responseData);
        }
    })
})

//提现成功
router.post('/set/withdrawalsSu', function(req, res, next) {
    var _id = req.body._id;
    if (_id) {
        Withdrawals.findOne({
            _id: _id
        }).then(function(WithdrawalsInfo) {
            if (WithdrawalsInfo) {
                var _id = WithdrawalsInfo._id;
                WithdrawalsInfo.success = true;
                delete WithdrawalsInfo._id;
                Withdrawals.update({ _id: _id }, WithdrawalsInfo, function(err) {});
                responseData.code = 200;
                responseData.message = '修改成功';
                return res.json(responseData);
            } else {
                responseData.code = 404;
                responseData.message = '修改失败';
                return res.json(responseData);
            }
        })
    } else {
        responseData.code = 404;
        responseData.message = '修改失败';
        return res.json(responseData);
    }
})
module.exports = router;