var _Debug = false;

var _NoError = 0;

var _ServerBusy = 102;

var _InvalidArgumentError = 201;

var _ElementCannotHaveChildren = 202;

var _ElementIsNotAnArray = 203;

var _NotInitialized = 301;

var _NotImplementedError = 401;

var _InvalidSetValue = 402;

var _ElementIsReadOnly = 403;

var _ElementIsWriteOnly = 404;

var _IncorrectDataType = 405;

var apiHandle = null;

var API = null;

var exitPageStatus;

var numTry = 0;

var isrenchuan = 0;

var startDate;

var lessonProgress = 0;

var dataStatus = "";





//alert("-------------SCORM--------------------001");





function runSeekStr(str, from, to) {
	//alert("--------------------SCORM------------002");
	var mystr = str;
	var str = str.toLowerCase();
	var from = from.toLowerCase();
	var to = to.toLowerCase();
	if (!(str.indexOf(from)+1)){
		return "";
	}
	var fromhere = str.indexOf(from)+from.length;
	var tostr = str.substr(fromhere, str.length-fromhere);
	mystr = mystr.substr(fromhere, str.length-fromhere);
	var tothere = tostr.length;
	if (to != "" && (tostr.indexOf(to)+1)) {
		tothere = tostr.indexOf(to);
	}
	return mystr.substr(0, tothere);
}





function runFind(url) {
	//alert("--------------------SCORM------------003");
	try{
		isrenchuan = runSeekStr(url, "isrenchuan=", "&");
		if (isrenchuan.length) {
			return true;
		}
		else {
			return false;
		}
	}
	catch(e){
		return false;
		//alert("读取参数时发生错误：\n\n" + e);
	}
}





function runURL(win) {
	//alert("--------------------SCORM------------004");
	try{
		if (runFind(win.document.location+"")) {
			return true;
		}
		else{
			numTry++;
			if (numTry>1) {
				return false;
			}
			if (win.opener != null) {
				if (win == window.top) {
					return (runURL(win.opener));
				}
			}
			return (runURL(win.parent));
		}
	}
	catch(e){
		//alert("读取参数时发生错误：\n\n" + e);
		return false;
	}
}
runURL(window);





function doLMSInitialize(){
	//alert("Lms init");
	//alert("--------------------SCORM------------005");
	var api = getAPIHandle();
	if (api == null){
		return "false";
	}
	var result = api.LMSInitialize("");
	if (result.toString() != "true"){
		var err = ErrorHandler();
	}
	doLMSSetValue("cmi.core.score.raw", 0+"")
	return result.toString();
}





function doLMSFinish(){
	//alert("--------------------SCORM------------006");
	var api = getAPIHandle();
	if (api == null){
		return "false";
	}
	else{
		var result = api.LMSFinish("");
		if (result.toString() != "true"){
			var err = ErrorHandler();
		}
	}
	return result.toString();
}





function doLMSCommit(){
	//alert("Lms commit'");
	//alert("--------------------SCORM------------007");
	var api = getAPIHandle();
	if (api == null){
		return "false";
	}
	else{
		var result = api.LMSCommit("");
		if (result != "true"){
			var err = ErrorHandler();
		}
	}
	return result.toString();
}





function doLMSGetValue(name){
	//console.log("Lms read data '" + name +"'");
	//alert("--------------------SCORM------------008");
	//alert(name);
	var api = getAPIHandle();
	if (api == null){
		return "";
	}
	else{
		var value = api.LMSGetValue(name);
		var errCode = api.LMSGetLastError().toString();
		if (errCode != _NoError){
			var errDescription = api.LMSGetErrorString(errCode);
			return "";
		}
		else{
			if(parseInt(isrenchuan)){
				//alert("doLMSGetValue: "+name+" = "+value.toString());
			}
			return value;
		}
	}
}





function doLMSSetValue(name, value){
	//console.log("Lms write data '" + name +"' = " + value);
	//alert("--------------------SCORM------------009");
	//alert(name+":" +value);
	if(parseInt(isrenchuan)){
		//alert("doLMSSetValue: "+name+" = "+value);
	}
	var api = getAPIHandle();
	if (api == null){
		return;
	}
	else {
		var result = api.LMSSetValue(name, value);
		if (result.toString() != "true"){
			var err = ErrorHandler();
		}
	}
	if(name == "cmi.core.lesson_status"){
		computeTime();
		doLMSCommit();
		if( value == "completed" ){
			//doLMSFinish();
		}
	}
	return;
}





function doLMSGetLastError(){
	//alert("--------------------SCORM------------010");
	var api = getAPIHandle();
	if (api == null){
		return _GeneralError;
	}
	return api.LMSGetLastError().toString();
}





function doLMSGetErrorString(errorCode){
	//alert("--------------------SCORM------------011");
	var api = getAPIHandle();
	if (api == null){
		return "false";
	}
	return api.LMSGetErrorString(errorCode).toString();
}





function doLMSGetDiagnostic(errorCode){
	//alert("--------------------SCORM------------012");
	var api = getAPIHandle();
	if (api == null){
		return "false";
	}
	return api.LMSGetDiagnostic(errorCode).toString();
}





function LMSIsInitialized(){
	//alert("--------------------SCORM------------013");
	var api = getAPIHandle();
	if (api == null){
		return "false";
	}
	else{
		var value = api.LMSGetValue("cmi.core.student_name");
		var errCode = api.LMSGetLastError().toString();
		if (errCode == _NotInitialized){
			return false;
		}
		else{
			return true;
		}
	}
}





function ErrorHandler(){
	//alert("--------------------SCORM------------014");
	var api = getAPIHandle();
	if (api == null){
		return "false";
	}
	var errCode = api.LMSGetLastError().toString();
	if (errCode != _NoError){
		var errDescription = api.LMSGetErrorString(errCode);
		if (_Debug == true){
			errDescription += "\n";
			errDescription += api.LMSGetDiagnostic(null);
		}
	}
	return errCode;
}





function getAPIHandle(){
	//alert("--------------------SCORM------------015");
	if (apiHandle == null){
		var tries = 0;
		var win = window;
		while ((win.API == null)){
			tries++;
			if (tries < 50){
				if((win.parent != null) && (win.parent != win)){
					win = win.parent;
				}
				else if ((win.opener != null) && (typeof(win.opener) != "undefined")){
					win = win.opener;
				}
				else{
					break;
				}
			}
			else{
				break;
			}
		}
		apiHandle = win.API;
	}
	return apiHandle;
}





function doSetSCOID(id){
	//alert("--------------------SCORM------------016");
	var api = getAPIHandle();
	if (api == null){
		return "false";
	}
	doTurnoff();
	api.setSCOID(id);
	doTurnon();
}





function doTurnon(){
	//console.log("doTurnon");
	//alert("--------------------SCORM------------017");
	startTimer();
	var result = doLMSInitialize();
	var status = doLMSGetValue( "cmi.core.lesson_status" );
	if (status == "not attempted"){
		doLMSSetValue( "cmi.core.lesson_status", "incomplete" );
	}
	//var mySCOstatusStr = doLMSGetValue("cmi.suspend_data");
	//var location = doLMSGetValue( "cmi.suspend_data" );
	//alert("mySCOstatusStr:" +mySCOstatusStr);
	//findSWF("main").SetVariable("jsCore",location);
	//findSWF("study").SetVariable("jsCore",mySCOstatusStr);
	exitPageStatus = false;
	if(parseInt(isrenchuan)){
		//alert("jsCore = "+location);
	}
}





function startTimer(){
	//console.log("startTimer");
	//alert("--------------------SCORM------------018");
	startDate = new Date().getTime();
}





function computeTime(){
	//alert("--------------------SCORM------------019");
	if ( startDate != 0  &&  startDate != undefined ){
		var currentDate = new Date().getTime();
		var elapsedSeconds = ( (currentDate - startDate) / 1000 );
		var formattedTime = convertTotalSeconds( elapsedSeconds );
	}
	else{
		formattedTime = "00:00:00.0";
	}
	doLMSSetValue( "cmi.core.session_time", formattedTime );
}





function doBack(){
	//alert("--------------------SCORM------------020");
	computeTime();
	exitPageStatus = true;
	var result;
	//result = doLMSCommit();
	//result = doLMSFinish();
}





function doContinue( status ){
	//alert("--------------------SCORM------------021");
	// doLMSSetValue( "cmi.core.exit", "" );
	var mode = doLMSGetValue( "cmi.core.lesson_mode" );
	if ( mode != "review"  &&  mode != "browse" ){
		doLMSSetValue( "cmi.core.lesson_status", status );
	}
	exitPageStatus = true;
	var result;
	//result = doLMSCommit();
	//result = doLMSFinish();
}





function doQuit(){
	//alert("--------------------SCORM------------022");
	doLMSSetValue( "cmi.core.exit", "suspend" );
	computeTime();
	exitPageStatus = true;
	var result;
	//result = doLMSCommit();
	//result = doLMSFinish();
}





function unloadPage(){
	//alert("--------------------SCORM------------023");
	//alert("lessonProgress" + lessonProgress)
	if( lessonProgress >= 100 ){
		scoFinished()
	}
	if (exitPageStatus != true){
		//doQuit();
	}
}





function doTurnok(){
	//alert("--------------------SCORM------------024");
	var mode = doLMSGetValue( "cmi.core.lesson_mode" );
	if ( mode != "review"  &&  mode != "browse" ){
		doLMSSetValue( "cmi.core.lesson_status", "completed" );
	}
	exitPageStatus = true;
	doLMSSetValue( "cmi.core.exit", "" );
	//doLMSCommit();
	//doLMSFinish();
}





function doTurnoff(){
	//alert("--------------------SCORM------------025");
	if (exitPageStatus != true){
		exitPageStatus = true;
		computeTime();
		doLMSSetValue( "cmi.core.exit", "" );
		doLMSCommit();
		doLMSFinish();
	}
}





function getMYSCOstatus(len){
	//alert("--------------------SCORM------------026");
	var mySCOstatusStr = doLMSGetValue("cmi.suspend_data");
	//alert("mySCOstatusStr:"+mySCOstatusStr);
	var arrmySCO = mySCOstatusStr.split("|");
	//alert("arrmySCO.length:"+arrmySCO.length);
	//alert("len:"+len);
	if(arrmySCO.length > len){
		scoFinished();
	}
}





function scoFinished(){
	//alert("--------------------SCORM------------027");
	//alert("本章学习完毕，请点击章节目录继续学习！");
	doContinue('completed');
}





function SWFSetValue(type, val){
	//alert("--------------------SCORM------------028");
	//alert("type:" + type);
	//alert("val:" + val);
	if( type == "cmi.core.lesson_progress"){
		lessonProgress = val
		//alert("lessonProgress:" + lessonProgress)
	}
	if( type == "cmi.suspend_data" ){
		dataStatus = val
		//alert("dataStatus:" + dataStatus)
	}
	var error = doLMSSetValue(type, val);
	document.study.SCOReturnValue("ERROR", error);
	doLMSCommit()
}





function saveScos(i){
	//alert("--------------------SCORM------------029");
	//alert("提交分数"+i+"分!");
	doLMSSetValue("cmi.core.score.raw", i+"")
}





if (window.attachEvent) {
	//alert("--------------------SCORM------------030");
	window.attachEvent('onunload',function(){
		doTurnoff();
	});
}
else if (window.addEventListener) {
	//alert("--------------------SCORM------------031");
	window.addEventListener('onunload',function(){
		doTurnoff();
	});
}





function convertTotalSeconds(ts){
	//alert("--------------------SCORM------------032");
	var sec = (ts % 60);
	ts -= sec;
	var tmp = (ts % 3600);
	ts -= tmp;
	sec = Math.round(sec*100)/100;
	var strSec = new String(sec);
	var strWholeSec = strSec;
	var strFractionSec = "";
	if (strSec.indexOf(".") != -1){
		strWholeSec =  strSec.substring(0, strSec.indexOf("."));
		strFractionSec = strSec.substring(strSec.indexOf(".")+1, strSec.length);
	}
	if (strWholeSec.length < 2){
		strWholeSec = "0" + strWholeSec;
	}
	strSec = strWholeSec;
	if (strFractionSec.length){
		strSec = strSec+ "." + strFractionSec;
	}
	if ((ts % 3600) != 0 )
		var hour = 0;
	else var hour = (ts / 3600);
	if ( (tmp % 60) != 0 )
		var min = 0;
	else var min = (tmp / 60);
	if ((new String(hour)).length < 2)
		hour = "0"+hour;
	if ((new String(min)).length < 2)
		min = "0"+min;
	var rtnVal = hour+":"+min+":"+strSec;
	return rtnVal;
}


