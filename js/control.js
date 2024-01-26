var conR_length = 1120;

var app_conV_length = 1800;

var app_conR_length = 600;

var mp4_volume = 1;

var isHasSound = false;


var vim = document.getElementById("vim");

var bgmusic = document.getElementById('bgmusic');

var audi = document.getElementById('audi');


$("#vim").click(function () {
	event.preventDefault();
});


function addGs(net) {
	if ( net < 10 ) {
		net = "0" + net;
	}
	return net;
}



vim.addEventListener("timeupdate",function() {
	var vimT = vim.currentTime;
	var eti = vim.duration;
	timeLen = Math.floor(vim.duration);
	var atime = addGs(parseInt(eti/60)) + ":" + addGs(parseInt(eti%60));
	var ntime = addGs(parseInt(vim.currentTime/60)) + ":" + addGs(parseInt(vim.currentTime%60));
	var pxN = parseInt(vim.currentTime/vim.duration*conR_length);
	$(".bottom_vNow").width(vim.currentTime/vim.duration*conR_length);
	$(".bottom_vBtn").css({"left":vim.currentTime/vim.duration*conR_length-45+"px"});
	$(".app_vNow").width(vim.currentTime/vim.duration*app_conR_length);
	if( vim.currentTime > 0.1 ) {
		$(".video_loading").hide();
		$(".bottom_nTime").html(ntime);
		$(".bottom_lTime").html("/");
		$(".bottom_aTime").html(atime);
		$(".app_nTime").html(ntime);
		$(".app_lTime").html("/");
		$(".app_aTime").html(atime);
	}
	else {
		$(".bottom_nTime").html("00:00");
		$(".bottom_lTime").html("/");
		$(".bottom_aTime").html("00:00");
		$(".app_nTime").html("00:00");
		$(".app_lTime").html("/");
		$(".app_aTime").html("00:00");
	}
	timeN = Math.floor(vim.currentTime);
	if( vim.currentTime/vim.duration > 0.90  &&  isData == true ) {
		isData = false;
		pagArr[0] = 2;
		setData();
	}
});



vim.addEventListener("ended",function(){
	videoPause();
	$(".videoVi").hide();
	$(".testVi").show();
	$(".testStart").show();
	$(".pg_s_con").hide();
	setTimeout(function(){
		$(".pg_s_con").show();
		$(".pg_s_div").show();
		$(".pg_s_img").hide();
	},10);
	setTimeout(function(){
		$(".pg_s_img").show();
	},1010);
	setTimeout(function(){
		$(".pg_s_div").hide();
	},1011);
});


var timeId;

var timeData = function(){
	setData();
	timeId = setTimeout(function () {
		timeData();
	}, 5000);
}



$(".bottom_playBtn").click(end,function() {
	videoPlay();
});



$(".bottom_pauseBtn").click(end,function() {
	videoPause();
});


function videoPlay() {
	vim.play();
	$(".bottom_playBtn").hide();
	$(".bottom_pauseBtn").show();
};


function videoPause() {
	vim.pause();
	$(".bottom_playBtn").show();
	$(".bottom_pauseBtn").hide();
};



$(".bottom_auido_closeBtn").click(end,function(){
	vim.volume = 1;
	vim.muted = false;
	$(".bottom_auido_openBtn").show();
	$(".bottom_auido_closeBtn").hide();
});



$(".bottom_auido_openBtn").click(end,function(){
	vim.volume = 0;
	vim.muted = true;
	$(".bottom_auido_openBtn").hide();
	$(".bottom_auido_closeBtn").show();
});



$(".bottom_helpBtn").click(end,function() {
	$(".helpR").show();
	videoPause();
});


$(".help_closeBtn").click(end,function() {
	$(".helpR").hide();
	videoPlay();
});


$(".lastPage").click(end,function() {
	if( pagNu != 1 ) {
		pagNu--;
		goPag();
	};
});



$(".nextPage").click(end,function() {
	if( pagNu != pagLen ) {
		pagNu++;
		goPag();
	}
});



$(".bottomBtn").click(end,function(){
	initBottom();
});



function initBottom() {
	$(".bottom_multipleR").hide();
	$(".bottomVi").animate({top:"990px"});
	bottomr();
}



var bottomrId;



var bottomr = function(){
	clearTimeout(bottomrId);
	bottomrId = setTimeout(function () {
		$(".bottomVi").animate({top:"1080px"});
	}, 3000);
}



$(".bottom_multipleBtn").click(end,function() {
	mp4_ipp++;
	if( mp4_ipp == 4 ){
		mp4_ipp = 1;
	}
	var mp4_space = Number(mp4_volumeArr[mp4_ipp-1]);
	var mp4_txt = mp4_volumeArr[mp4_ipp-1] + "x";
	$(".bottom_multipleBtn_txt").html(mp4_txt);
	vim.playbackRate = mp4_space;
});



var timeN;

var yy;

var ply;


$(".bottom_conR").on(start,function(e){
	if( pagArr[0] != 2 ){
		return;
	}
	timeN = 0;
	var exd = 0;
	var eln = 0;
	if( IsPC() ) {
		exd = e.pageX;
		eln = $(".bottom_conR").offset().left;
		timeN = (exd - eln)/conR_length/bl*vim.duration;
	}
	else{
		var touch = e.touches[0];
		exd = touch.pageX;
		eln = $(".bottom_conR").offset().left;
		timeN = (exd - eln)/conR_length/bl*vim.duration;
	}
	if( timeN >=  vim.duration*0.99 ){
		return;
	}
	$(".bottom_vNow").width(timeN/vim.duration*conR_length);
	$(".bottom_vBtn").css({"left":timeN/vim.duration*conR_length-45+"px"});
	$(".app_vNow").width(timeN/vim.duration*app_conR_length);
	$("#vim").show();
	vim.currentTime = timeN;
	videoPlay();
});



var bottom_dragging = false;

var tyu = [];

var tyu1 = [];

var tut = [];

var tut1 = [];

var anrg;

var exs,eys,exd,eyd,eln,opfl,opft,iipp;

var qup = 1;

var that;



$(".bottom_vBtn").on(start,function(e){
	if( pagArr[0] != 2 ){
		return;
	}
	bottom_dragging = true;
	e.stopPropagation();
	e.preventDefault();
	exs = 0;
	eys = 0;
	if(IsPC()){
		exs = e.pageX;
		eys = e.pageY;
	}
	else{
		var touch = e.touches[0];
		exs = touch.pageX;
		eys = touch.pageY;
	}
	that = this;
});
$(".pageVi").on(move,function(e){
	if (!bottom_dragging) return;
	e.stopPropagation();
	e.preventDefault();
	exd = 0;
	eyd = 0;
	timeN = 0;
	if(eys!=0 || exs!=0){
		if(IsPC()){
			exd = e.pageX;
			eln = $(".bottom_conR").offset().left;
			if( exd <= eln ){
				exd = eln
			}
			else if( exd >= eln + conR_length*bl ){
				exd = eln + conR_length*bl
			}
			$(that).css("left",  exd/bl - eln/bl - 45 );
			timeN = (exd - eln)/conR_length/bl*vim.duration;
			if( timeN >=  vim.duration*0.99 ){
				return;
			}
			$(".bottom_vNow").width(timeN/vim.duration*conR_length);
			$(".bottom_vBtn").css({"left":timeN/vim.duration*conR_length-45+"px"});
			$(".app_vNow").width(timeN/vim.duration*app_conR_length);
		}
		else {
			var touch = e.touches[0];
			exd = touch.pageX;
			eln = $(".bottom_conR").offset().left;
			if( exd <= eln ){
				exd = eln
			}
			else if( exd >= eln + conR_length*bl ){
				exd = eln + conR_length*bl
			}
			$(that).css("left",  exd/bl - eln/bl - 45 );
			timeN = (exd - eln)/conR_length/bl*vim.duration;
			if( timeN >=  vim.duration*0.99 ){
				return;
			}
			$(".bottom_vNow").width(timeN/vim.duration*conR_length);
			$(".bottom_vBtn").css({"left":timeN/vim.duration*conR_length-45+"px"});
			$(".app_vNow").width(timeN/vim.duration*app_conR_length);
		}		
		$("#vim").show();
		vim.currentTime = timeN;
		videoPlay();
	}
});
$(".pageVi").on(end,function(e){
	if (!bottom_dragging) return;
	bottom_dragging = false;
	e.stopPropagation();
	e.preventDefault();
	tut.sort();
	tut.unique();
	eys = 0;
	exs = 0;
	tyu.unique();
	tyu1.unique();
	return false;
});



var $body = $('body');

var _isDown = false;

var _isMove = false;

var isDrag = false;



$body.on('mousedown touchstart', function (evt) {
	_isDown = true;
	isDrag = false;
});
$body.on('mouseup touchend', function handler(evt) {
	if(!_isMove){
		isDrag = false;
	}
	_isMove = false;
});
$body.on('touchmove', function handler(evt) {
	if(_isDown){
		_isMove = true;
		isDrag = true;
	}
});



$('body').on('touchend', function(el) {
	if( el.target.tagName != 'INPUT'  &&  el.target.tagName != 'TEXTAREA') {
		$('input, textarea').blur();
		window.scrollTo(0,0);
	}
})



var agent = navigator.userAgent.toLowerCase();
var iLastTouch = null;
if (agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0) {
	document.body.addEventListener('touchend', function(event) {
		var iNow = new Date().getTime();
		iLastTouch = iLastTouch || iNow + 1;
		var delta = iNow - iLastTouch;
		if (delta < 500 && delta > 0) {
			event.preventDefault();
			return false;
		}
		iLastTouch = iNow;
	}, false);
}



$(".app_controlBtn").on(start,function(e){
	if( !IsPC() ) {
		$(".app_conVi").show();
		$(".bottomVi").animate({top:"990px"});
		appr();
	}
});



var appId;

var appr = function(){
	clearTimeout(appId);
	appId = setTimeout(function () {
		$(".app_conVi").hide();
		$(".bottomVi").animate({top:"1080px"});
	}, 3000);
}



$(".app_conVi").on(start, function(e) {
	if( pagArr[0] != 2 ){
		return;
	}
	app_dragging = true;
	e.stopPropagation();
	e.preventDefault();
	exs = 0;
	eys = 0;
	var touch = e.touches[0];
	exs = touch.pageX;
	eys = touch.pageY;
	that = this;
})
$(".app_conVi").on(move, function(e) {
	if( !app_dragging ){
		return;
	}
	e.stopPropagation();
	e.preventDefault();
	exd = 0;
	eyd = 0;
	timeN = 0;
	if(eys!=0 || exs!=0){
		var touch = e.touches[0];
		exd = touch.pageX;
		eln = $(".app_conVi").offset().left;
		if( exd <= eln ){
			exd = eln;
		}
		else if( exd >= eln + app_conV_length*bl ){
			exd = eln + app_conV_length*bl;
		}
		timeN = (exd - eln)/app_conV_length/bl*vim.duration;
		if( timeN >=  vim.duration*0.99 ){
			return;
		}
		$(".bottom_vNow").width(timeN/vim.duration*(conR_length-90)+45);
		$(".bottom_vBtn").css({"left":timeN/vim.duration*(conR_length)+"px"});
		$(".app_vNow").width(timeN/vim.duration*app_conR_length);
		$("#vim").show();
		vim.currentTime = timeN;
		videoPlay();
	}
});
$(".app_conVi").on(end, function(e) {
	app_dragging = false;
	e.stopPropagation();
	e.preventDefault();
	appr();
	tut.sort();
	tut.unique();
	eys = 0;
	exs = 0;
	tyu.unique();
	tyu1.unique();
	return false;
});


var bgmusicVolume = 0.2;

var is_bgmusic_mute = false;


function initBgMusic() {
	bgmusic.volume = bgmusicVolume
	if( is_bgmusic_mute == true ){
		bgmusic.pause();
	}
	else{
		bgmusic.play();
	}
}


bgmusic.addEventListener("ended",function(){
	initBgMusic();
});