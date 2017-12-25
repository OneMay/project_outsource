$(function() {
    var pathname = window.location.pathname
    var currentPage = 1
    var page
    if (pathname == '/vipinfo.html') {
        var mallPrev = $('#mallPrev')
        var mallNext = $('#mallNext')
        mallPrev.click(function() {
            getCurrentPage(-1)
        })
        mallNext.click(function() {
            getCurrentPage(1)
        })
        getPage(currentPage)
    }

    function getCurrentPage(num) {
        if (currentPage + num <= 1) {
            currentPage = 1
            getPage(currentPage)
        } else if (currentPage + num >= page) {
            currentPage = page
            getPage(currentPage)
        } else {
            currentPage += num
            getPage(currentPage)
        }
    }

    function getPage(currentPage) {
        $.ajax({
            url: 'http://localhost:9090/api/get/membersDemeanorList',
            type: 'get',
            dataType: 'json',
            data: {
                currentPage: currentPage
            },
            success: function(membersDemeanorList) {
                page = membersDemeanorList.page
                if ($('#content-right').find('ul')[0].children.length > 0) {
                    $('#content-right').find('li').remove()
                }
                for (var i = 0; i < membersDemeanorList.membersDemeanorList.length; i++) {
                    var li = '<li>' + '<em></em><span>' + membersDemeanorList.membersDemeanorList[i].time.substr(0, 10) + '</span>' +
                        "<a href='vip.html?_id=" + membersDemeanorList.membersDemeanorList[i]._id + " 'target='_blank'>" +
                        membersDemeanorList.membersDemeanorList[i].title + '</a>' +
                        '</li>'
                    $('#content-right').find('ul').append(li)
                }
            },
            error: function() {}

        })
    }

    function getUrlParam(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'); // 构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); // 匹配目标参数
        if (r != null) {
            return unescape(r[2])
        }
        return null; // 返回参数值
    }
    var id = getUrlParam('_id')
    $.ajax({
        url: 'http://localhost:9090/api/get/membersDemeanorItem',
        type: 'post',
        dataType: 'json',
        data: { _id: id },
        success: function(membersDemeanorList) {
            // console.log(membersDemeanorList)
            // 需要把单个文章获取出来写到页面上
            // var temp = $(this).text().replace(/\n|\r\n/g, '<br/>')
            // $(this).html(temp)
            console.log(membersDemeanorList.membersDemeanorList)
            $('.content-vip').html(membersDemeanorList.membersDemeanorList.content.replace(/\n|\r\n/g, '<br/>').replace(/\s/g, '&nbsp;'))
            $('.content-vip h3').html(membersDemeanorList.membersDemeanorList.title)
            $('.content-vip').append('<img src=' + membersDemeanorList.membersDemeanorList.membersDemeanoPhoto + '>')
        }

    })
})