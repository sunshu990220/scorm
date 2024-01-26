/**
 * 判断终端
 * */


function IsPC(){
	var userAgentInfo = navigator.userAgent;  
	var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
	var flag = true;  
	for (var v = 0; v < Agents.length; v++) {  
		if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
	}
	return flag;
}


function IsAndroid(){
	var userAgentInfo = navigator.userAgent;
	var flag = false; 
	if (userAgentInfo.indexOf("Android") > 0) { 
		flag = true;
	}
	return flag;
}



var start = IsPC() ? "mousedown" : "touchstart";

var move = IsPC() ? "mousemove" : "touchmove";

var end = IsPC() ? "mouseup" : "touchend";

