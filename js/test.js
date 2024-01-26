//-------------------------------------init-------------------------------------------------


var chechArr = [];

var testNum = 0;

var is_choose = false;


$(".choose_one").click(end,function() {
	if(!is_choose) return;
	$("#audi").attr("src","mp3/abtnclick.mp3");
	audi.play();
	var ip = $(this).attr("ip");
	if ( chechArr.indexOf(ip)>-1 ) {
		chechArr.remove(ip);
		$(this).find(".opt_choose_txt").css({"color":"#FFFFFF"});
	}
	else {
		chechArr = [];
		chechArr.push(ip);
		$(this).find(".opt_choose_txt").css({"color":"#FFFF00"});
		$(this).siblings().find(".opt_choose_txt").css({"color":"#FFFFFF"});
	}
	if ( chechArr == "" ) {
		$(".Btn_submit").hide();
	}
	else {
		$(".Btn_submit").show();
	}
});



$(".choose_more").click(end,function() {
	if(!is_choose) return;
	$("#audi").attr("src","mp3/abtnclick.mp3");
	audi.play();
	var ip = $(this).attr("ip");
	if ( chechArr.indexOf(ip)>-1 ) {
		chechArr.remove(ip);
		$(this).find(".opt_choose_txt").css({"color":"#FFFFFF"});
	}
	else {
		chechArr.push(ip);
		$(this).find(".opt_choose_txt").css({"color":"#FFFF00"});
	}
	chechArr.sort();
	if ( chechArr == "" ) {
		$(".Btn_submit").hide();
	}
	else {
		$(".Btn_submit").show();
	}
});



$(".Btn_submit").on(end,function() {
	$("#audi").attr("src","mp3/abtnclick.mp3");
	audi.play();
	is_choose = false;
	$(".Btn_submit").hide();
	setOptRetro();
	if ( testNum < testLen ) {
		$(".Btn_next").show();
	}
	else {
		$(".Btn_end").show();
		var count = 0
		var feng = 100/rightArr.length;
		for ( var i = 0 ; i < rightArr.length; i++ ) {
			fs += rightArr[i]*feng;
			if( rightArr[i] == 1 ){
				count++;
			}
		}
		if ( count >= rightArr.length ) {
			fs = 100;
		}
		fs = parseInt(fs);
		if ( fs > 100 ) {
			fs = 100;
		}
		if ( fs > scormScore ) {
			scormScore = fs;
		}
		doLMSSetValue("cmi.core.score.raw",fs);
		pagArr[1] = 2;
		setData();
	}
});



$(".Btn_next").on(end,function() {
	$("#audi").attr("src","mp3/abtnclick.mp3");
	audi.play();
	$(".Btn_next").hide();
	subjectNextText();
});



$(".Btn_end").on(end,function() {
	$("#audi").attr("src","mp3/abtnclick.mp3");
	audi.play();
	$(".testMain").hide();
	$(".testEnd").show();
	clearTimeout(timeId);
	doLMSFinish();
});



$(".Btn_retest").on(end,function() {
	$("#audi").attr("src","mp3/abtnclick.mp3");
	audi.play();
	initBgMusic();
	$(".testStart").hide();
	$(".testMain").show();
	$(".testEnd").hide();
	$(".pg_m_con").hide();
	setTimeout(function(){
		$(".pg_m_con").show();
		$(".pg_m_div").show();
		$(".pg_m_img").hide();
	},100);
	setTimeout(function(){
		$(".pg_m_img").show();
	},1000);
	setTimeout(function(){
		$(".pg_m_div").hide();
	},1001);
	testNum = 0;
	rightArr = [0, 0, 0];
	subjectNextText();
});



$(".Btn_replay").on(end,function() {
	$("#audi").attr("src","mp3/abtnclick.mp3");
	audi.play();
	bgmusic.pause();
	$(".testVi").hide();
	$(".testEnd").hide();
	$("#vim").attr("src","video/vim1.mp4");
	$(".videoVi").show();
	videoPlay();
	$(".bottomBtn").show();
	if( IsPC() ) {
		$(".app_controlBtn").hide();
	}
	else{
		$(".app_controlBtn").show();
	}
});



function setOptRetro() {
	var isR = true;
	if( testNum == 1  ||  testNum == 2  ||  testNum == 3 ){
		var chechs = chechArr.join("");
		if ( chechs == answerArr[testNum-1] ) {
			isR = true;
			rightArr[testNum-1] = 1;
		}
		else {
			isR = false;
		}
	}
	else if( testNum == 4 ){
	}	
	if ( isR == true ) {
		setTimeout(function(){
			$("#audi").attr("src","mp3/right.mp3");
			audi.play();
		},100);
		$(".pg_right_con").show();
		setTimeout(function(){
			$(".pg_right_con").find(".pg_right_img").show();
		},1100);
		setTimeout(function(){
			$(".pg_right_con").find(".pg_right_div").hide();
		},1200);
		rightArr[testNum-1] = 1;
	}
	else {
		setTimeout(function(){
			$("#audi").attr("src","mp3/wrong.mp3");
			audi.play();
		},100);
		$(".pg_wrong_con").show();
		setTimeout(function(){
			$(".pg_wrong_con").find(".pg_wrong_img").show();
		},1100);
		setTimeout(function(){
			$(".pg_wrong_con").find(".pg_wrong_div").hide();
		},1200);
	}
}



function subjectNextText() {
	chechArr = [];
	is_choose = true;
	$(".Btn_submit").hide();
	$(".Btn_next").hide();
	$(".Btn_end").hide();
	$(".pg_right_con").hide();
	$(".pg_wrong_con").hide();
	$(".pg_right_con").find(".pg_right_img").hide();
	$(".pg_right_con").find(".pg_right_div").show();
	$(".pg_wrong_con").find(".pg_wrong_img").hide();
	$(".pg_wrong_con").find(".pg_wrong_div").show();
	testNum++;
	$(".pg_wrong_con").find(".pg_wrong_txt2").html(rightABC[testNum-1]);
	if ( analyArr[testNum-1] == null  ||  analyArr[testNum-1] == "" ) {
		$(".pg_wrong_con").find(".pg_wrong_txt3").hide();
		$(".pg_wrong_con").find(".pg_wrong_txt4").hide();
	}
	else{
		$(".pg_wrong_con").find(".pg_wrong_txt3").show();
		$(".pg_wrong_con").find(".pg_wrong_txt4").show();
		$(".pg_wrong_con").find(".pg_wrong_txt4").html(analyArr[testNum-1]);
	}
	for ( var i = 0 ; i < testLen; i++ ) {
		$(".test"+(i+1)).hide();
		$(".pg_sort_con").find(".pg_sort_img").hide();
		$(".pg_sort_con").find(".pg_sort_div").show();
		$(".pg_sort_con").hide();
	}
	$(".test"+testNum).show();
	setTimeout(function(){
		$(".pg_sort_con").show();
	},100);
	setTimeout(function(){
		$(".pg_sort_con").find(".pg_sort_img").show();
	},1200);
	setTimeout(function(){
		$(".pg_sort_con").find(".pg_sort_div").hide();
	},1300);
	if ( testNum == 1  ||  testNum == 2  ||  testNum == 3  ||  testNum == 4 ) {
		for ( var j = 0 ; j < 6; j++ ) {
			$(".choose_one"+(j+1)).find(".opt_choose_txt").css({"color":"#FFFFFF"});
		}
	}
	if ( testNum == 1 ) {
		$(".Btn_submit").css({"left":"840px","top":"800px" });
	}
	else if ( testNum == 2  ||  testNum == 3  ||  testNum == 4 ) {
		$(".Btn_submit").css({"left":"840px","top":"700px" });
	}
}
