
$(".load_txt").html("课件正在加载中，请您耐心等待");


var testLen = 4;

var rightArr = [0, 0, 0, 0];

var answerArr = ["4", "2", "2", "2"];

var rightABC = ["D", "B", "B", "B"];

var analyArr = [
	"30*220 = 6600（元）</br>220/4.5 = 40（天）",
	"应该前台毛利和后台毛利都会有提升。",
	"如果销量有提升，这也提升零售商的前台毛利。",
	"作为知名厂商，往往销量更大，带来前台利润更加多，不一定也没必要一定给予更多的后台支持费用。",
];



$(".pg_right_txt").html("恭喜您，回答正确！");

$(".pg_wrong_txt").html("很遗憾，回答错误！");

$(".pg_wrong_txt1").html("正确答案：");

$(".pg_wrong_txt2").html("B");

$(".pg_wrong_txt3").html("答案解析：");

$(".pg_wrong_txt4").html("新品会创造新的生意机会，一定需要更多的曝光才能获得更好的销量。");





$(".opt_topic_txt1").html("1. C产品由某供应商M供货给到某零售商Y，C产品供货给零售商的价格为15元（税后），零售商要求的倒扣毛利率为25%，请问如果要达到零售商的要求，该产品的零售价应该是多少？这时候供应商提供的顺加毛利率是多少？");

$(".choose_con1_1").find(".opt_choose_txt").html("A.4800元，15天");

$(".choose_con1_2").find(".opt_choose_txt").html("B.6800元，18天");

$(".choose_con1_3").find(".opt_choose_txt").html("C.5400元，33天");

$(".choose_con1_4").find(".opt_choose_txt").html("D.6600元，40天");




$(".opt_topic_txt2").html("2. 销售人员跟零售商谈定一个促销活动，这个活动会支持零售商一定的陈列费用， 同时销量也会有提升，因此这个活动将提供零售商的后台毛利。");

$(".choose_con2_1").find(".opt_choose_txt").html("A.正确");

$(".choose_con2_2").find(".opt_choose_txt").html("B.错误");



$(".opt_topic_txt3").html("3. 给予零售商一定的产品折扣， 零售商将这部分折扣让给消费者， 这不能提升零售商的前台毛利。");

$(".choose_con3_1").find(".opt_choose_txt").html("A.正确");

$(".choose_con3_2").find(".opt_choose_txt").html("B.错误");




$(".opt_topic_txt4").html("4. 零售商要求给予店庆费的支持，作为知名厂商我们一定要支持得更多，才能显示我们的江湖地位。");

$(".choose_con4_1").find(".opt_choose_txt").html("A.正确");

$(".choose_con4_2").find(".opt_choose_txt").html("B.错误");




var audioArr = [];



var imgJson = [

	//images文件夹
	"images/load_pg.gif",

	"images/bottom_auido_closeD.png",
	"images/bottom_auido_closeH.png",
	"images/bottom_auido_openD.png",
	"images/bottom_auido_openH.png",

	"images/bottom_helpD.png",
	"images/bottom_helpH.png",

	"images/bottom_pauseD.png",
	"images/bottom_pauseH.png",
	"images/bottom_playD.png",
	"images/bottom_playH.png",
	"images/bottom_vBtn.png",

	"images/help_closeD.png",
	"images/help_closeH.png",
	"images/help_img.png",


	//rimages文件夹
	"rimages/pg_m_div.gif",
	"rimages/pg_right_div.gif",
	"rimages/pg_s_div.gif",
	"rimages/pg_sort_pan.gif",
	"rimages/pg_sort_dan.gif",
	"rimages/pg_wrong_div.gif",

	"rimages/home_bg.jpg",
	"rimages/main_bg.jpg",

	"rimages/Btn_endD.png",
	"rimages/Btn_endH.png",

	"rimages/Btn_nextD.png",
	"rimages/Btn_nextH.png",

	"rimages/Btn_replayD.png",
	"rimages/Btn_replayH.png",

	"rimages/Btn_retestD.png",
	"rimages/Btn_retestH.png",

	"rimages/Btn_startD.png",
	"rimages/Btn_startH.png",

	"rimages/Btn_submitD.png",
	"rimages/Btn_submitH.png",

	"rimages/Btn_testD.png",
	"rimages/Btn_testH.png",

	"rimages/home_btnD.png",
	"rimages/home_btnH.png",

	"rimages/pg_e1.png",
	"rimages/pg_m_img.png",
	"rimages/pg_right_img.png",
	"rimages/pg_s_img.png",
	"rimages/pg_s2.png",
	"rimages/pg_s3.png",
	"rimages/pg_s4.png",
	"rimages/pg_s5.png",

	"rimages/pg_sort_pan.png",
	"rimages/pg_sort_dan.png",
	"rimages/pg_wrong_img.png",

];
