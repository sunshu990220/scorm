$(".home_btn").click(end,function(){
	$("#audi").attr("src","mp3/abtnclick.mp3");
	audi.play();
	$(".homeVi").hide();
	$("#vim").attr("src","video/vim1.mp4");
	$(".videoVi").show();
	videoPlay();
	isData = true;
	$(".bottomBtn").show();
	if( IsPC() ) {
		$(".app_controlBtn").hide();
	}
	else{
		$(".app_controlBtn").show();
	}
	if( isFirstScorm == true ){
		vim.currentTime = 0;
	}
	else{
		vim.currentTime = timeID;
		if( timeID >= timeLen*0.9 ){
			vim.currentTime = 0;
		}
	}
	videoPlay();
	setTimeout(function(){
		timeData();
	},5000);
});



function goPag(){
	pagNu = pagNu>1?pagNu:1;
	pagNu = pagNu>pagLen?pagLen:pagNu;
	$(".pag"+pagNu).show();
	$(".pag"+pagNu).siblings().hide();
};



$(".Btn_start").click(end,function(){
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


