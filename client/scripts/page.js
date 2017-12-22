 var sPageName="";
 var sPageExt="";
 var PageCount="";
 function createPageHTML(_nPageCount, _nCurrIndex, _sPageName, _sPageExt,_rCount){
 	sCount=_rCount;
 	sPageName=_sPageName;
 	sPageExt=_sPageExt;
 	nPageCount=_nPageCount;
  if(_nPageCount == null || _nPageCount<=1){
    return;
  }

  document.write("<span>共 "+sCount+" 条</span>");

  var nCurrIndex = _nCurrIndex || 0;
  // 1 输出首页和上一页
  // 1.1 当前页是首页
  if(nCurrIndex == 0){
    //document.write("<a href=\""+_sPageName+"."+_sPageExt+"\">首页</a>");
    document.write("<a class=\"up\" href=\"javascript:void(0)\">上一页</a>");
    document.write("<a class=\"onhover\" href=\"javascript:void(0)\">1</a>");
  }
  //1.2 当前页不是首页
  else{
    var nPreIndex = nCurrIndex - 1;
    var sPreFileExt = nPreIndex == 0 ? "" : ("_" + nPreIndex);

    //document.write("<a href=\""+_sPageName+"."+_sPageExt+"\">首页</a>");
    document.write("<a class=\"up\" href=\"" + _sPageName + sPreFileExt + "."+_sPageExt+"\">上一页</a>");
    document.write("<a href=\""+_sPageName+"."+_sPageExt+"\">1</a>");
  }

  // 2 输出中间分页
  var flag1=true;
  var flag2=true;

  for(var i=1; i<_nPageCount; i++){

    if(i-nCurrIndex<3&&nCurrIndex-i<3||i<2||_nPageCount-i<3){
      if(nCurrIndex == i)
        document.write("<a class=\"onhover\" href=\"javascript:void(0)\">"+(i+1)+"</a>");
      else
        document.write("<a href=\""+_sPageName+"_" + i + "."+_sPageExt+"\">"+(i+1)+"</a>");
    }
    else if(i-nCurrIndex>3&&flag1){
      flag1=false;
      document.write("<a href=\"javascript:void(0)\">...</a>");
    }
    else if(nCurrIndex-i>3&&flag2){
      flag2=false;
      document.write("<a href=\"javascript:void(0)\">...</a>");
    }
  }
  //分页跳转
  // 3 输出下一页和尾页
  // 3.1 当前页是尾页
  if(nCurrIndex == (_nPageCount-1)){
    document.write("<a  class=\"up\" href=\"javascript:void(0)\">下一页</a>&nbsp;");
    //document.write("<li><a href=\""+_sPageName+"_" + (_nPageCount-1) + "."+_sPageExt+"\">尾页</a></li>");
  }
  // 3.2 当前页不是尾页
  else{
    var nNextIndex = nCurrIndex + 1;
    var sPreFileExt = nPreIndex == 0 ? "" : ("_" + nPreIndex);
    document.write("<a  class=\"up\" href=\""+_sPageName+"_" + nNextIndex + "."+_sPageExt+"\">下一页</a>&nbsp;");
    //document.write("<li><a href=\""+_sPageName+"_" + (_nPageCount-1) + "."+_sPageExt+"\">尾页</a></li>");
  }
   document.write("<font class=\"bai12_22h\">转到第<input type=\"text\" id=\"num\" value=\""+(nCurrIndex+1)+"\" style=\"width:30px;font-size:12px;\">页"+"&nbsp;<input style=\"font-size:12px\" type=\"submit\" value=\"GO\" onClick=\"javascript:toPage()\"></font>");
}
function toPage(){
var _num = document.getElementById("num").value;
if(isNaN(_num)){
alert("请输入数字");
return false;
}
var str = sPageName+"_"+(_num-1)+"."+sPageExt;
var url = location.href.substring(0,location.href.lastIndexOf("/")+1);
if(_num<=1||_num==null)
location.href = url+sPageName+"."+sPageExt;
else if(_num>nPageCount)
alert("本频道最多"+nPageCount+"页");
else
location.href = url+str;
}