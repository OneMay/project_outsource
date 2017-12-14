$(function() {
    // 轮播图
    var banner = $('#banner')
    var items = $('#banner .items')
    var buttons = $('.button span')
    var index = 1
    var timer

    function showbutton() {
        // 把所有的都不亮起；
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].className == 'current') {
                buttons[i].className = ''
                break
            }
        }
        buttons[index - 1].className = 'current'; // 固定的那一个亮起，即index-1亮起；
    }

    // 无限滚动
    function animates(offset) {
        var oldleft = items.position().left
        var newleft = oldleft + offset
        oldleft = newleft
        items[0].style.left = oldleft + 'px'
        if (oldleft < -5396) {
            items[0].style.left = 0 + 'px'
            index = 1
        }
    }

    function forward() {
        if (index == 5) {
            index = 1
        } else {
            index++
        }
        showbutton()
        animates(-1349)

    }

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function() {
            if (this.className == 'current') {
                return
            }
            var myindex = parseInt(this.getAttribute('index'))
            var offset = -1349 * (myindex - index)
            animates(offset)
            index = myindex
            showbutton()
        }
    }
    timer = setInterval(forward, 3000)
        // console.log(banner);
    banner.onmouseover = function() {
        clearInterval(timer)
    }
    banner.onmouseout = function() {
        timer = setInterval(forward, 3000)
    }
})