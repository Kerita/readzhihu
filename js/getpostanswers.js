 getData["yesterday"] = null;
 getData["recent"] = null;
 getData["archive"] = null;

 $(function(){


 	// 日期选取器
 	// 当前日期之后不能选择
 	// 某个日期之前不能选择
 	$('#datepicker').cxCalendar();
 	$.cxCalendar.defaults.startDate = 2014;
 	$.cxCalendar.defaults.endDate = getTime(new Date());
 	$.cxCalendar.defaults.language = {
 		monthList: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
 		weekList: ['Sun', 'Mon', 'Tur', 'Wed', 'Thu', 'Fri', 'Sat']
 	};

 	// 设置日期选择器的值为当前日期
 	$("#datepicker").val(getTime(new Date()));

 	alert(new Date());

 	// 请求数据
 	// yesterday栏目是每一天最先发布的，可以用这个栏目验证今天是否有数据
 	// 如果有数据加载，没有数据递归加载前一天的数据
 	getData(getTime(new Date()),"yesterday");

 	// 请求完毕后加载数据
 	// 为了可以多次自动加载，所以在document上面绑定了ajaxstop()这个事件
 	$(document).ajaxStop(function() {

 		// 判断目前那个选项卡被选中，加载选中的那个选项卡的数据
 		var ajaxstopId = $("#tab .choose").attr("id");
 		loadData(getData[ajaxstopId]);

 	});



 	// 选中日期之后加载数据
 	$("#datepicker").change(
 		function(){


 			var time = $("#datepicker").val();
 			var today = getTime(new Date());

 			var intTime = parseInt(time);
 			var intToday = parseInt(today);
 			var intStartdate = 20140919;


 			if(time.length != 8 || isNaN(time)){

 				alert("您输入的日期格式不对");
 				return;
 			}
 			else if(intTime <= intToday && intTime >= intStartdate){
 				$(document).scrollTop(0);
 				getData(time,"yesterday");
 			}else if(intTime > intToday){

 				alert(intTime+":"+intToday+"您选择的日期不能在今天之后");
 			}else if(intTime < intStartdate){
 				alert("您选择的日期不能在"+intStartdate+"之前");
 			}

 		});



 	// 切换选项卡
 	$("#tab").click(function(event){

 		var toggletabId = event.target.id;
 		if(toggletabId !== "tab"){

 			// 获取点击在哪个选项卡上
 			event.preventDefault();


 			if(getData[toggletabId] != null){
 				loadData(getData[toggletabId]);
 			}
 			else{
 				$("#view").html("<h2>本栏目今日还未更新</h2>");
 			}


 			$("#yesterday").removeClass('choose');
 			$("#recent").removeClass('choose');
 			$("#archive").removeClass('choose');
 			$("#"+toggletabId).addClass('choose');

 			$(document).scrollTop(0);

 		}

 	});


 	// 回到顶部
 	var $backToTopTxt = "返回顶部", $backToTopEle = $('<div class="backToTop"></div>').appendTo($("body"))
 	.text($backToTopTxt).attr("title", $backToTopTxt).click(function() {
 		$("html, body").animate({ scrollTop: 0 }, 120);
 	}), $backToTopFun = function() {
 		var st = $(document).scrollTop(), winh = $(window).height();
 		(st > 0)? $backToTopEle.show(): $backToTopEle.hide();
        //IE6下的定位
        if (!window.XMLHttpRequest) {
        	$backToTopEle.css("top", st + winh - 166);
        }
    };
    $(window).bind("scroll", $backToTopFun);
    $(function() { $backToTopFun(); });







});





 function getData(time,type){

 	// 本地地址../readzhihu/php/getpostanswers.php
 	// 服务器请求地址 ../php/getpostanswers.php
 	// 远程地址http://readzhihu.applinzi.com/php/getpostanswers.php
 	$.get('../readzhihu/php/getpostanswers.php',{time:time,type:type},function(response){
 		var data = JSON.parse(response);

 		// 接收到yesterday的数据
 		if(data.error == "" && type=="yesterday"){


 			getData(time,"recent");


 		}
 		// 接收到recent数据
 		else if(data.error == "" && type == "recent"){

 			getData(time,"archive");

 		}
 		// 接收archive数据
 		else if(data.error == "" && type == "archive"){

 		}

 		// yesterday没有数据,请求前一天的yesterday数据
 		else if(data.error == "no result" && type === "yesterday"){

 			getData(getYesterday(time),"yesterday");

 			$("#datepicker").val(getYesterday(time));

 		}
 		// recent archive没有数据，返回
 		else if(data.error == "no result"){

 			if(type == "recent"){
 				getData["recent"] = null;
 				getData["archive"] = null;
 			}
 			else if(type == "archive"){
 				getData["archive"] = null;
 			}




 			return;
 		}
 		else
 		{
 			alert("选择的日期太早了！");
 			return;
 		}


 		getData[type] = data;

 	});
 }


// laytpl js模板加载数据
function loadData(data){
	var gettpl = $('#demo').html();
	laytpl(gettpl).render(data, function(html){
		$('#view').html(html);
	});
}


// 又一个Date对象“20160505”格式的日期
function getTime(myDate){

	var year = myDate.getFullYear();
	// 月份是以0-11显示
	var month = myDate.getMonth()+1;
	// 日期类上
	var date = myDate.getDate();



	// 月份小于10需要补0
	if(month<10){
		month = "0"+month;
	}

	// 日期小于10也需要补0
	if(date<10){
		date = "0"+date;
	}

	// 拼接成指定格式字符串
	time = year+month+date;

	// 设置当前日期
	getData.time = time;

	return time;
}


function getYesterday(today){

	var year = today.substr(0,4);
	var month = today.substr(4,2);
	var date = today.substr(6,2);

	today = new Date().setFullYear(+year, + month-1, +date);

	var yesterday = new Date(today - 24 * 60 * 60 * 1000);

	return getTime(yesterday);

}










