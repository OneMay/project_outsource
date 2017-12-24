$(function() {
    // 导航栏的二级菜单
    var timeId = null
    $('.nav>li').hover(function() {
        var _this = $(this)
        timeId = setTimeout(function() {
            _this.children('.subMenu').stop(true, true).slideDown()
        }, 100)
    }, function() {
        clearTimeout(timeId)
        $(this).children('.subMenu').stop(true, true).slideUp(0)
    })

    var pathname = window.location.pathname;
    var currentPage = 1;
    var page;
    // var number_people;
    if (pathname == '/vipinfo.html') {
        var mallPrev = document.getElementById('mallPrev');
        var mallNext = document.getElementById('mallNext');
        // alert("23");
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
            url: "/api/get/membersDemeanorList",
            type: "get",
            dataType: "json",
            data: {
                currentPage: currentpage
            },
            success: function(membersDemeanorList) {
                page = membersDemeanorList.page;
                if ($("#content-right").find("ul")[0].children.length > 0) {
                    $("#content-right").find("li").remove();
                }
                for (var i = 0; i < membersDemeanorList.membersDemeanorList.length; i++) {
                    var li = "<li>" + "<em></em><span>" + membersDemeanorList.membersDemeanorList[i].time.substr(0, 10) + "</span>" +
                        "<a href='vip.html?_id=" + membersDemeanorList.membersDemeanorList[i]._id + " 'target='_blank'>" +
                        membersDemeanorList.membersDemeanorList[i].title + "</a>" +
                        "</li>"
                    $("#content-right").find("ul").append(li);
                }

            }

        })
    }
    // $.ajax({
    //         url: "http://localhost:9090/api/get/membersDemeanorList",
    //         type: "get",
    //         dataType: "json",
    //         data: {
    //             currentPage: 1
    //         },
    //         success: function(membersDemeanorList) {
    //             // page = data.page;
    //             console.log(membersDemeanorList.membersDemeanorList)
    //             var length = membersDemeanorList.membersDemeanorList.length;
    //             for (var i = 0; i < 6; i++) {
    //                 var li = " <li>" + "<em></em> <span>" + membersDemeanorList.membersDemeanorList[i].time.substr(0, 10) + "</span>" +
    //                     "<a href='vip.html?_id=" + membersDemeanorList.membersDemeanorList[i]._id + " 'target='_blank'>" +
    //                     membersDemeanorList.membersDemeanorList[i].title + "</a>" +
    //                     "</li>"
    //                 $("#content-right").find("ul").append(li);
    //             }

    //             //如果是一个数组表示数据 limit<=6

    //         }

    //     })
    // }


    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) {
            return unescape(r[2]);
        };
        return null; //返回参数值
    }
    var id = getUrlParam('_id');
    $.ajax({
        url: "http://localhost:9090/api/get/membersDemeanorItem",
        type: "post",
        dataType: "json",
        data: { _id: id },
        success: function(membersDemeanorList) {
            // console.log(membersDemeanorList);
            // 需要把单个文章获取出来写到页面上
            // var temp = $(this).text().replace(/\n|\r\n/g, '<br/>');
            // $(this).html(temp);
            console.log(membersDemeanorList.membersDemeanorList);
            $('.content-vip').html(membersDemeanorList.membersDemeanorList.content.replace(/\n|\r\n/g, '<br/>').replace(/\s/g, "&nbsp;"));
            $('.content-vip h3').html(membersDemeanorList.membersDemeanorList.title);
            $('.content-vip').append("<img src=" + membersDemeanorList.membersDemeanorList.membersDemeanoPhoto + ">")

        }

    })


})