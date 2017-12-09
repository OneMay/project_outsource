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
                         "<td>" + value.productInventory + "</td>" +
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


 /**
  * 获取普通vip列表
  */
 if (pathname == '/admin/member.html') {
     var mallPrev = document.getElementById('mallPrev');
     var mallNext = document.getElementById('mallNext');
     mallPrev.onclick = function() {
         getCurrentPage2(-1);
     }
     mallNext.onclick = function() {
         getCurrentPage2(1);
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
     $.ajax({
         url: '/admin/get/userlist',
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
 //获取高级vip列表
 if (pathname == '/admin/membervip.html') {
     var mallPrev = document.getElementById('mallPrev');
     var mallNext = document.getElementById('mallNext');
     mallPrev.onclick = function() {
         getCurrentPage3(-1);
     }
     mallNext.onclick = function() {
         getCurrentPage3(1);
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
     $.ajax({
         url: '/admin/get/userViplist',
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
                 number_people = data.number_people;
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