var wid = 0;

var hei = 0;

wid = window.innerWidth;

hei = window.innerHeight;



Array.prototype.indexOf = function(val) {
	for ( var i = 0; i < this.length; i++ ) {
		if ( this[i] == val ) {
			return i;
		}
	}
	return -1;
};



Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if ( index > -1 ) {
		this.splice(index, 1);
	}
};



Array.prototype.unique = function() {
	var arr ={};
	for ( var i = 0; i < this.length; i++ ) {
		var v = this[i];
		if ( typeof(arr[v]) == "undefined" ) {
			arr[v] = 1;
		}
	}
	this.length = 0;
	for ( var i in arr ) {
		this[this.length] = i;
	}
	return this;
};



//------------------------------------------var-------------------------------------------



var timeID = 0;

var timeLen = 0;

var scormScore = 0;

var scormProgress = 0;

var lessonStatus = "incomplete";



var bl = 1;

var wp = 1920;

var hp = 1080;

var ceng = 900;

var mp4_ipp = 1;

var mp4_volumeArr = ["1.0","1.5","2.0"];

var isFirstScorm = true;



function changeWh(wid,hei) {
	var wbl = wid/wp;
	var hbl = hei/hp;
	bl = wbl<hbl?wbl:hbl;
	$(".pageVi").css({"-webkit-transform-origin":"0 0","-ms-transform-origin":"0 0","-o-transform-origin":"0 0","-moz-transform-origin":"0 0","transform-origin":"0 0","-webkit-transform":"scale("+bl+")","-ms-transform":"scale("+bl+")","-moz-transform":"scale("+bl+")","-o-transform":"scale("+bl+")","transform":"scale("+bl+")","top":(hei-hp*bl)/2+"px","left":(wid-wp*bl)/2+"px"});
};



$(window).resize(function(){
	wid = window.innerWidth;
	hei = window.innerHeight;
	changeWh(wid,hei);
});



$(document.body).css({ "overflow-x":"hidden","overflow-y":"hidden"});

changeWh(wid,hei);



//------------------------------------------load-------------------------------------------



var fs = 0;

var ipp;

var pagLen = 2;

var pagArr = [];

var pagArr = [];



function getJsonObjLength(jsonObj) {
	var Length = 0;
	for ( var item in jsonObj ) {
		Length++;
	}
	return Length;
};




//------------------------------------------data-------------------------------------------



function getData() {
	for( var i = 0; i < pagLen; i++ ) {
		pagArr.push(0);
	}
	var lso_str;
	lso_str = doLMSGetValue("cmi.suspend_data");
	//lso_str = "2_2@@270@@280@@0@@50@@incomplete";
	if(lso_str){
		if( lso_str.indexOf("@@")>=0 ){
			var chapArr = lso_str.split("@@");
			var pagSv = chapArr[0].split("_");
			timeID = chapArr[1];
			timeLen = chapArr[2];
			scormScore = chapArr[3];
			scormProgress = chapArr[4];
			lessonStatus = chapArr[5];
			for( var j = 0; j < pagSv.length; j++ ) {
				if( j  < pagLen ){
					pagArr[j] = pagSv[j];
				}
			}
			isFirstScorm = false;
		}
	}
};
getData()



function setData() {
	var mcStr;
	var compCount = 0;
	for( var i = 0; i < pagLen; i++ ) {
		if( i == 0 ) {
			mcStr = pagArr[i];
		}
		else{
			mcStr = mcStr + "_" + pagArr[i];
		}
		if( pagArr[i] == 2 ) {
			compCount++;
		}
	}
	var eva = Math.floor((compCount/pagLen)*100);
	if( compCount >= pagLen ){
		eva = 100;
	}
	if( eva >= scormProgress){
		scormProgress = eva;
	}
	if( fs >= scormScore ){
		scormScore = fs;
	}
	if( scormProgress == 100 ){
		mcStr = mcStr + "@@" + timeN + "@@" + timeLen + "@@" + scormScore + "@@" + scormProgress + "@@" + "completed";
	}
	else{
		mcStr = mcStr + "@@" + timeN + "@@" + timeLen + "@@" + scormScore + "@@" + scormProgress + "@@" + "incomplete";
	}
	//$(".dataT").html(mcStr);
	//ceng++;
	//$(".dataT").show();
	//$(".dataT").css({"z-index":ceng});
	doLMSSetValue("cmi.suspend_data",mcStr);
	doLMSSetValue("cmi.core.lesson_progress",scormProgress);	
	if( scormProgress >= 100 ){
		doLMSSetValue("cmi.core.lesson_status","completed");
	}
	else{
		doLMSSetValue("cmi.core.lesson_status","incomplete");
	}
};



var numCanvas = true;
var c , ctx;
function drawRing(val){
	if(numCanvas){
		c = document.getElementById('myCanvas');
		ctx = c.getContext('2d');
		numCanvas = false;
	};
	ctx.canvas.width = 100;
	ctx.canvas.height = 100;
	ctx.beginPath();
	ctx.lineWidth = 10;
	ctx.strokeStyle = '#b3b3b3';
	ctx.arc(50,50,40,0,2*Math.PI);
	ctx.stroke();  
	ctx.beginPath();
	ctx.lineWidth = 10;
	ctx.strokeStyle = '#FFFFFF';
	ctx.arc(50,50,40,-90*Math.PI/180,(val*3.6-90)*Math.PI/180);
	ctx.stroke(); 
	ctx.font = '20px Arial';
	ctx.fillStyle = '#888888';
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'center';
	ctx.fillText(val+'%',52,52);
};



var iCur = 0;



function loadI() {
	var oIm = new Image();
	oIm.src = imgJson[iCur];
	oIm.onload = function() {
 		iCur++;
		drawRing((100*iCur/imgJson.length).toFixed(0));
		if ( iCur < imgJson.length ) {
			loadI(); 
		}
		if( parseInt(iCur/imgJson.length)  === 1 ){
			setTimeout(function(){
				initMain();
			},100);
 		}
	}
};
loadI();



//------------------------------------------main-------------------------------------------


function initMain(){
	$(".loadVi").hide();
	$(".mainVi").show();
	$(".homeVi").show();
};


