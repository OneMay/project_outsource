 window.onload = function() {
     (function cookies() {
         var cookie = document.cookie;
         var reg = /adminuserInfo=(.+)}(.+)/;
         if (reg.test(cookie)) {
             var adminUser = reg.exec(cookie)[1] + '}';
             var adminUserName = JSON.parse(adminUser).username;
             $('.am-icon-dashboard').html('欢迎系统管理员：' + adminUserName);
         } else if (/adminuserInfo=(.+)/.test(cookie)) {
             var reg = /adminuserInfo=(.+)/;
             var adminUser = reg.exec(cookie)[1];
             var adminUserName = JSON.parse(adminUser).username;
             $('.am-icon-dashboard').html('欢迎系统管理员：' + adminUserName);
         } else {
             window.location.href = '/admin/login.html';
         }
     })();
     (function messages() {
         var examine, deliver, loan, withdrawals;
         $.ajax({
             url: '/admin/get/examineList',
             type: 'GET',
             data: {
                 currentPage: 1
             },
             dataType: 'json',
             cache: false,
             success: function(data) {
                 examine = data.count;
                 $.ajax({
                     url: '/admin/get/deliverList',
                     type: 'GET',
                     data: {
                         currentPage: 1
                     },
                     dataType: 'json',
                     cache: false,
                     success: function(data) {
                         deliver = data.count;
                         $.ajax({
                             url: '/admin/get/loanNocList',
                             type: 'GET',
                             data: {
                                 currentPage: 1
                             },
                             dataType: 'json',
                             cache: false,
                             success: function(data) {
                                 loan = data.count;
                                 $.ajax({
                                     url: '/admin/get/withdrawalsNo',
                                     type: 'GET',
                                     data: {
                                         currentPage: 1
                                     },
                                     dataType: 'json',
                                     cache: false,
                                     success: function(data) {
                                         withdrawals = data.count;
                                         var str = '<li class="am-dropdown-header">所有消息都在这里</li>' +
                                             '<li><a href="/admin/examineorderlist.html">会员商城未审核订单 <span class="am-badge am-badge-danger am-round">' + examine + '</span></a></li>' +
                                             '<li><a href="/admin/delivergoodsorderlist.html">会员商城未发货订单 <span class="am-badge am-badge-danger am-round">' + deliver + '</span></a></li>' +
                                             '<li><a href="/admin/loanNoList.html">贷款未处理订单 <span class="am-badge am-badge-danger am-round">' + loan + '</span></a></li>' +
                                             '<li><a href="/admin/withdrawalsNo.html">提现未处理 <span class="am-badge am-badge-danger am-round">' + withdrawals + '</span></a></li>';
                                         $('.am-dropdown-content').html(str)
                                     },
                                     err: function(err) {
                                         console.log(err)
                                     }
                                 })

                             },
                             err: function(err) {
                                 console.log(err);
                             }
                         })

                     },
                     err: function(err) {
                         console.log(err);
                     }
                 })

             },
             err: function(err) {
                 console.log(err);
             }
         })
     })();
 }
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
 if (document.getElementById('addInventory') && document.getElementById('subInventory')) {
     document.getElementById('addInventory').onclick = function() {
         setInventory(1);
     }
     document.getElementById('subInventory').onclick = function() {
         setInventory(-1);
     }
 }


 function setInventory(num) {
     var sum = parseInt($('#inventory')[0].value);
     if (sum + num <= 0) {
         $('#inventory')[0].value = 0;
     } else {
         $('#inventory')[0].value = sum + num;
     }
 }

 /**
  * 添加商品
  */
 var productSubmit = document.getElementById('productSubmit');
 if (productSubmit) {
     productSubmit.onclick = function() {
         var productName = document.getElementById('productName').value;
         var productDescription = document.getElementById('productDescription').value;
         var productFile = document.getElementById('productFile').files[0];
         var ProductIntegration = parseFloat(document.getElementById('ProductIntegration').value, 10);
         var inventory = parseInt(document.getElementById('inventory').value, 10);
         var message;
         if (productName && productDescription && productFile && ProductIntegration >= 0 && inventory >= 0) {
             var imgreg = /.+((\.jpg$)|(\.png$))/gi;
             var ProductIntegrationReg = /\d+/g;
             if (imgreg.test(productFile.name) && ProductIntegrationReg.test(ProductIntegration)) {
                 message = '正在上传...';
                 $('#productmallMessage').html(message)
                 var formData = new FormData();
                 formData.append('productmallPoster', productFile);
                 formData.append('productName', productName);
                 formData.append('productDescription', productDescription);
                 formData.append('ProductIntegration', ProductIntegration);
                 formData.append('inventory', inventory);
                 $.ajax({
                     url: '/admin/add/productmall',
                     type: 'POST',
                     cache: false,
                     data: formData,
                     processData: false,
                     contentType: false,
                     success: function(data) {
                         message = data.message;
                         $('#productmallMessage').html(message);
                         if (data.code == 200) {
                             setTimeout(function() {
                                 window.location.reload();
                             }, 1000)
                         }
                     },
                     err: function(err) {
                         console.log(err)
                         message = '失败';
                         $('#productmallMessage').html(message)
                     }
                 });
             } else {
                 message = '图片格式不正确或者积分格式不正确';
                 $('#productmallMessage').html(message)
             }
         } else {
             message = '内容不能有空！！,积分只能是数字！';
             $('#productmallMessage').html(message)
         }
     }
 }

 /**
  * 分页
  */
 var pathname = window.location.pathname;
 var currentPage = 1;
 var page;
 var number_people;
 if (pathname == '/admin/productlist.html') {
     var mallPrev = document.getElementById('mallPrev');
     var mallNext = document.getElementById('mallNext');
     mallPrev.onclick = function() {
         getCurrentPage(-1);
     }
     mallNext.onclick = function() {
         getCurrentPage(1);
     }
     getPage(currentPage);

 }

 function getCurrentPage(num) {
     if (currentPage + num <= 1) {
         currentPage = 1;
         getPage(currentPage)
     } else if (currentPage + num >= page) {
         currentPage = page;
         getPage(currentPage)
     } else {
         currentPage += num;
         getPage(currentPage)
     }


 }

 function getPage(currentpage) {
     $.ajax({
         url: '/admin/get/mallpageList',
         type: 'GET',
         data: {
             currentPage: currentpage
         },
         cache: false,
         dataType: 'json',
         success: function(data) {
             page = data.page;
             if ($('tbody>tr').length > 0) {
                 $('tbody>tr').remove();
                 $('tbody')[0].removeEventListener('click', deleteItemMall, false);
             }
             if (data.code == 200) {
                 data.productList.forEach((value, index) => {
                     var html = "<tr>" +
                         "<td>" + value.number + "</td>" +
                         "<td>" + value.productName + "</td>" +
                         "<td>" + value.ProductIntegration + "</td>" +
                         "<td>" + value.productInventory +
                         '<br><span class="subInventory2">-</span>' +
                         '<input type="text" style="display:inline-block;width:70px;" class="am-input-sm value2" id="inventory" value="0" readonly>' +
                         '<span class="addInventory2">+</span><br/>' +
                         '<span  class="userSubmit am-btn am-btn-success am-radius"onclick="productInventory(' + "'" + value._id + "'" + ",'" + index + "'" + ')">确定</span>' +
                         "</td>" +
                         "<td class='am-hide-sm-only'>" + value.productDescription + "</td>" +
                         "<td>" +
                         '<div class="am-btn-toolbar">' +
                         '<div class="am-btn-group am-btn-group-xs productmall_id' + value._id + '">' +
                         '<span class="am-btn am-btn-default am-btn-xs am-text-danger am-round productmall_id' + value._id + '" title="删除">' + '<span class="am-icon-trash-o productmall_id' + value._id + '">' + '</span></span>' +
                         '</div>' +
                         '</div>' +
                         '</td>' +
                         "</tr>";
                     $('tbody').append(html);
                 });
                 sub10();
                 add10();
                 var str = '共<span style="color:#dd514c;font-size:20px;">' + data.page + '</span>页，当前第<span style="color: #5eb95e;font-size:20px;">' + data.currentPage + '</span>页';
                 $('.Message').html(str);
                 deletemall()
             } else {
                 $('.Message').html(data.message);
             }
         },
         err: function(err) {
             console.log(err)
         }
     })
 }

 function productInventory(id, index) {
     if (id) {
         var value = parseInt($('.value2')[index].value);
         $.ajax({
             url: '/admin/set/productInventory',
             type: 'POST',
             data: {
                 productInventory: value,
                 _id: id
             },
             cache: false,
             dataType: 'json',
             success: function(data) {
                 if (data.code == 200) {
                     getPage(currentPage)

                 } else {
                     alert(data.message)
                 }
             },
             err: function(err) {
                 console.log(err)
             }
         })
     } else {
         alert('出错！');
     }
 }

 /**积分- */
 function sub10() {
     var dom = $('.subInventory2');
     var value = $('.value2')
     if (dom.length > 0) {
         for (var i = 0; i < dom.length; i++) {
             (function() {
                 var temp = i; //调用时局部变量
                 dom[i].onclick = function() {
                     var sum = parseInt(value[temp].value);
                     value[temp].value = sum - 1;

                 }
             })();
         }
     }
 }

 function add10() {
     var dom = $('.addInventory2');
     var value = $('.value2')
     if (dom.length > 0) {
         for (var i = 0; i < dom.length; i++) {
             (function() {
                 var temp = i; //调用时局部变量
                 dom[i].onclick = function() {
                     var sum = parseInt(value[temp].value);
                     value[temp].value = sum + 1;
                 }
             })();
         }
     }
 }

 function deletemall() {
     if ($('.am-btn-group-xs').length > 0) {
         $('tbody')[0].addEventListener("click", deleteItemMall)
     }
 }
 var regName = [/am-btn-group/, /am-text-danger/, /am-icon-trash-o/]

 function deleteItemMall(e) {
     if (regName[0].test(e.target.className) || regName[1].test(e.target.className) || regName[2].test(e.target.className)) {
         var reg = /productmall_id(.+)/;
         var _id = reg.exec(e.target.className)[1] || '';
         if (_id) {
             $.ajax({
                 url: '/admin/delete/productmall',
                 type: 'POST',
                 data: {
                     _id: _id
                 },
                 cache: false,
                 dataType: 'json',
                 success: function(data) {
                     if (data.code == 200) {
                         getPage(1);
                     }
                 },
                 err: function(err) {
                     console.log(err)
                 }
             })
         }
     }
 }
 /**商城列表结束 */

 if (pathname == '/admin/index.html') {
     $.ajax({
         url: '/admin/findall',
         type: 'GET',
         dataType: 'json',
         cache: false,
         success: function(data) {
             if (data.code == 200) {
                 $('.huiyuan').html(data.huiyuan)
                 $('.shangping').html(data.shangping)
                 $('.dingdan').html(data.dingdan)
                 $('.daikuan').html(data.daikuan)
             }
         },
         err: function(err) {
             console.log(err)
         }
     })

 }
 /**
  * 获取普通vip列表
  */
 if (pathname == '/admin/member.html') {
     var mallPrev = document.getElementById('mallPrev');
     var mallNext = document.getElementById('mallNext');
     var peoplevip = document.getElementById('peoplevip')
     mallPrev.onclick = function() {
         getCurrentPage2(-1);
     }
     mallNext.onclick = function() {
         getCurrentPage2(1);
     }
     peoplevip.onclick = function() {
         getPage2(1)
     }
     getPage2(currentPage);

 }

 function getCurrentPage2(num) {
     if (currentPage + num <= 1) {
         currentPage = 1;
         getPage2(currentPage)
     } else if (currentPage + num >= page) {
         currentPage = page;
         getPage2(currentPage)
     } else {
         currentPage += num;
         getPage2(currentPage)
     }


 }

 function getPage2(currentpage) {
     var vippeople = document.getElementById('inventory').value;
     var phoneNumber = '';
     if (vippeople) {
         phoneNumber = vippeople
     }
     $.ajax({
         url: '/admin/get/userlist',
         type: 'post',
         data: {
             currentPage: currentpage,
             phoneNumber: phoneNumber
         },
         cache: false,
         dataType: 'json',
         success: function(data) {
             page = data.page;
             if ($('tbody>tr').length > 0) {
                 $('tbody>tr').remove();
             }
             if (data.code == 200) {
                 if (!phoneNumber) {
                     var dom = '<tr class="am-success">' +
                         '<th class="table-id">序号</th>' +
                         '<th class="table-title">会员名称</th>' +
                         '<th class="table-type">会员等级</th>' +
                         '<th class="table-author am-hide-sm-only">会员积分</th>' +
                         '<th class="table-author am-hide-sm-only">电话号码</th>' +
                         '<th class="table-date am-hide-sm-only">银行卡号</th>' +
                         '<th class="table-date am-hide-sm-only">商城花费</th>' +
                         '<th class="table-date am-hide-sm-only">直接获利人数</th>' +
                         '<th class="table-date am-hide-sm-only">间接获利人数</th>' +
                         '<th class="table-date am-hide-sm-only" id="number_people">推荐奖</th>' +
                         '<th width="130px" class="table-set">操作</th>' +
                         '</tr>';
                     $('thead').html(dom)
                     data.userList.forEach(function(value, index) {
                         var html = '<tr>' +
                             '<td>' + value.number + '</td>' +
                             '<td>' + value.username + '</td>' +
                             '<td>普通会员</td>' +
                             '<td class="am-hide-sm-only">' + value.member_mark + '</td>' +
                             '<td class="am-hide-sm-only">' + value.phoneNumber + '</td>' +
                             '<td class="am-hide-sm-only">' + value.bankNumber + '</td>' +
                             '<td class="am-hide-sm-only">' + value.usedmoney + '</td>' +
                             '<td class="am-hide-sm-only">' + value.straight + '人，积分兑换：<br/>' +
                             '<span class="subInventory">-</span>' +
                             '<input type="text" style="display:inline-block;width:70px;" class="am-input-sm value1" id="inventory" value="0" readonly>' +
                             '<span class="addInventory">+</span><br/>' +
                             '<span  class="userSubmit am-btn am-btn-success am-radius"onclick="setToJFformstraight(' + "'" + value._id + "'" + ",'" + index + "'" + ",'" + value.straight + "'" + ')">确定</span>' +
                             '</td>' +
                             '<td class="am-hide-sm-only">' + value.secondhand + '人，积分兑换：<br/>' +
                             '<span class="subInventory2">-</span>' +
                             '<input type="text" style="display:inline-block;width:70px;" class="am-input-sm value2" id="inventory" value="0" readonly>' +
                             '<span class="addInventory2">+</span><br/>' +
                             '<span  class="userSubmit am-btn am-btn-success am-radius"onclick="setToJFformsecondhand(' + "'" + value._id + "'" + ",'" + index + "'" + ",'" + value.secondhand + "'" + ')">确定</span>' +
                             '</td>' +
                             '<td class="am-hide-sm-only">已奖励次数：<span style="color:#187794;font-size:20px;">' + value.power + '</span>次，' + '总人数-上一次人数：<span style="color:#dd514c;font-size:20px;">' + value.invitated_people + '</span>-<span style="color: #5eb95e;font-size:20px;">' + value.previnvitated_people + '</span>=' + '<span style="color:#510656;font-size:20px;">' + (value.invitated_people - value.previnvitated_people) + '</span></td>' +
                             '<td>' +
                             '<div class="am-btn-toolbar">' +
                             '<div class="am-btn-group am-btn-group-xs">' +
                             '<span class="am-btn am-btn-default am-btn-xs am-text-secondary am-round" title="设置为高级vip" onclick="setToViper(' + "'" + value._id + "'" + ')"><span class="am-icon-pencil-square-o"></span></span>' +
                             '<span class="am-btn am-btn-default am-btn-xs am-text-danger am-round" title="删除" onclick="deleteVip(' + "'" + value._id + "'" + ')"><span class="am-icon-trash-o" ></span></span>' +
                             '</div>' +
                             '</div>' +
                             '</td>' +
                             '</tr>';
                         $('tbody').append(html);

                     });
                     sub();
                     add();
                     sub2();
                     add2();
                     var str = '总人数：<span style="color:#187794;font-size:20px;">' + data.count + '</span>人，共<span style="color:#dd514c;font-size:20px;">' + data.page + '</span>页，当前第<span style="color: #5eb95e;font-size:20px;">' + data.currentPage + '</span>页';
                     $('.Message').html(str);
                     $('#number_people').html('推荐奖（大于' + data.number_people + '人）');
                 } else {
                     var dom = '<tr class="am-success">' +
                         '<th class="table-id">序号</th>' +
                         '<th class="table-title">会员名称</th>' +
                         '<th class="table-type">会员等级</th>' +
                         '<th class="table-author am-hide-sm-only">会员积分</th>' +
                         '<th class="table-author am-hide-sm-only">电话号码</th>' +
                         '<th class="table-date am-hide-sm-only">银行卡号</th>' +
                         '<th class="table-date am-hide-sm-only">直接获利人数</th>' +
                         '<th class="table-date am-hide-sm-only">间接获利人数</th>' +
                         '<th class="table-date am-hide-sm-only2">推荐人电话</th>' +
                         '<th class="table-date am-hide-sm-only3 ">推荐人的推荐人电话</th>' +
                         '<th class="table-date am-hide-sm-only" id="number_people">推荐奖</th>' +
                         '<th width="130px" class="table-set">操作</th>' +
                         '</tr>';
                     $('thead').html(dom)
                     data.userList.forEach(function(value, index) {
                         var html = '<tr>' +
                             '<td>' + value.number + '</td>' +
                             '<td>' + value.username + '</td>' +
                             '<td>普通会员</td>' +
                             '<td class="am-hide-sm-only">' + value.member_mark + '</td>' +
                             '<td class="am-hide-sm-only">' + value.phoneNumber + '</td>' +
                             '<td class="am-hide-sm-only">' + value.bankNumber + '</td>' +
                             '<td class="am-hide-sm-only">' + value.straight + '人，积分兑换：<br/>' +
                             '<span class="subInventory">-</span>' +
                             '<input type="text" style="display:inline-block;width:70px;" class="am-input-sm value1" id="inventory" value="0" readonly>' +
                             '<span class="addInventory">+</span><br/>' +
                             '<span  class="userSubmit am-btn am-btn-success am-radius"onclick="setToJFformstraight(' + "'" + value._id + "'" + ",'" + index + "'" + ",'" + value.straight + "'" + ')">确定</span>' +
                             '</td>' +
                             '<td class="am-hide-sm-only">' + value.secondhand + '人，积分兑换：<br/>' +
                             '<span class="subInventory2">-</span>' +
                             '<input type="text" style="display:inline-block;width:70px;" class="am-input-sm value2" id="inventory" value="0" readonly>' +
                             '<span class="addInventory2">+</span><br/>' +
                             '<span  class="userSubmit am-btn am-btn-success am-radius"onclick="setToJFformsecondhand(' + "'" + value._id + "'" + ",'" + index + "'" + ",'" + value.secondhand + "'" + ')">确定</span>' +
                             '</td>' +
                             '<td class="am-hide-sm-only">' + value.lastphoneNumber + '</td>' +
                             '<td class="am-hide-sm-only">' + value.lasterphoneNumber + '</td>' +
                             '<td class="am-hide-sm-only">已奖励次数：<span style="color:#187794;font-size:20px;">' + value.power + '</span>次，' + '总人数-上一次人数：<span style="color:#dd514c;font-size:20px;">' + value.invitated_people + '</span>-<span style="color: #5eb95e;font-size:20px;">' + value.previnvitated_people + '</span>=' + '<span style="color:#510656;font-size:20px;">' + (value.invitated_people - value.previnvitated_people) + '</span></td>' +
                             '<td>' +
                             '<div class="am-btn-toolbar">' +
                             '<div class="am-btn-group am-btn-group-xs">' +
                             '<span class="am-btn am-btn-default am-btn-xs am-text-secondary am-round" title="设置为高级vip" onclick="setToViper(' + "'" + value._id + "'" + ')"><span class="am-icon-pencil-square-o"></span></span>' +
                             '<span class="am-btn am-btn-default am-btn-xs am-text-danger am-round" title="删除" onclick="deleteVip(' + "'" + value._id + "'" + ')"><span class="am-icon-trash-o" ></span></span>' +
                             '</div>' +
                             '</div>' +
                             '</td>' +
                             '</tr>';
                         $('tbody').append(html);
                     });
                     sub();
                     add();
                     sub2();
                     add2();
                     var str = '总人数：<span style="color:#187794;font-size:20px;">' + data.count + '</span>人，共<span style="color:#dd514c;font-size:20px;">' + data.page + '</span>页，当前第<span style="color: #5eb95e;font-size:20px;">' + data.currentPage + '</span>页';
                     $('.Message').html(str);
                     $('#number_people').html('推荐奖（大于' + data.number_people + '人）');
                 }

             } else {
                 sub();
                 add();
                 sub2();
                 add2();
                 $('.Message').html(data.message);
                 $('#number_people').html('推荐奖（大于' + data.number_people + '人）');
             }
         },
         err: function(err) {
             console.log(err)
         }
     })
 }



 //获取高级vip列表
 if (pathname == '/admin/membervip.html') {
     var mallPrev = document.getElementById('mallPrev');
     var mallNext = document.getElementById('mallNext');
     var peoplevip = document.getElementById('peoplevip')
     mallPrev.onclick = function() {
         getCurrentPage3(-1);
     }
     mallNext.onclick = function() {
         getCurrentPage3(1);
     }
     peoplevip.onclick = function() {
         getPage3(1)
     }
     getPage3(currentPage);

 }

 function getCurrentPage3(num) {
     if (currentPage + num <= 1) {
         currentPage = 1;
         getPage3(currentPage)
     } else if (currentPage + num >= page) {
         currentPage = page;
         getPage3(currentPage)
     } else {
         currentPage += num;
         getPage3(currentPage)
     }


 }

 function getPage3(currentpage) {
     var vippeople = document.getElementById('inventory').value;
     var phoneNumber = '';
     if (vippeople) {
         phoneNumber = vippeople
     }
     $.ajax({
         url: '/admin/get/userViplist',
         type: 'POST',
         data: {
             currentPage: currentpage,
             phoneNumber: phoneNumber
         },
         cache: false,
         dataType: 'json',
         success: function(data) {
             page = data.page;
             if ($('tbody>tr').length > 0) {
                 $('tbody>tr').remove();
             }
             if (data.code == 200) {
                 number_people = data.number_people;
                 if (!phoneNumber) {
                     var dom = '<tr class="am-success">' +
                         '<th class="table-id">序号</th>' +
                         '<th class="table-title">会员名称</th>' +
                         '<th class="table-type">会员等级</th>' +
                         '<th class="table-author am-hide-sm-only">会员积分</th>' +
                         '<th class="table-author am-hide-sm-only">电话号码</th>' +
                         '<th class="table-date am-hide-sm-only">银行卡号</th>' +
                         '<th class="table-date am-hide-sm-only">直接获利人数</th>' +
                         '<th class="table-date am-hide-sm-only">间接获利人数</th>' +
                         '<th class="table-date am-hide-sm-only" id="number_people">推荐奖</th>' +
                         '<th width="130px" class="table-set">操作</th>' +
                         '</tr>';
                     $('thead').html(dom)
                     data.userList.forEach(function(value, index) {
                         var html = '<tr>' +
                             '<td>' + value.number + '</td>' +
                             '<td>' + value.username + '</td>' +
                             '<td>高级会员</td>' +
                             '<td class="am-hide-sm-only">' + value.member_mark + '</td>' +
                             '<td class="am-hide-sm-only">' + value.phoneNumber + '</td>' +
                             '<td class="am-hide-sm-only">' + value.bankNumber + '</td>' +
                             '<td class="am-hide-sm-only">' + value.straight + '人，积分兑换：<br/>' +
                             '<span class="subInventory">-</span>' +
                             '<input type="text" style="display:inline-block;width:70px;" class="am-input-sm value1" id="inventory" value="0" readonly>' +
                             '<span class="addInventory">+</span><br/>' +
                             '<span  class="userSubmit am-btn am-btn-success am-radius"onclick="setToJFformstraight(' + "'" + value._id + "'" + ",'" + index + "'" + ",'" + value.straight + "'" + ')">确定</span>' +
                             '</td>' +
                             '<td class="am-hide-sm-only">' + value.secondhand + '人，积分兑换：<br/>' +
                             '<span class="subInventory2">-</span>' +
                             '<input type="text" style="display:inline-block;width:70px;" class="am-input-sm value2" id="inventory" value="0" readonly>' +
                             '<span class="addInventory2">+</span><br/>' +
                             '<span  class="userSubmit am-btn am-btn-success am-radius"onclick="setToJFformsecondhand(' + "'" + value._id + "'" + ",'" + index + "'" + ",'" + value.secondhand + "'" + ')">确定</span>' +
                             '</td>' +
                             '<td class="am-hide-sm-only">已奖励次数：<span style="color:#187794;font-size:20px;">' + value.power + '</span>次，' + '总人数-上一次人数：<span style="color:#dd514c;font-size:20px;">' + value.invitated_people + '</span>-<span style="color: #5eb95e;font-size:20px;">' + value.previnvitated_people + '</span>=' + '<span style="color:#510656;font-size:20px;">' + (value.invitated_people - value.previnvitated_people) + '</span><br/>' +
                             '积分兑换：' + '<span class="subInventory3">-</span>' +
                             '<input type="text" style="display:inline-block;width:70px;" class="am-input-sm value3" id="inventory" value="0" readonly>' +
                             '<span class="addInventory3">+</span>' +
                             '&nbsp&nbsp<span  class="userSubmit am-btn am-btn-success am-radius"onclick="setTuanDuiJF(' + "'" + value._id + "'" + ",'" + index + "'" + ",'" + (value.invitated_people - value.previnvitated_people) + "'" + ')">确定</span>' +
                             '</td>' +
                             '<td>' +
                             '<div class="am-btn-toolbar">' +
                             '<div class="am-btn-group am-btn-group-xs">' +
                             '<span class="am-btn am-btn-default am-btn-xs am-text-secondary am-round" title="调整为普通vip" onclick="setToVip(' + "'" + value._id + "'" + ')"><span class="am-icon-pencil-square-o"></span></span>' +
                             '</div>' +
                             '</div>' +
                             '</td>' +
                             '</tr>';
                         $('tbody').append(html);
                     });
                     sub();
                     add();
                     sub2();
                     add2();
                     sub3();
                     add3();
                     var str = '总人数：<span style="color:#187794;font-size:20px;">' + data.count + '</span>人，共<span style="color:#dd514c;font-size:20px;">' + data.page + '</span>页，当前第<span style="color: #5eb95e;font-size:20px;">' + data.currentPage + '</span>页';
                     $('.Message').html(str);
                     $('#number_people').html('推荐奖（大于' + data.number_people + '人）');
                 } else {
                     var dom = '<tr class="am-success">' +
                         '<th class="table-id">序号</th>' +
                         '<th class="table-title">会员名称</th>' +
                         '<th class="table-type">会员等级</th>' +
                         '<th class="table-author am-hide-sm-only">会员积分</th>' +
                         '<th class="table-author am-hide-sm-only">电话号码</th>' +
                         '<th class="table-date am-hide-sm-only">银行卡号</th>' +
                         '<th class="table-date am-hide-sm-only">直接获利人数</th>' +
                         '<th class="table-date am-hide-sm-only">间接获利人数</th>' +
                         '<th class="table-date am-hide-sm-only2">推荐人电话</th>' +
                         '<th class="table-date am-hide-sm-only3 ">推荐人的推荐人电话</th>' +
                         '<th class="table-date am-hide-sm-only" id="number_people">推荐奖</th>' +
                         '<th width="130px" class="table-set">操作</th>' +
                         '</tr>';
                     $('thead').html(dom)
                     data.userList.forEach(function(value, index) {
                         var html = '<tr>' +
                             '<td>' + value.number + '</td>' +
                             '<td>' + value.username + '</td>' +
                             '<td>高级会员</td>' +
                             '<td class="am-hide-sm-only">' + value.member_mark + '</td>' +
                             '<td class="am-hide-sm-only">' + value.phoneNumber + '</td>' +
                             '<td class="am-hide-sm-only">' + value.bankNumber + '</td>' +
                             '<td class="am-hide-sm-only">' + value.straight + '人，积分兑换：<br/>' +
                             '<span class="subInventory">-</span>' +
                             '<input type="text" style="display:inline-block;width:70px;" class="am-input-sm value1" id="inventory" value="0" readonly>' +
                             '<span class="addInventory">+</span><br/>' +
                             '<span  class="userSubmit am-btn am-btn-success am-radius"onclick="setToJFformstraight(' + "'" + value._id + "'" + ",'" + index + "'" + ",'" + value.straight + "'" + ')">确定</span>' +
                             '</td>' +
                             '<td class="am-hide-sm-only">' + value.secondhand + '人，积分兑换：<br/>' +
                             '<span class="subInventory2">-</span>' +
                             '<input type="text" style="display:inline-block;width:70px;" class="am-input-sm value2" id="inventory" value="0" readonly>' +
                             '<span class="addInventory2">+</span><br/>' +
                             '<span  class="userSubmit am-btn am-btn-success am-radius"onclick="setToJFformsecondhand(' + "'" + value._id + "'" + ",'" + index + "'" + ",'" + value.secondhand + "'" + ')">确定</span>' +
                             '</td>' +
                             '<td class="am-hide-sm-only">' + value.lastphoneNumber + '</td>' +
                             '<td class="am-hide-sm-only">' + value.lasterphoneNumber + '</td>' +
                             '<td class="am-hide-sm-only">已奖励次数：<span style="color:#187794;font-size:20px;">' + value.power + '</span>次，' + '总人数-上一次人数：<span style="color:#dd514c;font-size:20px;">' + value.invitated_people + '</span>-<span style="color: #5eb95e;font-size:20px;">' + value.previnvitated_people + '</span>=' + '<span style="color:#510656;font-size:20px;">' + (value.invitated_people - value.previnvitated_people) + '</span><br/>' +
                             '积分兑换：' + '<span class="subInventory3">-</span>' +
                             '<input type="text" style="display:inline-block;width:70px;" class="am-input-sm value3" id="inventory" value="0" readonly>' +
                             '<span class="addInventory3">+</span>' +
                             '&nbsp&nbsp<span  class="userSubmit am-btn am-btn-success am-radius"onclick="setTuanDuiJF(' + "'" + value._id + "'" + ",'" + index + "'" + ",'" + (value.invitated_people - value.previnvitated_people) + "'" + ')">确定</span>' +
                             '</td>' +
                             '<td>' +
                             '<div class="am-btn-toolbar">' +
                             '<div class="am-btn-group am-btn-group-xs">' +
                             '<span class="am-btn am-btn-default am-btn-xs am-text-secondary am-round" title="调整为普通vip" onclick="setToVip(' + "'" + value._id + "'" + ')"><span class="am-icon-pencil-square-o"></span></span>' +
                             '</div>' +
                             '</div>' +
                             '</td>' +
                             '</tr>';
                         $('tbody').append(html);
                     });
                     sub();
                     add();
                     sub2();
                     add2();
                     sub3();
                     add3();
                     var str = '总人数：<span style="color:#187794;font-size:20px;">' + data.count + '</span>人，共<span style="color:#dd514c;font-size:20px;">' + data.page + '</span>页，当前第<span style="color: #5eb95e;font-size:20px;">' + data.currentPage + '</span>页';
                     $('.Message').html(str);
                     $('#number_people').html('推荐奖（大于' + data.number_people + '人）');
                 }

             } else {
                 sub();
                 add();
                 sub2();
                 add2();
                 sub3();
                 add3();
                 $('.Message').html(data.message);
                 $('#number_people').html('推荐奖（大于' + data.number_people + '人）');
             }
         },
         err: function(err) {
             console.log(err)
         }
     })
 }

 /**
  * 会员列表结束
  */

 /**积分- */
 function sub() {
     var dom = $('.subInventory');
     var value = $('.value1')
     if (dom.length > 0) {
         for (var i = 0; i < dom.length; i++) {
             (function() {
                 var temp = i; //调用时局部变量
                 dom[i].onclick = function() {
                     var sum = parseInt(value[temp].value);
                     if (sum - 1 <= 0) {
                         value[temp].value = 0;
                     } else {
                         value[temp].value = sum - 1;
                     }
                 }
             })();
         }
     }
 }

 function add() {
     var dom = $('.addInventory');
     var value = $('.value1')
     if (dom.length > 0) {
         for (var i = 0; i < dom.length; i++) {
             (function() {
                 var temp = i; //调用时局部变量
                 dom[i].onclick = function() {
                     var sum = parseInt(value[temp].value);
                     value[temp].value = sum + 1;
                 }
             })();
         }
     }
 }

 function sub2() {
     var dom = $('.subInventory2');
     var value = $('.value2')
     if (dom.length > 0) {
         for (var i = 0; i < dom.length; i++) {
             (function() {
                 var temp = i; //调用时局部变量
                 dom[i].onclick = function() {
                     var sum = parseInt(value[temp].value);
                     if (sum - 1 <= 0) {
                         value[temp].value = 0;
                     } else {
                         value[temp].value = sum - 1;
                     }
                 }
             })();
         }
     }
 }

 function add2() {
     var dom = $('.addInventory2');
     var value = $('.value2')
     if (dom.length > 0) {
         for (var i = 0; i < dom.length; i++) {
             (function() {
                 var temp = i; //调用时局部变量
                 dom[i].onclick = function() {
                     var sum = parseInt(value[temp].value);
                     value[temp].value = sum + 1;
                 }
             })();
         }
     }
 }

 function sub3() {
     var dom = $('.subInventory3');
     var value = $('.value3')
     if (dom.length > 0) {
         for (var i = 0; i < dom.length; i++) {
             (function() {
                 var temp = i; //调用时局部变量
                 dom[i].onclick = function() {
                     var sum = parseInt(value[temp].value);
                     if (sum - 1 <= 0) {
                         value[temp].value = 0;
                     } else {
                         value[temp].value = sum - 1;
                     }
                 }
             })();
         }
     }
 }

 function add3() {
     var dom = $('.addInventory3');
     var value = $('.value3')
     if (dom.length > 0) {
         for (var i = 0; i < dom.length; i++) {
             (function() {
                 var temp = i; //调用时局部变量
                 dom[i].onclick = function() {
                     var sum = parseInt(value[temp].value);
                     value[temp].value = sum + 1;
                 }
             })();
         }
     }
 }
 //直接奖
 function setToJFformstraight(id, index, sum) {
     if (sum && sum > 0 && id && index && parseInt($('.value1')[index].value) > 0) {
         var value = parseInt($('.value1')[index].value);
         $.ajax({
             url: '/admin/set/vipmember_mark',
             type: 'POST',
             data: {
                 member_mark: value,
                 _id: id,
                 isstraight: 'straight'
             },
             cache: false,
             dataType: 'json',
             success: function(data) {
                 if (data.code == 200) {
                     if (pathname == '/admin/membervip.html') {
                         getPage3(currentPage)
                     } else if (pathname == '/admin/member.html') {
                         getPage2(currentPage)
                     }
                 } else {
                     console.log(data.message)
                 }
             },
             err: function(err) {
                 console.log(err)
             }
         })
     } else {
         alert('出错！');
     }
 }
 //间接奖
 function setToJFformsecondhand(id, index, sum) {
     if (sum && sum > 0 && id && index && parseInt($('.value2')[index].value) > 0) {
         var value = parseInt($('.value2')[index].value);
         $.ajax({
             url: '/admin/set/vipmember_mark',
             type: 'POST',
             data: {
                 member_mark: value,
                 _id: id,
                 isstraight: 'secondhand'
             },
             cache: false,
             dataType: 'json',
             success: function(data) {
                 if (data.code == 200) {
                     if (pathname == '/admin/membervip.html') {
                         getPage3(currentPage)
                     } else if (pathname == '/admin/member.html') {
                         getPage2(currentPage)
                     }
                 } else {
                     console.log(data.message)
                 }
             },
             err: function(err) {
                 console.log(err)
             }
         })
     } else {
         alert('出错！');
     }
 }
 //团队奖
 function setTuanDuiJF(id, index, sum) {
     if (sum && sum > number_people && id && index && parseInt($('.value3')[index].value) > 0) {
         var value = parseInt($('.value3')[index].value);
         $.ajax({
             url: '/admin/set/vipmember_mark',
             type: 'POST',
             data: {
                 member_mark: value,
                 _id: id,
                 isstraight: 'invitated'
             },
             cache: false,
             dataType: 'json',
             success: function(data) {
                 if (data.code == 200) {
                     getPage3(currentPage)
                 } else {
                     console.log(data.message)
                 }
             },
             err: function(err) {
                 console.log(err)
             }
         })
     } else {
         alert('出错！');
     }
 }
 /**
  * 删除会员
  */

 function deleteVip(id) {
     if (id) {
         $.ajax({
             url: '/admin/delete/vip',
             type: 'POST',
             data: {
                 _id: id
             },
             cache: false,
             dataType: 'json',
             success: function(data) {
                 if (data.code == 200) {
                     if (pathname == '/admin/membervip.html') {
                         getPage3(1)
                     } else if (pathname == '/admin/member.html') {
                         getPage2(1)
                     }
                 } else {
                     console.log(data.message)
                 }
             },
             err: function(err) {
                 console.log(err)
             }
         })
     } else {
         alert('出错！');
     }
 }
 /**
  * 设置高级vip
  */
 function setToViper(id) {
     if (id) {
         $.ajax({
             url: '/admin/set/viper',
             type: 'POST',
             data: {
                 _id: id
             },
             cache: false,
             dataType: 'json',
             success: function(data) {
                 if (data.code == 200) {
                     getPage2(1)
                 } else {
                     alert(data.message)
                 }
             },
             err: function(err) {
                 console.log(err)
             }
         })
     } else {
         alert('出错！');
     }
 }

 /**
  * 设置普通vip
  */
 function setToVip(id) {
     if (id) {
         $.ajax({
             url: '/admin/set/tovip',
             type: 'POST',
             data: {
                 _id: id
             },
             cache: false,
             dataType: 'json',
             success: function(data) {
                 if (data.code == 200) {
                     getPage3(1)
                 } else {
                     alert(data.message)
                 }
             },
             err: function(err) {
                 console.log(err)
             }
         })
     } else {
         alert('出错！');
     }
 }
 //推荐奖人数
 if (document.getElementById('number_people')) {
     document.getElementById('number_people').onclick = function() {
         var value = parseInt($('#inventory')[0].value);
         if (value >= 0) {
             $.ajax({
                 url: '/admin/set/number_people',
                 type: 'POST',
                 data: {
                     number_people: value
                 },
                 cache: false,
                 dataType: 'json',
                 success: function(data) {
                     if (data.code == 200) {
                         alert(data.message)
                         window.location.reload()
                     } else {
                         alert(data.message)
                     }
                 }
             })
         }
     }
 }

 /**
  * 添加文章
  */
 var MembersDemeanorSubmit = document.getElementById('MembersDemeanorSubmit');
 if (MembersDemeanorSubmit) {
     MembersDemeanorSubmit.onclick = function() {
         var MembersDemeanorTitle = document.getElementById('MembersDemeanorTitle').value;
         var MembersDemeanorContent = document.getElementById('MembersDemeanorContent').value;
         var MembersDemeanorFile = document.getElementById('MembersDemeanorFile').files[0];
         var message;
         if (MembersDemeanorTitle && MembersDemeanorContent && MembersDemeanorFile) {
             var imgreg = /.+((\.jpg$)|(\.png$))/gi;
             if (imgreg.test(MembersDemeanorFile.name)) {
                 message = '正在上传...';
                 $('#MembersDemeanorMessage').html(message)
                 var formData = new FormData();
                 formData.append('MembersDemeanorTitle', MembersDemeanorTitle);
                 formData.append('MembersDemeanorFile', MembersDemeanorFile);
                 formData.append('MembersDemeanorContent', MembersDemeanorContent);
                 $.ajax({
                     url: '/admin/add/MembersDemeanor',
                     type: 'POST',
                     cache: false,
                     data: formData,
                     processData: false,
                     contentType: false,
                     success: function(data) {
                         message = data.message;
                         $('#MembersDemeanorMessage').html(message);
                         if (data.code == 200) {
                             setTimeout(function() {
                                 window.location.reload();
                             }, 1000)
                         }
                     },
                     err: function(err) {
                         console.log(err)
                         message = '失败';
                         $('#MembersDemeanorMessage').html(message)
                     }
                 });
             } else {
                 message = '图片格式不正确';
                 $('#MembersDemeanorMessage').html(message)
             }
         } else {
             message = '内容不能有空！！';
             $('#MembersDemeanorMessage').html(message)
         }
     }
 }

 /**
  * 文章列表
  */
 if (pathname == '/admin/MembersDemeanorList.html') {
     var mallPrev = document.getElementById('mallPrev');
     var mallNext = document.getElementById('mallNext');
     mallPrev.onclick = function() {
         getCurrentPage4(-1);
     }
     mallNext.onclick = function() {
         getCurrentPage4(1);
     }
     getPage4(currentPage);

 }

 function getCurrentPage4(num) {
     if (currentPage + num <= 1) {
         currentPage = 1;
         getPage4(currentPage)
     } else if (currentPage + num >= page) {
         currentPage = page;
         getPage4(currentPage)
     } else {
         currentPage += num;
         getPage4(currentPage)
     }


 }

 function getPage4(currentpage) {
     $.ajax({
         url: '/admin/get/membersDemeanorList',
         type: 'GET',
         data: {
             currentPage: currentpage
         },
         cache: false,
         dataType: 'json',
         success: function(data) {
             page = data.page;
             if ($('tbody>tr').length > 0) {
                 $('tbody>tr').remove();
             }
             if (data.code == 200) {
                 data.membersDemeanorList.forEach((value, index) => {
                     var html = "<tr>" +
                         "<td>" + value.number + "</td>" +
                         "<td>" + value.title + "</td>" +
                         "<td>" + value.time + "</td>" +
                         '<td>' +
                         '<div class="am-btn-toolbar">' +
                         '<div class="am-btn-group am-btn-group-xs">' +
                         '<span class="am-btn am-btn-default am-btn-xs am-text-danger" title="删除" onclick="deletemembersDemeanor(' + "'" + value._id + "'" + ')">' + '<span class="am-icon-trash-o productmall_id' + value._id + '">' + '</span></span>' +
                         '</div>' +
                         '</div>' +
                         '</td>' +
                         "</tr>";
                     $('tbody').append(html);
                 });
                 var str = '共<span style="color:#dd514c;font-size:20px;">' + data.page + '</span>页，当前第<span style="color: #5eb95e;font-size:20px;">' + data.currentPage + '</span>页';
                 $('.Message').html(str);
             } else {
                 $('.Message').html(data.message);
             }
         },
         err: function(err) {
             console.log(err)
         }
     })
 }

 //文章删除
 function deletemembersDemeanor(id) {
     if (id) {
         $.ajax({
             url: '/admin/delete/membersDemeanoritem',
             type: 'POST',
             data: {
                 _id: id
             },
             cache: false,
             dataType: 'json',
             success: function(data) {
                 if (data.code == 200) {

                     getPage4(1)

                 } else {
                     console.log(data.message)
                 }
             },
             err: function(err) {
                 console.log(err)
             }
         })
     } else {
         alert('出错！');
     }
 }

 //会员商城未审核订单
 if (pathname == '/admin/examineorderlist.html') {
     var mallPrev = document.getElementById('mallPrev');
     var mallNext = document.getElementById('mallNext');
     mallPrev.onclick = function() {
         getCurrentPage5(-1);
     }
     mallNext.onclick = function() {
         getCurrentPage5(1);
     }
     getPage5(currentPage);

 }

 function getCurrentPage5(num) {
     if (currentPage + num <= 1) {
         currentPage = 1;
         getPage5(currentPage)
     } else if (currentPage + num >= page) {
         currentPage = page;
         getPage5(currentPage)
     } else {
         currentPage += num;
         getPage5(currentPage)
     }


 }

 function getPage5(currentpage) {
     $.ajax({
         url: '/admin/get/examineList',
         type: 'GET',
         data: {
             currentPage: currentpage
         },
         cache: false,
         dataType: 'json',
         success: function(data) {
             page = data.page;
             if ($('tbody>tr').length > 0) {
                 $('tbody>tr').remove();
             }
             if (data.code == 200) {
                 sort(data);
                 data.orderList.forEach((value, index) => {
                     var html = "<tr>" +
                         "<td>" + value.number + "</td>" +
                         "<td>" + value.phoneNumber + "</td>" +
                         "<td>" + value.username + "</td>" +
                         "<td>" + value.isVip + "</td>" +
                         "<td>" + value.mallName + "</td>" +
                         "<td>" + value.inventory + "</td>" +
                         "<td>" + value.time + "</td>" +
                         "<td>" + value.money + "</td>" +
                         '<td>' +
                         '<div class="am-btn-toolbar">' +
                         '<div class="am-btn-group am-btn-group-xs">' +
                         '<span class="am-btn am-btn-default am-btn-xs am-text-secondary am-round" title="审核通过" onclick="setToDeliver(' + "'" + value._id + "'" + ')">' + '<span class="am-icon-pencil-square-o"></span></span>' +
                         '<span class="am-btn am-btn-default am-btn-xs am-text-danger am-round" title="审核不通过" onclick="setToFail(' + "'" + value._id + "'" + ')"><span class="am-icon-music" ></span></span>' +
                         '<span class="am-btn am-btn-default am-btn-xs am-text-danger am-round" title="删除" onclick="deleteDD(' + "'" + value._id + "'" + ')"><span class="am-icon-trash-o" ></span></span>' +
                         '</div>' +
                         '</div>' +
                         '</td>' +
                         "</tr>";
                     $('tbody').append(html);
                 });
                 var str = '总数：<span style="color:#187794;font-size:20px;">' + data.count + '</span>条，共<span style="color:#dd514c;font-size:20px;">' + data.page + '</span>页，当前第<span style="color: #5eb95e;font-size:20px;">' + data.currentPage + '</span>页';
                 $('.Message').html(str);
             } else {
                 $('.Message').html(data.message);
             }
         },
         err: function(err) {
             console.log(err)
         }
     })
 }
 //审核通过
 function setToDeliver(id) {
     if (id) {
         $.ajax({
             url: '/admin/set/setToDeliver',
             type: 'POST',
             data: {
                 _id: id
             },
             cache: false,
             dataType: 'json',
             success: function(data) {
                 console.log(data.code)
                 if (data.code == 200) {
                     getPage5(1)
                 } else {
                     alert(data.message)
                 }
             },
             err: function(err) {
                 console.log(err)
             }
         })
     } else {
         alert('出错')
     }
 }
 //审核不通过
 function setToFail(id) {
     if (id) {
         $.ajax({
             url: '/admin/set/setToFail',
             type: 'POST',
             data: {
                 _id: id
             },
             cache: false,
             dataType: 'json',
             success: function(data) {
                 if (data.code == 200) {
                     getPage5(1)
                 } else {
                     alert(data.message)
                 }
             },
             err: function(err) {
                 console.log(err)
             }
         })
     } else {
         alert('出错')
     }
 }
 //会员商城未发货订单
 if (pathname == '/admin/delivergoodsorderlist.html') {
     var mallPrev = document.getElementById('mallPrev');
     var mallNext = document.getElementById('mallNext');
     mallPrev.onclick = function() {
         getCurrentPage6(-1);
     }
     mallNext.onclick = function() {
         getCurrentPage6(1);
     }
     getPage6(currentPage);

 }

 function getCurrentPage6(num) {
     if (currentPage + num <= 1) {
         currentPage = 1;
         getPage6(currentPage)
     } else if (currentPage + num >= page) {
         currentPage = page;
         getPage6(currentPage)
     } else {
         currentPage += num;
         getPage6(currentPage)
     }


 }

 function getPage6(currentpage) {
     $.ajax({
         url: '/admin/get/deliverList',
         type: 'GET',
         data: {
             currentPage: currentpage
         },
         cache: false,
         dataType: 'json',
         success: function(data) {
             page = data.page;
             if ($('tbody>tr').length > 0) {
                 $('tbody>tr').remove();
             }
             if (data.code == 200) {
                 sort(data);
                 data.orderList.forEach((value, index) => {
                     var html = "<tr>" +
                         "<td>" + value.number + "</td>" +
                         "<td>" + value.phoneNumber + "</td>" +
                         "<td>" + value.consigneePhone + "</td>" +
                         "<td>" + value.consignee + "</td>" +
                         "<td>" + value.consigneeAddress + "</td>" +
                         "<td>" + value.mallName + "</td>" +
                         "<td>" + value.inventory + "</td>" +
                         "<td>" + value.time + "</td>" +
                         '<td>' +
                         '<div class="am-btn-toolbar">' +
                         '<div class="am-btn-group am-btn-group-xs">' +
                         '<span class="am-btn am-btn-default am-btn-xs am-text-secondary am-round" title="已发货" onclick="delivergood(' + "'" + value._id + "'" + ')">' + '<span class="am-icon-pencil-square-o"></span></span>' +
                         '<span class="am-btn am-btn-default am-btn-xs am-text-danger am-round" title="删除" onclick="deleteDD(' + "'" + value._id + "'" + ')"><span class="am-icon-trash-o" ></span></span>' +
                         '</div>' +
                         '</div>' +
                         '</td>' +
                         "</tr>";
                     $('tbody').append(html);
                 });
                 var str = '总数：<span style="color:#187794;font-size:20px;">' + data.count + '</span>条，共<span style="color:#dd514c;font-size:20px;">' + data.page + '</span>页，当前第<span style="color: #5eb95e;font-size:20px;">' + data.currentPage + '</span>页';
                 $('.Message').html(str);
             } else {
                 $('.Message').html(data.message);
             }
         },
         err: function(err) {
             console.log(err)
         }
     })
 }
 //发货
 function delivergood(id) {
     if (id) {
         $.ajax({
             url: '/admin/set/delivergoods',
             type: 'POST',
             data: {
                 _id: id
             },
             cache: false,
             dataType: 'json',
             success: function(data) {
                 if (data.code == 200) {
                     getPage6(1)
                 } else {
                     alert(data.message)
                 }
             },
             err: function(err) {
                 console.log(err)
             }
         })
     } else {
         alert('出错')
     }
 }
 //会员商城未通过订单
 if (pathname == '/admin/examineerror.html') {
     var mallPrev = document.getElementById('mallPrev');
     var mallNext = document.getElementById('mallNext');
     mallPrev.onclick = function() {
         getCurrentPage7(-1);
     }
     mallNext.onclick = function() {
         getCurrentPage7(1);
     }
     getPage7(currentPage);

 }

 function getCurrentPage7(num) {
     if (currentPage + num <= 1) {
         currentPage = 1;
         getPage7(currentPage)
     } else if (currentPage + num >= page) {
         currentPage = page;
         getPage7(currentPage)
     } else {
         currentPage += num;
         getPage7(currentPage)
     }


 }

 function getPage7(currentpage) {
     $.ajax({
         url: '/admin/get/orderErrorList',
         type: 'GET',
         data: {
             currentPage: currentpage
         },
         cache: false,
         dataType: 'json',
         success: function(data) {
             page = data.page;
             if ($('tbody>tr').length > 0) {
                 $('tbody>tr').remove();
             }
             if (data.code == 200) {
                 sort(data);
                 data.orderList.forEach((value, index) => {
                     var html = "<tr>" +
                         "<td>" + value.number + "</td>" +
                         "<td>" + value.phoneNumber + "</td>" +
                         "<td>" + value.username + "</td>" +
                         "<td>" + value.isVip + "</td>" +
                         "<td>" + value.mallName + "</td>" +
                         "<td>" + value.inventory + "</td>" +
                         "<td>" + value.time + "</td>" +
                         "<td>" + value.money + "</td>" +
                         '<td>' +
                         '<div class="am-btn-toolbar">' +
                         '<div class="am-btn-group am-btn-group-xs">' +
                         '<span class="am-btn am-btn-default am-btn-xs am-text-danger am-round" title="删除" onclick="deleteDD(' + "'" + value._id + "'" + ')"><span class="am-icon-trash-o" ></span></span>' +
                         '</div>' +
                         '</div>' +
                         '</td>' +
                         "</tr>";
                     $('tbody').append(html);
                 });
                 var str = '总数：<span style="color:#187794;font-size:20px;">' + data.count + '</span>条，共<span style="color:#dd514c;font-size:20px;">' + data.page + '</span>页，当前第<span style="color: #5eb95e;font-size:20px;">' + data.currentPage + '</span>页';
                 $('.Message').html(str);
             } else {
                 $('.Message').html(data.message);
             }
         },
         err: function(err) {
             console.log(err)
         }
     })
 }

 //会员商城成功订单
 if (pathname == '/admin/orderlist.html') {
     var mallPrev = document.getElementById('mallPrev');
     var mallNext = document.getElementById('mallNext');
     mallPrev.onclick = function() {
         getCurrentPage8(-1);
     }
     mallNext.onclick = function() {
         getCurrentPage8(1);
     }
     getPage8(currentPage);

 }

 function getCurrentPage8(num) {
     if (currentPage + num <= 1) {
         currentPage = 1;
         getPage8(currentPage)
     } else if (currentPage + num >= page) {
         currentPage = page;
         getPage8(currentPage)
     } else {
         currentPage += num;
         getPage8(currentPage)
     }


 }

 function getPage8(currentpage) {
     $.ajax({
         url: '/admin/get/orderSuccessList',
         type: 'GET',
         data: {
             currentPage: currentpage
         },
         cache: false,
         dataType: 'json',
         success: function(data) {
             page = data.page;
             if ($('tbody>tr').length > 0) {
                 $('tbody>tr').remove();
             }
             if (data.code == 200) {
                 sort(data);
                 data.orderList.forEach((value, index) => {
                     var html = "<tr>" +
                         "<td>" + value.number + "</td>" +
                         "<td>" + value.phoneNumber + "</td>" +
                         "<td>" + value.username + "</td>" +
                         "<td>" + value.isVip + "</td>" +
                         "<td>" + value.mallName + "</td>" +
                         "<td>" + value.inventory + "</td>" +
                         "<td>" + value.time + "</td>" +
                         "<td>" + value.consigneePhone + "</td>" +
                         "<td>" + value.consignee + "</td>" +
                         "<td>" + value.consigneeAddress + "</td>" +
                         '<td>' +
                         '<div class="am-btn-toolbar">' +
                         '<div class="am-btn-group am-btn-group-xs">' +
                         '<span class="am-btn am-btn-default am-btn-xs am-text-danger am-round" title="删除" onclick="deleteDD(' + "'" + value._id + "'" + ')"><span class="am-icon-trash-o" ></span></span>' +
                         '</div>' +
                         '</div>' +
                         '</td>' +
                         "</tr>";
                     $('tbody').append(html);
                 });
                 var str = '总数：<span style="color:#187794;font-size:20px;">' + data.count + '</span>条，共<span style="color:#dd514c;font-size:20px;">' + data.page + '</span>页，当前第<span style="color: #5eb95e;font-size:20px;">' + data.currentPage + '</span>页';
                 $('.Message').html(str);
             } else {
                 $('.Message').html(data.message);
             }
         },
         err: function(err) {
             console.log(err)
         }
     })
 }

 function deleteDD(id) {
     if (id) {
         $.ajax({
             url: '/admin/delete/order',
             type: 'POST',
             data: {
                 _id: id
             },
             dataType: 'json',
             cache: false,
             success: function(data) {
                 if (data.code == 200) {
                     window.location.reload();
                 } else {
                     alert(data.message)
                 }
             },
             err: function(err) {
                 console.log(err)
             }
         })
     } else {
         alert('出错')
     }
 }

 function sort(data) {
     for (var i = 0; i < data.orderList.length; i++) {
         for (var j = i + 1; j < data.orderList.length; j++) {
             if (parseInt(data.orderList[i].number) > parseInt(data.orderList[j].number)) {
                 var tmp = data.orderList[i];
                 data.orderList[i] = data.orderList[j];
                 data.orderList[j] = tmp;
             }
         }
     }
     return data;
 }

 //积分管理
 if (pathname == '/admin/member_mark.html') {
     currentPage = 1;
     var peoplevip = document.getElementById('peoplevip')
     peoplevip.onclick = function() {
         getPage8()
     }

     function getPage8() {
         var vippeople = document.getElementById('inventory').value;
         var phoneNumber = '';
         if (vippeople) {
             phoneNumber = vippeople
             $.ajax({
                 url: '/admin/get/alluserlist',
                 type: 'POST',
                 data: {
                     phoneNumber: phoneNumber
                 },
                 cache: false,
                 dataType: 'json',
                 success: function(data) {
                     page = data.page;
                     if ($('tbody>tr').length > 0) {
                         $('tbody>tr').remove();
                     }
                     if (data.code == 200) {

                         data.userList.forEach(function(value, index) {
                             var html = '<tr>' +
                                 '<td>' + value.username + '</td>' +
                                 '<td>' + (value.isVip ? '高级会员' : '普通会员') + '</td>' +
                                 '<td class="am-hide-sm-only">' + value.member_mark + '<br>' +
                                 '<span class="subInventory">-</span>' +
                                 '<input type="text" style="display:inline-block;width:70px;" class="am-input-sm value1" id="mark" value="0" readonly>' +
                                 '<span class="addInventory">+</span><br/>' +
                                 '<span  class="userSubmit am-btn am-btn-success am-radius"onclick="setallMark(' + "'" + value._id + "'" + ')">确定</span>' +
                                 '</td>' +
                                 '<td class="am-hide-sm-only">' + value.phoneNumber + '</td>' +
                                 '<td class="am-hide-sm-only">' + value.bankNumber + '</td>' +
                                 '<td class="am-hide-sm-only">' + value.email + '<br/>' +
                                 '</td>' +
                                 '</tr>';
                             $('tbody').append(html);
                         });
                         add8();
                         sub8();
                     } else {
                         $('.Message').html(data.message);
                     }
                 },
                 err: function(err) {
                     console.log(err)
                 }
             })
         } else {
             alert('请输入电话号码')
         }
     }


     function setallMark(id) {
         if (id) {
             var value = parseInt($('#mark')[0].value);
             $.ajax({
                 url: '/admin/set/vipmember_mark',
                 type: 'POST',
                 data: {
                     member_mark: value,
                     _id: id,
                     isstraight: 'all'
                 },
                 cache: false,
                 dataType: 'json',
                 success: function(data) {
                     if (data.code == 200) {
                         getPage8()
                     } else {
                         alert(data.message)
                     }
                 },
                 err: function(err) {
                     console.log(err)
                 }
             })
         } else {
             alert('出错！');
         }
     }

     /**积分- */
     function sub8() {
         var dom = $('.subInventory');
         var value = $('.value1')
         if (dom.length > 0) {
             for (var i = 0; i < dom.length; i++) {
                 (function() {
                     var temp = i; //调用时局部变量
                     dom[i].onclick = function() {
                         var sum = parseInt(value[temp].value);
                         value[temp].value = sum - 1;
                     }
                 })();
             }
         }
     }

     function add8() {
         var dom = $('.addInventory');
         var value = $('.value1')
         if (dom.length > 0) {
             for (var i = 0; i < dom.length; i++) {
                 (function() {
                     var temp = i; //调用时局部变量
                     dom[i].onclick = function() {
                         var sum = parseInt(value[temp].value);
                         value[temp].value = sum + 1;
                     }
                 })();
             }
         }
     }
 }


 //贷款未处理订单
 if (pathname == '/admin/loanNoList.html') {
     currentPage = 1;
     var mallPrev = document.getElementById('mallPrev');
     var mallNext = document.getElementById('mallNext');
     mallPrev.onclick = function() {
         getCurrentPage9(-1);
     }
     mallNext.onclick = function() {
         getCurrentPage9(1);
     }
     getPage9(currentPage);



     function getCurrentPage9(num) {
         if (currentPage + num <= 1) {
             currentPage = 1;
             getPage9(currentPage)
         } else if (currentPage + num >= page) {
             currentPage = page;
             getPage9(currentPage)
         } else {
             currentPage += num;
             getPage9(currentPage)
         }


     }

     function getPage9(currentpage) {
         $.ajax({
             url: '/admin/get/loanNocList',
             type: 'GET',
             data: {
                 currentPage: currentpage
             },
             cache: false,
             dataType: 'json',
             success: function(data) {
                 page = data.page;
                 if ($('tbody>tr').length > 0) {
                     $('tbody>tr').remove();
                 }
                 if (data.code == 200) {
                     sort2(data);
                     data.loanList.forEach((value, index) => {
                         var html = "<tr>" +
                             "<td>" + value.number + "</td>" +
                             "<td>" + value.phoneNumber + "</td>" +
                             "<td>" + value.username + "</td>" +
                             "<td>" + value.isVip + "</td>" +
                             "<td>" + value.name + "</td>" +
                             "<td>" + value.money + "</td>" +
                             "<td>" + value.time + "</td>" +
                             '<td>' +
                             '<div class="am-btn-toolbar">' +
                             '<div class="am-btn-group am-btn-group-xs">' +
                             '<span class="am-btn am-btn-default am-btn-xs am-text-secondary am-round" title="成功" onclick="setSuccess(' + "'" + value._id + "'" + ",'" + value._userId + "'" + ')">' + '<span class="am-icon-pencil-square-o"></span></span>' +
                             '<span class="am-btn am-btn-default am-btn-xs am-text-danger am-round" title="失败" onclick="setFail(' + "'" + value._id + "'" + ')"><span class="am-icon-music" ></span></span>' +
                             '<span class="am-btn am-btn-default am-btn-xs am-text-danger am-round" title="删除" onclick="deleteDK(' + "'" + value._id + "'" + ')"><span class="am-icon-trash-o" ></span></span>' +
                             '</div>' +
                             '</div>' +
                             '</td>' +
                             "</tr>";
                         $('tbody').append(html);
                     });
                     var str = '总数：<span style="color:#187794;font-size:20px;">' + data.count + '</span>条，共<span style="color:#dd514c;font-size:20px;">' + data.page + '</span>页，当前第<span style="color: #5eb95e;font-size:20px;">' + data.currentPage + '</span>页';
                     $('.Message').html(str);
                 } else {
                     $('.Message').html(data.message);
                 }
             },
             err: function(err) {
                 console.log(err)
             }
         })
     }
     //成功
     function setSuccess(id, _userId) {
         if (id) {
             $.ajax({
                 url: '/admin/set/setLoanSuccess',
                 type: 'POST',
                 data: {
                     _id: id
                 },
                 cache: false,
                 dataType: 'json',
                 success: function(data) {
                     console.log(data.code)
                     if (data.code == 200) {
                         setViper(_userId);
                         getPage9(1);
                     } else {
                         alert(data.message)
                     }
                 },
                 err: function(err) {
                     console.log(err)
                 }
             })
         } else {
             alert('出错')
         }
     }
     //审核不通过
     function setFail(id) {
         if (id) {
             $.ajax({
                 url: '/admin/set/setLoanFail',
                 type: 'POST',
                 data: {
                     _id: id
                 },
                 cache: false,
                 dataType: 'json',
                 success: function(data) {
                     if (data.code == 200) {
                         getPage9(1)
                     } else {
                         alert(data.message)
                     }
                 },
                 err: function(err) {
                     console.log(err)
                 }
             })
         } else {
             alert('出错')
         }
     }

     /**
      * 设置高级vip
      */
     function setViper(id) {
         if (id) {
             $.ajax({
                 url: '/admin/set/viper',
                 type: 'POST',
                 data: {
                     _id: id
                 },
                 cache: false,
                 dataType: 'json',
                 success: function(data) {},
                 err: function(err) {
                     console.log(err)
                 }
             })
         } else {
             alert('出错！');
         }
     }
 }
 //贷款成功订单
 if (pathname == '/admin/loansuccesslist.html') {
     currentPage = 1;

     var mallPrev = document.getElementById('mallPrev');
     var mallNext = document.getElementById('mallNext');
     mallPrev.onclick = function() {
         getCurrentPage10(-1);
     }
     mallNext.onclick = function() {
         getCurrentPage10(1);
     }
     getPage10(currentPage);


     function getCurrentPage10(num) {
         if (currentPage + num <= 1) {
             currentPage = 1;
             getPage10(currentPage)
         } else if (currentPage + num >= page) {
             currentPage = page;
             getPage10(currentPage)
         } else {
             currentPage += num;
             getPage10(currentPage)
         }


     }

     function getPage10(currentpage) {
         $.ajax({
             url: '/admin/get/loanSuccessList',
             type: 'GET',
             data: {
                 currentPage: currentpage
             },
             cache: false,
             dataType: 'json',
             success: function(data) {
                 page = data.page;
                 if ($('tbody>tr').length > 0) {
                     $('tbody>tr').remove();
                 }
                 if (data.code == 200) {
                     sort2(data);
                     data.loanList.forEach((value, index) => {
                         var html = "<tr>" +
                             "<td>" + value.number + "</td>" +
                             "<td>" + value.phoneNumber + "</td>" +
                             "<td>" + value.username + "</td>" +
                             "<td>" + value.isVip + "</td>" +
                             "<td>" + value.name + "</td>" +
                             "<td>" + value.money + "</td>" +
                             "<td>" + value.time + "</td>" +
                             '<td class="am-hide-sm-only">' + (value.grant ? '已处理' : '未处理') + '<br>' +
                             '<span class="subInventory">-</span>' +
                             '<input type="text" style="display:inline-block;width:70px;" class="am-input-sm value1" id="mark" value="0" readonly>' +
                             '<span class="addInventory">+</span><br/>' +
                             '<span  class="userSubmit am-btn am-btn-success am-radius"onclick="setDkMark(' + "'" + value._id + "'" + ')">确定</span>' +
                             '</td>' +
                             '<td>' +
                             '<div class="am-btn-toolbar">' +
                             '<div class="am-btn-group am-btn-group-xs">' +
                             '<span class="am-btn am-btn-default am-btn-xs am-text-danger am-round" title="删除" onclick="deleteDK(' + "'" + value._id + "'" + ')"><span class="am-icon-trash-o" ></span></span>' +
                             '</div>' +
                             '</div>' +
                             '</td>' +
                             "</tr>";
                         $('tbody').append(html);
                     });
                     add9();
                     sub9();
                     var str = '总数：<span style="color:#187794;font-size:20px;">' + data.count + '</span>条，共<span style="color:#dd514c;font-size:20px;">' + data.page + '</span>页，当前第<span style="color: #5eb95e;font-size:20px;">' + data.currentPage + '</span>页';
                     $('.Message').html(str);
                 } else {
                     $('.Message').html(data.message);
                 }
             },
             err: function(err) {
                 console.log(err)
             }
         })
     }


     function setDkMark(id) {
         if (id && parseInt($('#mark')[0].value) > 0) {
             var value = parseInt($('#mark')[0].value);
             $.ajax({
                 url: '/admin/set/DKmember_mark',
                 type: 'POST',
                 data: {
                     member_mark: value,
                     _id: id
                 },
                 cache: false,
                 dataType: 'json',
                 success: function(data) {
                     if (data.code == 200) {
                         getPage10(currentPage)

                     } else {
                         alert(data.message)
                     }
                 },
                 err: function(err) {
                     console.log(err)
                 }
             })
         } else {
             alert('出错！');
         }
     }

     /**积分- */
     function sub9() {
         var dom = $('.subInventory');
         var value = $('.value1')
         if (dom.length > 0) {
             for (var i = 0; i < dom.length; i++) {
                 (function() {
                     var temp = i; //调用时局部变量
                     dom[i].onclick = function() {
                         var sum = parseInt(value[temp].value);
                         if (sum - 1 <= 0) {
                             value[temp].value = 0;
                         } else {
                             value[temp].value = sum - 1;
                         }
                     }
                 })();
             }
         }
     }

     function add9() {
         var dom = $('.addInventory');
         var value = $('.value1')
         if (dom.length > 0) {
             for (var i = 0; i < dom.length; i++) {
                 (function() {
                     var temp = i; //调用时局部变量
                     dom[i].onclick = function() {
                         var sum = parseInt(value[temp].value);
                         value[temp].value = sum + 1;
                     }
                 })();
             }
         }
     }

 }
 //贷款失败订单
 if (pathname == '/admin/loanfaillist.html') {
     currentPage = 1;
     var mallPrev = document.getElementById('mallPrev');
     var mallNext = document.getElementById('mallNext');
     mallPrev.onclick = function() {
         getCurrentPage11(-1);
     }
     mallNext.onclick = function() {
         getCurrentPage11(1);
     }
     getPage11(currentPage);



     function getCurrentPage11(num) {
         if (currentPage + num <= 1) {
             currentPage = 1;
             getPage11(currentPage)
         } else if (currentPage + num >= page) {
             currentPage = page;
             getPage11(currentPage)
         } else {
             currentPage += num;
             getPage11(currentPage)
         }


     }

     function getPage11(currentpage) {
         $.ajax({
             url: '/admin/get/loanFailList',
             type: 'GET',
             data: {
                 currentPage: currentpage
             },
             cache: false,
             dataType: 'json',
             success: function(data) {
                 page = data.page;
                 if ($('tbody>tr').length > 0) {
                     $('tbody>tr').remove();
                 }
                 if (data.code == 200) {
                     sort2(data);
                     data.loanList.forEach((value, index) => {
                         var html = "<tr>" +
                             "<td>" + value.number + "</td>" +
                             "<td>" + value.phoneNumber + "</td>" +
                             "<td>" + value.username + "</td>" +
                             "<td>" + value.isVip + "</td>" +
                             "<td>" + value.name + "</td>" +
                             "<td>" + value.money + "</td>" +
                             "<td>" + value.time + "</td>" +
                             '<td>' +
                             '<div class="am-btn-toolbar">' +
                             '<span class="am-btn am-btn-default am-btn-xs am-text-danger am-round" title="删除" onclick="deleteDK(' + "'" + value._id + "'" + ')"><span class="am-icon-trash-o" ></span></span>' +
                             '</div>' +
                             '</div>' +
                             '</td>' +
                             "</tr>";
                         $('tbody').append(html);
                     });
                     var str = '总数：<span style="color:#187794;font-size:20px;">' + data.count + '</span>条，共<span style="color:#dd514c;font-size:20px;">' + data.page + '</span>页，当前第<span style="color: #5eb95e;font-size:20px;">' + data.currentPage + '</span>页';
                     $('.Message').html(str);
                 } else {
                     $('.Message').html(data.message);
                 }
             },
             err: function(err) {
                 console.log(err)
             }
         })
     }
 }

 function sort2(data) {
     for (var i = 0; i < data.loanList.length; i++) {
         for (var j = i + 1; j < data.loanList.length; j++) {
             if (parseInt(data.loanList[i].number) > parseInt(data.loanList[j].number)) {
                 var tmp = data.loanList[i];
                 data.loanList[i] = data.loanList[j];
                 data.loanList[j] = tmp;
             }
         }
     }
     return data;
 }

 function deleteDK(id) {
     if (id) {
         $.ajax({
             url: '/admin/delete/loanitem',
             type: 'POST',
             data: {
                 _id: id
             },
             dataType: 'json',
             cache: false,
             success: function(data) {
                 if (data.code == 200) {
                     window.location.reload();
                 } else {
                     alert(data.message)
                 }
             },
             err: function(err) {
                 console.log(err)
             }
         })
     } else {
         alert('出错')
     }
 }

 //提现未处理订单
 if (pathname == '/admin/withdrawalsNo.html') {
     currentPage = 1;
     var mallPrev = document.getElementById('mallPrev');
     var mallNext = document.getElementById('mallNext');
     mallPrev.onclick = function() {
         getCurrentPage12(-1);
     }
     mallNext.onclick = function() {
         getCurrentPage12(1);
     }
     getPage12(currentPage);



     function getCurrentPage12(num) {
         if (currentPage + num <= 1) {
             currentPage = 1;
             getPage12(currentPage)
         } else if (currentPage + num >= page) {
             currentPage = page;
             getPage12(currentPage)
         } else {
             currentPage += num;
             getPage12(currentPage)
         }


     }

     function getPage12(currentpage) {
         $.ajax({
             url: '/admin/get/withdrawalsNo',
             type: 'GET',
             data: {
                 currentPage: currentpage
             },
             cache: false,
             dataType: 'json',
             success: function(data) {
                 page = data.page;
                 if ($('tbody>tr').length > 0) {
                     $('tbody>tr').remove();
                 }
                 if (data.code == 200) {
                     sort3(data);
                     data.withdrawalsList.forEach((value, index) => {
                         var html = "<tr>" +
                             "<td>" + value.number + "</td>" +
                             "<td>" + value.phoneNumber + "</td>" +
                             "<td>" + value.username + "</td>" +
                             "<td>" + value.bankNumber + "</td>" +
                             "<td>" + value.isVip + "</td>" +
                             "<td>" + value.money + "</td>" +
                             "<td>" + value.time + "</td>" +
                             '<td>' +
                             '<div class="am-btn-toolbar">' +
                             '<div class="am-btn-group am-btn-group-xs">' +
                             '<span class="am-btn am-btn-default am-btn-xs am-text-secondary am-round" title="成功" onclick="setItemSuccess(' + "'" + value._id + "'" + ')">' + '<span class="am-icon-pencil-square-o"></span></span>' +
                             '</div>' +
                             '</div>' +
                             '</td>' +
                             "</tr>";
                         $('tbody').append(html);
                     });
                     var str = '总数：<span style="color:#187794;font-size:20px;">' + data.count + '</span>条，共<span style="color:#dd514c;font-size:20px;">' + data.page + '</span>页，当前第<span style="color: #5eb95e;font-size:20px;">' + data.currentPage + '</span>页';
                     $('.Message').html(str);
                 } else {
                     $('.Message').html(data.message);
                 }
             },
             err: function(err) {
                 console.log(err)
             }
         })
     }
     //成功
     function setItemSuccess(id, _userId) {
         if (id) {
             $.ajax({
                 url: '/admin/set/withdrawalsSu',
                 type: 'POST',
                 data: {
                     _id: id
                 },
                 cache: false,
                 dataType: 'json',
                 success: function(data) {
                     console.log(data.code)
                     if (data.code == 200) {
                         window.location.reload();
                     } else {
                         alert(data.message)
                     }
                 },
                 err: function(err) {
                     console.log(err)
                 }
             })
         } else {
             alert('出错')
         }
     }

 }

 //提现成功
 if (pathname == '/admin/withdrawalsSu.html') {
     currentPage = 1;
     var mallPrev = document.getElementById('mallPrev');
     var mallNext = document.getElementById('mallNext');
     mallPrev.onclick = function() {
         getCurrentPage13(-1);
     }
     mallNext.onclick = function() {
         getCurrentPage13(1);
     }
     getPage13(currentPage);



     function getCurrentPage13(num) {
         if (currentPage + num <= 1) {
             currentPage = 1;
             getPage13(currentPage)
         } else if (currentPage + num >= page) {
             currentPage = page;
             getPage13(currentPage)
         } else {
             currentPage += num;
             getPage13(currentPage)
         }


     }

     function getPage13(currentpage) {
         $.ajax({
             url: '/admin/get/withdrawalsSu',
             type: 'GET',
             data: {
                 currentPage: currentpage
             },
             cache: false,
             dataType: 'json',
             success: function(data) {
                 page = data.page;
                 if ($('tbody>tr').length > 0) {
                     $('tbody>tr').remove();
                 }
                 if (data.code == 200) {
                     sort3(data);
                     data.withdrawalsList.forEach((value, index) => {
                         var html = "<tr>" +
                             "<td>" + value.number + "</td>" +
                             "<td>" + value.phoneNumber + "</td>" +
                             "<td>" + value.username + "</td>" +
                             "<td>" + value.bankNumber + "</td>" +
                             "<td>" + value.isVip + "</td>" +
                             "<td>" + value.money + "</td>" +
                             "<td>" + value.time + "</td>" +
                             "</tr>";
                         $('tbody').append(html);
                     });
                     var str = '总数：<span style="color:#187794;font-size:20px;">' + data.count + '</span>条，共<span style="color:#dd514c;font-size:20px;">' + data.page + '</span>页，当前第<span style="color: #5eb95e;font-size:20px;">' + data.currentPage + '</span>页';
                     $('.Message').html(str);
                 } else {
                     $('.Message').html(data.message);
                 }
             },
             err: function(err) {
                 console.log(err)
             }
         })
     }

 }

 function sort3(data) {
     for (var i = 0; i < data.withdrawalsList.length; i++) {
         for (var j = i + 1; j < data.withdrawalsList.length; j++) {
             if (parseInt(data.withdrawalsList[i].number) > parseInt(data.withdrawalsList[j].number)) {
                 var tmp = data.withdrawalsList[i];
                 data.withdrawalsList[i] = data.withdrawalsList[j];
                 data.withdrawalsList[j] = tmp;
             }
         }
     }
     return data;
 }