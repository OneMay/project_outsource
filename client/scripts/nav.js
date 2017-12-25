$(function () {
  // 导航栏的二级菜单
  var timeId = null
  $('.nav>li').hover(function () {
    var _this = $(this)
    timeId = setTimeout(function () {
      _this.children('.subMenu').stop(true, true).slideDown()
    }, 100)
  }, function () {
    clearTimeout(timeId)
    $(this).children('.subMenu').stop(true, true).slideUp(0)
  })
  

})
