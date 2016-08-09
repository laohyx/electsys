
function post(url,data,lid)
{	
/*	if (localStorage["lesson_enable"] == undefined || localStorage["lesson_enable"] == 0) {
		return 0;
	};
*/
    setTimeout(function(){
		jQuery.ajax({
		  type: 'POST',
		  url: url,
		  data: data,
		  async:false,
		  success: function(data){
					processArrangement(data,lid);

			},
			error: function(data){
				console.log("error");

			},
		  dataType: "html"
		});}
	,0);
	
	return 0;

}

	
//颜色对照表
color = [];
color[0] = ["#84C1FF","#84C1FF","#84C1FF","#84C1FF","#84C1FF","#84C1FF","#84C1FF"]
color[1] = ["#ff7575","#ff7575","#ff7575","#ff7575","#ff7575","#ff7575","#ff7575"]
border_color = [];
border_color[0] = "blue";
border_color[1] = "red";


function lesson_enable_check () {
	
    // enable the function
	var timestamp = Date.parse(new Date())/1000;
	if (!(localStorage["lesson_enable_timestamp"] > 10))
		localStorage["lesson_enable_timestamp"] = 100;
	if(timestamp - localStorage["lesson_enable_timestamp"] > 60 * 5){
		jQuery.ajax({
		  type: 'GET',
		  url: "http://1.laohyxwebauth.sinaapp.com/electsys_lesson_enable.php",
		  data: {},
		  async:true,
		  success: function(data){
					localStorage["lesson_enable"] = data["enable"];
					console.log( data["enable"]);
				},
			error: function(data){
			console.log("error");

			},
		  dataType: "json"
		});
		localStorage["lesson_enable_timestamp"] = timestamp;
	}

}

//选课提醒页面
function optimize_elect_warning()
{
    if(!inUrl("/edu/student/elect/electwarning.aspx")) {
        return;
    }

    //选中“我已阅读”
    jQuery("input[type=\"checkbox\"]").attr('checked', 'checked');

    //为“继续”按钮设置焦点
    jQuery("#btnContinue").focus();
}

function optimize_elect()
{
	    
    document = document;
    //在课程安排中获取老师评教
    show_teacher_eval();
	if(!inUrl("/edu/student/elect"))
	{
		return 0;
	}

    //不需要应用优化的页面
    var black_list = [
        "/edu/student/elect/viewLessonTbl.aspx",
        "/edu/student/elect/electResultOuter.aspx",
        "/edu/student/elect/electwarning.aspx"
    ];
    if(inUrl(black_list)) {
        return 0;
    }

	title = jQuery(".tit",document);
	title.removeAttr("width");
/*
	if (localStorage["lesson_enable"] == undefined || localStorage["lesson_enable"] == 0) {
		jQuery("table").slice(2,3).before('<div style="color:red;">为减少服务器压力，抢选高峰暂时关闭部分功能。请使用<a href="http://electsys.net/" target="_blank">electsys.net</a>查询课程：）</div>')

	};
*/
	//插入小课表
	prepend_smalltable();
	title[0].innerHTML += " Electsys++  " + localStorage['extension_version'];
	
	type = "tongshi";
	
	if(inUrl("/edu/student/elect/speltyRequiredCourse.aspx"))
		type = "bixiu";
	if(inUrl("/edu/student/elect/speltyCommonCourse.aspx"))
		type = "tongshi";
	if(inUrl("/edu/student/elect/outSpeltyEP.aspx"))
		type = "renxuan";
	if(inUrl("/edu/student/elect/ShortSession.aspx"))
		type = "xiaoxueqi";
	
    radiogroup = jQuery("[name=myradiogroup]",document);
	for(radio_index = 0; radio_index < radiogroup.length ; radio_index++){
		jQuery(radiogroup[radio_index]).click(function(){
			setTimeout(function(){jQuery("input[value=课程安排]").trigger("click");}, 400);
		})
		var lid = radiogroup[radio_index].value;
		//console.log(radio_index + "~~" + lid);
		radio = radiogroup[radio_index];
		lesson_name = radio.parentElement.parentElement.parentElement.children[1].innerHTML.toString().trim();
		
		var type_name = "";
		if(type == "xiaoxueqi") {
			type_name = radio.parentElement.parentElement.parentElement.children[3].innerHTML.toString().trim();
		}
		
		GE_table = ["other","人文学科","社会科学","自然科学与工程技术","数学或逻辑学"];
		var GE_type = jQuery.inJSON(GE_list,lesson_name);
		
		if(type == "renxuan" && GE_type.length > 0){	// 普通选课
			radio.parentElement.parentElement.parentElement.children[1].innerHTML = "<font class='chongdi_font' color=\"red\">" + lesson_name + "（冲抵通识：" + GE_table[GE_type[0]] + "）</font>";
		}
		else if(type == "xiaoxueqi" && type_name != "通识" && GE_type.length > 0){	// 小学期选课
			radio.parentElement.parentElement.parentElement.children[1].innerHTML = "<font class='chongdi_font' color=\"red\">" + lesson_name + "（冲抵通识：" + GE_table[GE_type[0]] + "）</font>";
		}
		else{
			//radio.parentElement.parentElement.parentElement.children[1].innerHTML = "<font color=\"blue\">" + lesson_name + "</font>";
		}
		//console.log(lesson_name);
		
	}
    
    var html = jQuery("[name=myradiogroup]",document).slice(0,1).parent().parent().parent().prev().children().slice(0,1).html();
    jQuery("[name=myradiogroup]",document).slice(0,1).parent().parent().parent().prev().children().slice(0,1).css({"background-color":"#83A9C9", "background-image":"none"});
    jQuery("[name=myradiogroup]",document).slice(0,1).parent().parent().parent().prev().children().slice(0,1).html("<a href='#' class='refresh_list' style='font-weight:400;'>【刷新信息】</a>");

	document.processInterval = 600;
    init_query_list();

    jQuery('.refresh_list').click(function(){
    	clearAllInterval();
	    jQuery(".fullspan,.attrtag").remove();
	    var radiogroup = jQuery("[name=myradiogroup]",document).get().reverse();
   		document.lids = [];
		for(radio_index = 0; radio_index < radiogroup.length ; radio_index++){
			//在列表上添加是否空的span - fullspan
			var lid = radiogroup[radio_index].value;
			document.lids[radio_index] = [lid,type];
			jQuery(radiogroup[radio_index]).parent().after('<span class="fullspan">&nbsp;&nbsp;</span>');
		}

		setInterval("processLidQueue();", document.processInterval);
    });
	
}
function init_query_list(){
    jQuery(".fullspan,.attrtag").remove();
    var radiogroup = jQuery("[name=myradiogroup]",document).get().reverse();
	document.lids = [];
	for(radio_index = 0; radio_index < radiogroup.length ; radio_index++){
		var lid = radiogroup[radio_index].value;
		jQuery(radiogroup[radio_index]).parent().after('<span class="fullspan">&nbsp;&nbsp;</span>');
		jQuery(radiogroup[radio_index]).parent().before('<span style="cursor:pointer;color:" class="lesson_query" lid="'+lid.toString()+'">查</span>');
	}
	jQuery('.lesson_query').click(function(event){
		event.stopPropagation();
		jQuery(this).parent().find('.fullspan').html('<span class="fullspan">&nbsp;&nbsp;</span>');
		var lid = jQuery(this).attr('lid');
		document.lids[document.lids.length] = [lid,type];
		clearAllInterval();
		setInterval("processLidQueue();", document.processInterval);
	});
}

function prepend_smalltable()
{
    
	st_fixed_div = jQuery('  <div id="st_fixed_div" style="margin:0px;width:60%;z-index: 999;position: fixed;top:5px;right:0px;border:1px solid gray;text-align: center;"><div class="smalltable_title" style="height:25px;font-size: 12px;line-height:25px;cursor:pointer;background-image:url(http://electsys.sjtu.edu.cn/edu/imgs/subbg2.gif);">课程表(展开/收起)</div><div id="smalltable_handle" style="cursor:move;"><div id="smalltable_container"><span id="LessonTbl1_spanContent_small"></span></div><div class="smalltable_under" style="height:25px;font-size: 12px;line-height:25px;background:#B5C7DE;">electsys++(' + localStorage['extension_version'] + ') by laohyx(拖动)</div></div></div>');
	jQuery("body").prepend(st_fixed_div);
	jQuery("#st_fixed_div").draggable({handle:"#smalltable_handle"});
	if(inUrl("/edu/student/elect/ShortSession.aspx"))
		jQuery("#LessonTbl1_spanContent_small").append(jQuery(".alltab",document)[jQuery(".alltab",document).length - 2].outerHTML);
	else
		jQuery("#LessonTbl1_spanContent_small").append(jQuery(".alltab",document)[jQuery(".alltab",document).length - 1].outerHTML);
		
		
	if (localStorage["malltable_slide"] < 0)
		jQuery("#smalltable_container").slideToggle(0);
	else
		localStorage["malltable_slide"] = 1;
	
	jQuery(".smalltable_title").click(function(){
	    jQuery("#smalltable_container").slideToggle("slow");
		localStorage["malltable_slide"] *= -1;
	  });
	


}




function processLidQueue()
{
	if (document.lids.length == 0) {
		clearAllInterval();
		return;
	};
	// 取栈顶
	var args = document.lids[document.lids.length - 1];
	document.lids = document.lids.slice(0, document.lids.length - 1);
	var lid = args[0];
	var type = args[1];
	// console.log(lid, type);
	var data = {};
	data = {"__VIEWSTATE":jQuery('#__VIEWSTATE',document).val(),"__EVENTVALIDATION":jQuery('#__EVENTVALIDATION',document).val()}
	if(type == "renxuan")
	{
		data["OutSpeltyEP1$dpYx"]=jQuery("#OutSpeltyEP1_dpYx",document).val();
		data["OutSpeltyEP1$dpNj"]=jQuery("#OutSpeltyEP1_dpNj",document).val();
	}
	
	data["myradiogroup"] = lid;
	sub_button = jQuery('[value=课程安排]',document)
	data[sub_button.attr("name")] = sub_button.val();
	input_elements = jQuery("[type=hidden]",document);
	
	form = jQuery("form",document);
	url = base_url + "/edu/student/elect/" + form.attr("action");
	post(url,data,lid);
	return 0;

}
function clearAllInterval(){
	var highestIntervalId = setInterval(";", 100000);
	for (var i = 0 ; i <= highestIntervalId ; i++) {
	    clearInterval(i); 
	}

}
function getArrangement(lid,type)
{
	data = {};
	data = {"__VIEWSTATE":jQuery('#__VIEWSTATE',document).val(),"__EVENTVALIDATION":jQuery('#__EVENTVALIDATION',document).val()}
	if(type == "renxuan")
	{
		data["OutSpeltyEP1jQuerydpYx"]=jQuery("#OutSpeltyEP1_dpYx",document).val();
		data["OutSpeltyEP1jQuerydpNj"]=jQuery("#OutSpeltyEP1_dpNj",document).val();
	}
	data["myradiogroup"] = lid;
	sub_button = jQuery('[value=课程安排]',document)
	data[sub_button.attr("name")] = sub_button.val();
	input_elements = jQuery("[type=hidden]",document);
	
	form = jQuery("form",document);
	url = base_url + "/edu/student/elect/" + form.attr("action");

	post(url,data,lid);
	return 0;

}

function processArrangement(html,lid)
{
	//判断是否有错误提示
	var error_pattern = new RegExp("<span id=\"lblMessage\" .*?>(.*?)</span>");
	var error_match = error_pattern.exec(html);
	if(error_match != null)
	{
		var error_message = error_match[1];
		console.log(error_message);

		if(error_message.indexOf("不能继续增加通识课") > -1){
			error_message = "通识达上限";
			document.lids = [];
			//在列表上添加是否空的提示
			lessontr = jQuery("input[value=" + lid + "]",document).parent().parent().parent();
			fullspan = lessontr.find(".fullspan")[0];
			fullspan.setAttribute("style","color:gray");
			fullspan.innerHTML = error_message;
			return;
		}

		// 其他情况（比如提示查询频繁）
		// 把该lid加回去
		document.lids[document.lids.length] = [lid, type];
		document.processInterval += 200;
		clearAllInterval();
		setInterval("processLidQueue();", document.processInterval);

		return;
	}
    


// 开始处理html，并绘制至课表中
// 这段代码是我大二写的，已经是2011年的事了。。。相信它会运行很久
	
	var lessons = [];
	tablelsn = jQuery("#LessonTime1_gridMain",html)[0];
	

	trs = jQuery("tr",tablelsn).slice(1);
//		console.log(lid);
	for(x = 0; x < trs.length; x++){
		var l = {"lid" : lid, "now" : Number(trs.slice(x,x+1).children().slice(8,9).text()), "max" : Number(trs.slice(x,x+1).children().slice(5,6).text()) };
        l.arrange = Trim(trs.slice(x,x+1).children().slice(9,10).text(),"g")
		l.times = []
		pattern = new RegExp("星期(.*?)第(.*?)节--第(.*?)节","ig");
		matches = l.arrange.match(pattern);
        
				
        matches = matches.distinct();
		for (i = 0 ; i < matches.length;i++) 
		{
			pattern = new RegExp("星期(.*?)第(.*?)节--第(.*?)节","ig");
			txt = matches[i];
			//console.log(txt);
			match = pattern.exec(txt);
			//console.log(match);
			switch(match[1]){
			case "一":
				day = 1;				break;
			case "二":
				day = 2;				break;
			case "三":
				day = 3;				break;
			case "四":
				day = 4;				break;
			case "五":
				day = 5;				break;
			case "六":
				day = 6;				break;
			case "日":
				day = 7;				break;
			default:
				day = 7;			}
			if(l.max - l.now > 0)
				full = 0;
			else
				full = 1;
			//console.log(l.lid);
			time = {"day":day,"from":Number(match[2]),"to":Number(match[3]),"full":full}
			l.times.push(time);
		}
		//n个老师
		lessons.push(l);
	}
	
	
	//保存lessons信息到tr中,用隐藏的div存储
	lessontr = jQuery("input[value=" + lid + "]",document).parent().parent().parent();
	// console.log(lessons);

	lessontr.attr("lid",lid);
	var full_identifier = 1;
	for(x=0; x < lessons.length; x++){
		times = lessons[x].times;
		//console.log(time);
		for(y=0; y < times.length;y++)
		{
			time = times[y];
			if(time.full == 0)
				full_identifier = 0;
			attrtag = document.createElement("div");
			attrtag.setAttribute("class","attrtag");
			attrtag.setAttribute("day",time.day);
			attrtag.setAttribute("from",time.from);
			attrtag.setAttribute("to",time.to);
			attrtag.setAttribute("full",time.full);
			attrtag.setAttribute("hidden","true");
			attrtag.setAttribute("teacher_order",x);
			lessontr.slice(0,1).append(attrtag);
		}
	}

	//在列表上修改是否空的提示
	fullspan = lessontr.find(".fullspan")[0];
	// console.log(lessons);
	if(lessons.length == 0){
		fullspan.setAttribute("style","color:gray");
		fullspan.innerHTML = "无";
		return;
	}

	if(full_identifier == 1)
	{
		fullspan.setAttribute("style","color:gray");
		fullspan.innerHTML = "满";
	}
	else
	{
		fullspan.setAttribute("style","color:blue");
		fullspan.innerHTML = "未满";
	}
	if(jQuery("tr",tablelsn).length < 2 )
	{
		jQuery("#loadimg_"+lid,document).remove();
		return 0;
	}
	
	//lessontr.slice(0,1).children().slice(0,1).append(fullspan);

	
	
	
	lessontr.mouseover(function(){
		if(jQuery(this).attr("clicked") != "1"){
			jQuery(this).css("background-color","#CFC");
			draw_lesson(jQuery(this).attr("lid"),0);	
		}
	});
	
	lessontr.click(function(){
		jQuery(this).css("background-color","#FC9");
		if(jQuery(this).attr("clicked") == "1"){
			jQuery(this).attr("clicked","0");
			clearDraw_lid(jQuery(this).attr("lid"));
		}else{
			clearDraw_lid(jQuery(this).attr("lid"));
			draw_lesson(jQuery(this).attr("lid"),1);
			jQuery(this).attr("clicked","1");
		}
			
	});
	jQuery("input[value=" + lid + "]",document).parent().parent().parent().mouseout(function(){
		if(jQuery(this).attr("clicked") != "1"){
			jQuery(this).attr("style","");
			clearDraw_lid(jQuery(this).attr("lid"));
		}
			
	})
	return 0;
}




//获取元素的纵坐标
function getTop(e){
var offset=e.offsetTop;
if(e.offsetParent!=null) offset+=getTop(e.offsetParent);
return offset;
}
//获取元素的横坐标
function getLeft(e){
var offset=e.offsetLeft;
if(e.offsetParent!=null) offset+=getLeft(e.offsetParent);
return offset;
}

function draw_lesson(lid,clicked)
{
	lessontr = jQuery("tr[lid=" + lid + "]",document);
	lessons = jQuery("div[hidden=true]",lessontr);
	for(x=0; x < lessons.length; x++){
		lesson = lessons[x];
		day = lesson.getAttribute("day");
		from = lesson.getAttribute("from");
		to = lesson.getAttribute("to");
		full= lesson.getAttribute("full");
		teacher_order = Number(lesson.getAttribute("teacher_order")) + 1;
		draw(day,from,to,full,lid,clicked,teacher_order);
	}
	
	

}


function draw(weekday,hour_from,hour_to,isFull,lid,clicked,t_order)
{
	//动态处理表格宽度
	//document = parent.window.frames[2];
	document = document;

		//课表的处理

	//Summer session
	if(inUrl("/edu/student/elect/ShortSession.aspx")){
		//table_span = jQuery("#LessonTbl1_span1",document);
		table = jQuery(".alltab",document)[jQuery(".alltab",document).length - 2];
	}	
	else{
		table_span = jQuery("#LessonTbl1_spanContent,#lessonTbl_spanContent",document);
		table = jQuery(".alltab",table_span)[0];
	}
		
	
	
	tbody = table.children[0];
	tablex = getTop(table);
	tabley = getLeft(table);

	//trlist,0是表头,1~15是14节课
	trlist = tbody.children;

	//每行高度,0为表头
	cellheight = new Array();
	for(var n = 0;n < 15;n++){
		cellheight[n] = trlist[n].clientHeight;
	}

	//每格宽度,0为序号单元
	cellwidth = new Array();
	for(var n=0;n<8;n++)
	{
		cellwidth[n]=trlist[0].children[n].clientWidth+2;
	}
	//动态处理表格宽度 over
	

	posx=cellwidth[0];
	posy=0;
	
	weekday = Number(weekday);
	hour_from = Number(hour_from);
	hour_to = Number(hour_to);
	isFull = Number(isFull);
	clicked = Number(clicked);
	
	
	for(var n=1;n < weekday;n++)
		posx += cellwidth[n];
	for ( var n = 0; n < hour_from; n++) {
		posy += cellheight[n];
	}
	draw_height = 0;
	for ( var n = hour_from; n <= hour_to ; n++){
		draw_height += cellheight[n];
		
	}
	draw_width = cellwidth[weekday];
	
	if(t_order > 5)
	{
		draw_color = color[isFull][6 - 1];
	}
	else
	{
		draw_color = color[isFull][t_order - 1];
	}
	
	draw_obj = document.createElement("div");
	draw_id = "draw"+weekday+hour_from+hour_to+isFull;
	draw_obj.setAttribute("class","lsntable_draw");
	draw_obj.setAttribute("class",draw_id);
	draw_obj.setAttribute("lid",lid);
	draw_obj.setAttribute("clicked",clicked);
	draw_obj.innerHTML = lid + "_" + t_order;
	if(isFull == 0)
		draw_obj.innerHTML += "<br />未满";
	else
		draw_obj.innerHTML += "<br />满";
	
	jQuery("#LessonTbl1_spanContent,#lessonTbl_spanContent").append(draw_obj);
	//jQuery("#"+draw_id).css({"width":draw_width-border_width,"height":draw_height-border_width,"position":"absolute","top":posy+getTop(table),"left":posx+getLeft(table)+border_width,"border":border_width+"px solid "+draw_color})
	jQuery("."+draw_id,document).css({"width":draw_width - 3,"height":draw_height - 3 ,"position":"absolute","top":posy+getTop(table)+2,"left":posx+getLeft(table)+2,"background":draw_color,"font-size":"12px","opacity":"0.8","text-align":"center","border":"1px solid "+border_color[isFull]});

	
	
	
	
	
	/****************************************************
	 * 
	 * 
	 * 画小课表
	 * 
	 * 
	 * 
	 */

	//动态处理表格宽度
	document = document;
	smalltable_span = jQuery("#LessonTbl1_spanContent_small",document);
	//课表的处理
	table = jQuery(".alltab",smalltable_span)[0];

	
	tbody = table.children[0];
	tablex = getTop(table);
	tabley = getLeft(table);


	//trlist,0是表头,1~15是14节课
	trlist = tbody.children;

	//每行高度,0为表头
	cellheight = new Array();
	for(var n = 0;n < 15;n++){
		cellheight[n] = trlist[n].clientHeight;
	}

	//每格宽度,0为序号单元
	cellwidth = new Array();
	for(var n=0;n<8;n++)
	{
		cellwidth[n]=trlist[0].children[n].clientWidth+2;
	}
	//动态处理表格宽度 over
	

	posx=cellwidth[0];
	posy=0;
	
	weekday = Number(weekday);
	hour_from = Number(hour_from);
	hour_to = Number(hour_to);
	isFull = Number(isFull);
	clicked = Number(clicked);
	
	
	for(var n=1;n < weekday;n++)
		posx += cellwidth[n];
	for ( var n = 0; n < hour_from; n++) {
		posy += cellheight[n];
	}
	draw_height = 0;
	for ( var n = hour_from; n <= hour_to ; n++){
		draw_height += cellheight[n];
		
	}
	draw_width = cellwidth[weekday];
	if(t_order > 5)
	{
		draw_color = color[isFull][6 - 1];
	}
	else
	{
		draw_color = color[isFull][t_order - 1];
	}
	
	draw_obj = document.createElement("div");
	draw_id = "draw"+weekday+hour_from+hour_to+isFull;
	draw_obj.setAttribute("class","lsntable_draw");
	draw_obj.setAttribute("class",draw_id+"_small");
	draw_obj.setAttribute("lid",lid);
	draw_obj.setAttribute("clicked",clicked);
	draw_obj.innerHTML = lid + "_" + t_order;
	if(isFull == 0)
		draw_obj.innerHTML += "<br />未满";
	else
		draw_obj.innerHTML += "<br />满";
	tbody.appendChild(draw_obj);
	//这里与画大课表上的div不同，它已经有相对位置，因此只要加25的title高就ok
	jQuery("."+draw_id+"_small",document).css({"width":draw_width -3 ,"height":draw_height - 3,"position":"absolute","top":posy + 25 + 2,"left":posx + 2,"background":draw_color,"font-size":"12px","opacity":"0.8","text-align":"center","border":"1px solid "+border_color[isFull]});

}




function clearDraw_lid(lid)
{
	tables = jQuery("#LessonTbl1_spanContent,#LessonTbl_spanContent,#LessonTbl1_spanContent_small",document);
	jQuery("div[lid=" + lid + "]",tables).remove();

	//jQuery(".lsntable_draw").remove();
}

function clearDraw(clicked)
{
	tables = jQuery("#LessonTbl1_spanContent,#LessonTbl_spanContent,#LessonTbl1_spanContent_small",document);
	if(clicked == 0)
		jQuery("div[clicked=0]",tables).remove();
	else
		jQuery("div[clicked=1]",tables).remove();
	//jQuery(".lsntable_draw").remove();
}
function Trim(str,is_global) 
{ 
	var result; 
		result = str.replace(/(^\s+)|(\s+jQuery)/g,""); 
	if(is_global.toLowerCase()=="g") 
		result = result.replace(/\s/g,""); 
	return result; 
} 

function show_teacher_eval () {
	if(!inUrl("/edu/lesson/viewLessonArrange.aspx"))
		return;
	var lesson_tr = jQuery("#LessonTime1_gridMain").children().children().slice(1);
	for (var i = 0; i < lesson_tr.length; i++) {
			var name = lesson_tr.slice(i,i+1).children().slice(1,2).text();
			var app_str = name + " (";
			if (eval_list[name] == undefined) {
				app_str += "N/A)";
			}else{
				app_str += eval_list[name].slice(0,5) + ")";
			}
		lesson_tr.slice(i,i+1).children().slice(1,2).text(app_str);
	}

}


//通识课列表

GE_list = {'时装文化与流行鉴赏': 1, '创新与创业': 1, '创新与创业(2)': 1, '建筑艺术欣赏': 1, '艺术哲学': 1, '中西方建筑文化': 1, '中国美术史': 1, '认知艺术': 1, '生命伦理学': 1, '中医药与中华传统文化': 1, '认知科学与语言': 1, '大学语文': 1, '清代文祸与文化': 1, '精神分析与文学': 1, '文学与人生': 1, '中国传统经典的阅读与翻译': 1, '《论语》导读': 1, '中国古典小说名著解读': 1, '唐诗讲读': 1, '宋词经典赏析': 1, '小说与人生': 1, '中国现代文学与文化': 1, '中国古诗词': 1, '古典诗文选读': 1, '中国的世界文化与自然遗产': 1, '中国现代诗歌导读': 1, '文字中国': 1, '中国艺术史': 1, '古典诗文名篇选读': 1, '唐诗宋词人文解读': 1, '红楼梦研究': 1, '汉字文化': 1, '中国古典小说名著欣赏': 1, '唐宋诗词鉴赏': 1, '外国文学史（B类）': 1, '中国古代文学史': 1, '当代西方人文艺术思潮': 1, '西方宗教文化概论': 1, '中日科技文化交流': 1, '外国人眼里的中国与百年来的中外交流': 1, '韩国道德教育文化漫谈': 1, '文学与文化': 1, '台湾文学与文化': 1, '欧亚文化节庆研讨': 1, '遗产学－－世界艺术史及遗产在21世纪的全球性挑战': 1, '文学人类学': 1, '世界华文文学专题': 1, '书法艺术': 1, '篆刻艺术': 1, '翻译有"道"': 1, '英语写作': 1, '上海城的电影和音乐': 1, '电影美学导论': 1, '影视艺术理论及鉴赏': 1, '美国电影文化专题': 1, '海外华语电影鉴赏': 1, '影视文化与艺术': 1, '享受古典': 1, '动画导论': 1, '与风景的对话——中外园林艺术欣赏': 1, '德国社会史': 1, '西方音乐文化史': 1, '中国现代史重大问题研究': 1, '通俗明史': 1, '当代中国外交史': 1, '清史演义': 1, '外国美术史': 1, '晚期帝制中国：1279-1911': 1, '影像与历史': 1, '中西文化交流': 1, '世界历史名人评传': 1, '古罗马文明': 1, '日本近现代史': 1, '世界文明中的科学技术': 1, '欧洲文明史概论': 1, '中国儒学史': 1, '日本现代史': 1, '回忆录、口述史与二十世纪中国': 1, '城市文明史': 1, '欧洲中世纪城市研究': 1, '20世纪欧洲史': 1, '世界艺术史（1600年前）': 1, '新双城记：从上海看近代中国之历史与文明': 1, '近代世界发展史': 1, '1700-2000年新中国新历史': 1, '东京审判': 1, '美国历史上的重大问题': 1, '20世纪的世界': 1, '科学技术史': 1, '美国简史': 1, '认识自己': 1, '美学概论': 1, '从世界文学的视野反思中国现代文学': 1, '交响音乐鉴赏': 1, '古典音乐欣赏': 1, '欧洲古典音乐': 1, '音乐鉴赏': 1, '音乐鉴赏(B）': 1, '佛教与中国传统文化': 1, '宇宙论的历史与哲学': 1, '20世纪哲学': 1, '中西方医学哲学思想之比较': 1, '美学': 1, '西方哲学史': 1, '虚构的时代——对古典时期哲学的解读': 1, '哲学导论': 1, '国花、市花鉴赏': 1, '积极心理学': 1, '现代心理学': 1, '欧洲文明史': 1, '中国改革开放史': 1, '非洲文明': 1, '中国民俗': 1, '中国文化通论': 1, '中国历史地理': 1, '20世纪西方思想文化潮流': 1, '士人与中国社会': 1, '现代中国传媒与知识分子': 1, '全球化时代的英语学习与跨文化研究': 1, '民俗与中国文化': 1, '由李约瑟难题看中国传统科技文明': 1, '建国以来重大历史问题研究': 1, '伦理范畴的演绎及现代应用伦理的发展': 1, '本科生精神境况研究': 1, '欧美文化史': 1, '表演艺术欣赏与批评': 1, '英语视听说': 1, '英语写作能力的自我培养与提高': 1, '大学生传媒素养研究(B)': 1, '影视艺术': 1, '艺术设计': 1, '交响音乐的内涵与外延发展研讨': 1, '大学生传媒素养': 1, '体育锻炼与生活方式': 1, '现代西方哲学': 1, '我和“大师”面对面——追寻科学大家的成功轨迹': 1, '传播心理学': 1, '中国现代史': 1, '科学史上的竞争学说个案研讨': 1, '如何思考和解答李约瑟难题': 1, '西方美术与创新思维': 1, '艺术与科学：数字与信息化时代的艺术特征': 1, '美苏冷战争霸史': 1, '中国早期思想经典选读': 1, '西方现代文化思潮': 1, '美国华人简史': 1, '创意思维与设计': 1, '管理基础': 2, '微观经济学': 2, '电子商务基础': 2, 'WTO法律文件选读': 2, '网络环境下的文科信息检索': 2, '知识管理理论与实务': 2, '工程技术管理': 2, '中国管理智慧': 2, '管理经济学（A类）': 2, '国学与领导力发展': 2, '大学生创业基础': 2, '创新方法与实践': 2, '领导学': 2, '领导学(A类）': 2, '消费者行为学（A）': 2, '管理哲学': 2, '消费者行为学': 2, '从居住文化看世界史': 2, '遗传与社会': 2, '性与健康': 2, '普通心理学': 2, '市场营销学（A类）': 2, '管理心理学（B类）': 2, '市场调查与分析': 2, '技术经济学(B类)': 2, '管理学': 2, '项目管理': 2, '企业伦理学': 2, '风险管理': 2, '《论语》、《孟子》选讲': 2, '当代消费文化': 2, '文化多元主义与领导学': 2, '微观经济学（B类）': 2, '网络经济与管理': 2, '环境经济与管理（B类）': 2, '宏观经济学（B类）': 2, '西方经济学（B类）': 2, '工程经济学(F类)': 2, '发展经济学专题': 2, '一周财经评论': 2, '英文经济指标与指数阅读': 2, '经济学': 2, '中国经济专题': 2, '中国医疗保险制度转型（B类）': 2, '生态安全与生态文明': 2, '环保产业发展与卓越工程教育': 2, '金融学（A类）': 2, '证券投资学': 2, '证券投资分析(B类）': 2, '国际金融（A类）': 2, '证券投资分析': 2, '上海社会史专题': 2, '新闻与传播概论': 2, '大众传播与社会问题': 2, '网络传播学': 2, '两岸税制改革比较': 2, '知识产权管理': 2, '中国宪法的实施及其保障': 2, '国际法与国际秩序': 2, '大学生劳动就业中的法律问题探究': 2, '跨文化沟通心理学': 2, '市场营销学（C类）': 2, '城市管理概论': 2, '社会学概论': 2, '大国战略': 2, '当代中国外交经典案例分析': 2, '社会保障:理论基础与热点解读': 2, '中俄关系：过去、现在与未来': 2, '民族主义与族群政治': 2, '西方福利国家研究': 2, '现代城市发展论': 2, '当代国际社会热点问题透视': 2, '当代美国公共经济': 2, '政府与市场': 2, '中国政治思想史': 2, '全球化的政治经济学': 2, '国际安全': 2, '危机与公共关系': 2, '电影与政治': 2, '中国政治制度': 2, '公民社会与非政府组织': 2, '当代中国外交热点议题分析': 2, '政府公共关系原理与实践': 2, '国际关系学导论': 2, '当代中国政治发展': 2, '发展的政治经济学分析': 2, '国际关系理论导读': 2, '美国现代城市规划': 2, '当代中国的政治经济学': 2, '战后政府角色的变更': 2, '社会运动概论': 2, '宗教与社会': 2, '博弈论初基': 2, '社会观察与探索': 2, '政治社会学导论': 2, '领导力学习与实践': 2, '比较政治学导论': 2, '比较政治分析': 2, '治理之善：公共行政热点解析': 2, '新形势下的两岸关系专题研究': 2, '公共关系学概论': 2, '当代美国外交决策实例': 2, '现代日本政治': 2, '社会心理学': 2, '社会人口学': 2, '先锋艺术和城市': 2, '冷战与中国': 2, '日本社会与近代化': 2, '社会学与生活': 2, '日本社会与现代化': 2, '职业生涯发展与规划': 2, '科技伦理专题': 2, '美国社会与文化': 2, '上海社会与文化': 2, '社会学': 2, '管理理论与实践': 2, '国际关系与全球化问题刍议': 2, '台湾政治变化与两岸关系的前景(B)': 2, '环境热点专题': 2, '英美报刊时事评介': 2, '高跟鞋踩碎小猫脑袋：多学科的法律分析': 2, '知识产权的多维视角': 2, '国际金融法': 2, '多元化纠纷解决机制': 2, '台湾政治变化与两岸关系的前景': 2, '公共管理艺术探究': 2, '国际传播与对外报道(研讨)': 2, '政府治理危机与改革分析': 2, '叶利钦、普京与俄罗斯': 2, '中国崛起进程中的战争与战略问题': 2, '医药创新在国民经济中的角色': 2, '叶利钦、普京与俄罗斯(A)': 2, '活动策划组织艺术': 2, '现代中日关系': 2, '管理哲学研讨': 2, '政府治理转型与公民社会成长': 2, '不确定情况下的决策问题': 2, '经济学的思维方式': 2, '中国汽车制造业如何从大国走向强国': 2, '知识创新--新媒体时代的视角': 2, '多维视角看法律': 2, '中国新闻解读与中国问题研究': 2, '城市学入门': 2, '低碳发展的经济性思考': 2, '什么是数字新媒体产业(TMT)': 2, '商务沟通与道德': 2, '群体认知与群体行为': 2, '时政评论': 2, '反恐怖战略研究': 2, '经济全球化的分析视野': 2, '生物医药科技领域的创新与创业': 2, '生物产业的职业发展机会': 2, '绩效管理何以致胜：从个人、组织到区域': 2, '创业管理': 2, '孙子兵法': 2, '珠宝鉴赏': 3, '信息素养': 3, '创新方法': 3, '航空航天概论': 3, '化学电源的现状和未来展望': 3, '空气污染控制与洁净技术': 3, '生命科学导论实验': 3, '生命科学发展史': 3, '生物技术概论': 3, '微生物的世界': 3, '生物工程导论': 3, '植物育性、花发育和生物技术': 3, '脑的真相': 3, '生物信息学概论': 3, '从脑到行为': 3, '极端环境中的微生物生命': 3, '地球生命': 3, '社会精神医学': 3, '传统医学与人类健康': 3, '诺贝尔医学奖': 3, '现代医学导论': 3, '急救与自救技能': 3, '中国功夫与经络': 3, '信息与感知': 3, '光电科技与生活应用': 3, '工程实践与科技创新2A': 3, '工程实践与科技创新2B': 3, '工程实践与科技创新Ⅱ-A': 3, '工程实践与科技创新Ⅱ-B': 3, '材料力学发展、计算力学、哈密顿体系': 3, '环境工程导论（A类）': 3, '环境与健康': 3, '绿色技术的可持续发展分析': 3, '人与环境：可持续发展': 3, '企业信息化与知识工程': 3, '系统建模方法与应用': 3, '随机优化': 3, '数学之旅': 3, '工程技术拓展': 3, '现代制造中的质量管理与统计方法': 3, '汽车文化': 3, '制造创新': 3, '人类与核科技发展': 3, '宇宙科学导论': 3, '地球科学': 3, '主宰世界的七个方程': 3, '能源物理': 3, '物理异想': 3, '果壳中的量子场:起始编': 3, '科学前沿与哲学': 3, '中药学通论': 3, '杏林探宝---带你走进中药': 3, '新能源技术及应用': 3, '能源与可持续发展': 3, '科技传播与科普创作': 3, '科技前沿与热点': 3, '自然界中的混沌与分岔': 3, '可再生能源的高效转换与利用': 3, '核能与环境': 3, '先进核能系统': 3, '人与室内环境': 3, '奇妙的低温世界': 3, '从细胞到分子': 3, '植物生物技术——过去、现在和未来': 3, '植物嫁接理论与技术': 3, '原子核的内部结构': 3, '功能氧化物材料制备及晶体生长科学': 3, '探索复杂网络': 3, '普适数字学习': 3, '从环境监测谈科学研究': 3, '生态问题与研究': 3, '纳米世界的科学与艺术': 3, '动物运动和生长中的力学奥秘': 3, '生命科学热点': 3, '生物信息学、计算生物学前沿研讨': 3, '社会发展对生物工程的挑战': 3, '体验化学的魅力': 3, '能源化学工程': 3, '电化学能量储存与转化': 3, '研究者的乐趣和资质－以船、海工程为例': 3, '镁合金及其成形技术': 3, '21世纪工程人才的能力建设': 3, '植物病害诊断技术': 3, '材料科学的基本研究方法': 3, '多彩的纳米世界': 3, '走进纳米世界': 3, '神经科学前沿问题及信息学方法': 3, '遗传毒理与疾病': 3, '生命的奥秘－生物信息学前沿研讨': 3, '生物智能与生物计算机': 3, '走近生命科学技术领域': 3, '数学在水资源和环境科学研究中的价值': 3, '光子学与信息技术': 3, '核能发展与展望': 3, '全球气候变暖与二氧化碳减排': 3, '航空航天技术历史与展望': 3, '服务计算研讨': 3, '量子信息与移动通信': 3, '竞技运动中的科学技术': 3, '智能维护系统中的若干关键问题探讨': 3, '光纤通信与全光网技术的发展': 3, '在你身边的系统科学': 3, '人工心脏辅助系统初探': 3, '化学产品设计与实践': 3, '绝对零度的奇迹：超流与超导': 3, '智能材料、结构、系统与应用': 3, '生物智能与生物信息学': 3, '能源与环境': 3, '神奇的催化剂—新能源开发和环境净化中的催化技术': 3, '全球天然气发展与展望': 3, '健康与植物': 3, '吃出美丽和健康——食物营养与健康研讨': 3, '低温科学和技术': 3, '核能与环境(A)': 3, '科学与自然中的研究思想和方法探讨(A)': 3, '体验介孔材料': 3, '心血管力学生物学导论': 3, '中枢神经系统高级功能研究的最新进展': 3, '体验虚拟现实': 3, '超导体及其应用': 3, '基因追踪': 3, '高等植物中的信号转导': 3, '创新思维与现代设计': 3, '宇宙、自然与人类': 3, '系统生物学前沿研讨': 3, '生物医学制造与人工器官': 3, '新概念热学及其在过程优化中的应用': 3, '从手工创意到数字模型：技术与实践': 3, '未来工厂数字化运作管理系统': 3, '工业与环境微生物技探讨': 3, '药学、化学山海经': 3, '探测微观世界的手段和方法': 3, '现代农业与生态文明': 3, '农业有害生物防控的基因设计': 3, '汽车文化与设计哲学': 3, '人造器官与再生医学': 3, '生命科学中的化学反应:分子生物信息学前沿研讨': 3, '宇宙、自然与人类(A)': 3, '医工交叉学科前沿研讨': 3, '生命科学研究艺术': 3, '遗传发育与精神神经疾病': 3, '计算生物学与人体健康研究': 3, '“酶”的进化历程与未来': 3, '生物技术与我们的生活': 3, '工业与环境微生物技术': 3, '分子信息学前沿研讨': 3, '功能氧化物材料制备及晶体生长科学(A)': 3, '介孔材料': 3, '元素揭秘': 3, '组合优化入门': 3, '基因与人': 3, '21世纪企业制造模式-精益生产': 3, '汽车文化与设计哲学（A）': 3, '工程科学研究方法': 3, '摇橹船的力学': 3, '科学与自然中的研究思想与方法探讨': 3, '超临界流体的奇妙世界': 3, '多彩的纳米世界(A)': 3, '核燃料循环': 3, '纳米科技与未来世界': 3, '奇妙的低温世界（A）': 3, '汽车安全的技术与法律基础': 3, '汽车节能环保与清洁能源': 3, '体验虚拟现实（A）': 3, '生命科学中的计算化学：分子生物信息学前沿研讨': 3, '微生物基因组学与抗菌素耐药性': 3, '生命科学史': 3, '学习记忆及神经精神疾病的神经生物学': 3, '海洋科学': 3, '心血管疾病生物学': 3, '随机性、复杂性初探': 3, '新船型研究与探索': 3, '交通运输工程前沿': 3, '现代无线通信系统架构及新型应用': 3, '数字视频及其应用': 3, '信息技术百年回顾与展望': 3, '电化学与新能源汽车的未来': 3, '能源与环境系统工学导论': 3, '现代车辆新技术及发展趋势': 3, '脑的奥秘与精神健康': 3, '创新能力培养': 3, '营养、菌群与健康': 3, '现代社会发展中的人类健康问题之思考': 3, '从设计创意到数字模型：技术与实践': 3, '聚合物电介质': 3, '探访生命科学': 3, '物理学：传统与文化': 3, '材料的乐趣': 3, '行为遗传学研讨': 3, '数字图像处理': 3, '分形与混沌:复动力系统': 3, '食品、营养与健康': 3, '工业工程与管理艺术': 3, '能源与环境问题研讨': 3, '材料加工智能化发展引论': 3, '土木建筑与可持续发展': 3, '3S技术——遥感、导航与地理信息系统': 3, '信息光子学导论': 3, '植物信号转导及调控机制': 3, '干细胞与组织工程': 3, '微生物海洋学与极端生命': 3, '酶分子进化历程及其应用': 3, '二氧化碳资源化利用技术进展': 3, '自然启迪的材料制备科学': 3, '材料人生': 3, '核能及核安全': 3, '汽车概论': 3, '走进神秘的番茄世界': 3, '探索奇妙的蛋白质世界': 3, '多孔材料': 3, '能量转换——从瓦特蒸汽机到燃气轮机': 3, '车联网与智慧城市': 3, '新概念汽车探讨与设计': 3, '都市现代农业工程': 3, '纳米生物材料': 3, '海洋环境、生命与技术': 3, '电子废物-资源-环境': 3, '热物理学的建立与演化': 3, '先进核能系统材料：挑战与展望': 3, '植物生物技术:过去、现在和未来': 3, '全球变化概论:原因和应对策略': 3, '生命科学前沿新技术及其产业化': 3, '环境修复与人类健康': 3, '食品与工业微生物学': 3, '生物统计与医疗健康大数据前沿': 3, '转化医学研究中的生物统计': 3, '旅游地理学': 3, '数学史(A类)': 4, '符号动力系统与编码(A)': 4, '模糊数学及其应用': 4, '算法图论': 4, 'Mathematical Discovery': 4, '代数学及其在信息科学中的应用': 4, '数学赏析与唐诗格律': 4, '关于无穷性的数学考察': 4, '区间图，弦图以及其它': 4, '从区间谈起': 4, '二元域上的算术': 4, '组合数学选讲': 4, '': 0};

eval_list = {"Duane":"91.4786","Susan":"82.6492","Zimmer":"89.7963","丁兴华":"92.0468","丁希凡":"93.0307","丁晓萍":"85.3117","丁玲娣":"92.8125","万德成":"94.545","严亚贤":"96.346","乐经良":"97.7043","乔树通":"78.053","于文灏":"90.9283","于杨":"95.185","于江":"96.4805","于洪洁":"82.6345","于红妍":"97.2455","于随然":"93.718","井淼":"95.1623","仇毅翔":"92.4745","仇璘":"94.724","付宇卓":"94.625","仰书纲":"83.073","任吉存":"88.198","任天辉":"94.312","任奇志":"95.2075","任庆生":"94.9975","任玉雪":"89.8741","伍芳林":"93.648","何卫峰":"95.397","何圣兵":"92.732","何小刚":"96.818","何浩":"92.623","何涪嘉":"88.4267","何渊":"93.217","何艳":"96.3401","何迪":"92.858","何铭":"98.9085","余军扬":"91.8233","余征跃":"93.756","余文胜":"97.0447","余晓蔚":"93.741","余莉":"92.022","余颖":"95.584","佴怀青":"97.658","侯建荣":"90.443","俞勇":"98.0387","俞晖":"97.6495","俞炜":"92.283","倪安宁":"86.322","倪邦辉":"88.37","傅亚平":"91.945","傅学良":"81.9205","傅炯":"86.7117","傅育熙":"93.514","全林":"84.9652","关增建":"94.1445","其木提":"96.5357","冯仕猛":"95.9645","冯正平":"95.004","冯霞":"92.4315","凌德祥":"95.446","凌惠琴":"93.566","凌金铸":"88.8615","刘世前":"93.654","刘世勇":"96.354","刘东":"93.35","刘为":"89.492","刘乃实":"97.3283","刘伟":"98.608","刘佑军":"92.571","刘佳林":"86.8753","刘军荣":"83.269","刘功申":"88.502","刘华":"94.229","刘士林":"90.6617","刘小凯":"94.5277","刘帮成":"86.982","刘建华":"80.9023","刘振华":"92.7055","刘文江":"95.545","刘春颖":"94.5355","刘杨":"91.532","刘桦":"90.921","刘海涛":"89.7237","刘涛":"94.2145","刘滢":"87.975","刘立萍":"96.97","刘统":"98.4685","刘美香":"94.2389","刘群录":"93.8185","刘萍":"96.63","刘西拉":"98.189","刘龙根":"89.904","匡波":"95.0115","卓建伟":"95.8633","单世联":"96.087","单娟":"94.5693","卢俊国":"87.6015","卢小军":"94.7064","卢文发":"96.1533","卫淑芝":"94.6648","史为临":"96.3288","史子兴":"92.257","史小宁":"91.848","史清华":"89.198","史益敏":"92.618","叶冠林":"96.839","叶强":"95.2665","叶汉忠":"95.1134","司梅":"85.548","吉小军":"96.451","向光辉":"95.079","吕忆松":"97.657","吕晓俊":"88.5185","吕智国":"96.067","吕浩":"93.153","吕爱民":"87.441","吴亚妮":"97.5015","吴保华":"91.7525","吴冲锋":"96.8555","吴刚":"96.5493","吴剑锋":"76.2313","吴勇军":"91.7095","吴卫生":"89.599","吴天行":"91.466","吴家春":"91.6545","吴德意":"92.605","吴忠英":"89.476","吴慧英":"95.5655","吴新忠":"89.2684","吴明媛":"95.32","吴爱平":"90.0015","吴耀琨":"96.5975","吴诗玉":"90.9123","吴越":"93.286","吴迪":"95.954","吴静怡":"93.0212","周丕生":"86.321","周国华":"96.0722","周国强":"89.47","周宏":"91.2085","周岸勤":"93.4443","周希朗":"91.6253","周年国":"81.3486","周建国":"95.4352","周憬宇":"84.6425","周拥军":"90.3798","周春琴":"96.7885","周朝民":"92.5083","周栋焯":"96.499","周泽红":"91.731","周玉燕":"95.7893","周玲玲":"98.0037","周瑜":"88.0102","周越":"95.541","周越美":"68.3169","周钢":"97.7497","周锦鑫":"89.599","周颖":"92.6365","咸进国":"95.5643","唐东芹":"92.508","唐克轩":"98.596","唐宗明":"96.1657","喜苏南":"95.8585","夏中义":"87.1475","夏利娟":"97.009","夏玉蓉":"97.487","奚俊芳":"95.6555","奚立峰":"95.463","姚卫红":"93.7983","姚君喜":"95.033","姚天昉":"90.606","姚志红":"92.489","姚旭峰":"82.8658","姚晓敏":"93.152","姚欣保":"94.5292","姚武":"96.9392","姚淑平":"97.2298","姚莉秀":"90.113","姚莉韵":"91.3825","姚迪":"91.09","姚雷":"91.2005","姜淑忠":"92.88","姜淳":"93.46","姜翠波":"98.41","姜萍萍":"91.3735","姜静":"90.096","孔令体":"95.951","孔向阳":"92.492","孔繁强":"96.4895","孙同华":"89.23","孙坚":"93.251","孙扬":"95.686","孙涵":"92.8881","孙焱":"86.546","孙雁":"99.093","孟令兵":"91.6083","孟和":"96.3037","孟桂娥":"96.2738","孟玲玲":"89.5825","孟魁":"90.423","安丽桥":"91.1959","宋健":"92.2573","宋元斌":"93.34","宋宝瑞":"89.149","宋文滨":"94.485","宋春阳":"91.382","宋春雨":"91.539","宋晓冰":"95.401","宋苏晨":"94.0257","宣安":"92.9234","宦飞":"94.159","宫新保":"95.6475","宾凯":"95.856","寇新建":"96.049","尹梅":"90.5425","尹海涛":"96.139","崔勇":"95.7685","崔立":"86.614","左亚娜":"88.881","左晓岚":"79.763","市川智生":"92.975","席涛":"86.3102","庄天红":"92.4388","庄晖":"87.555","康东元":"88.8677","廖海波":"84.9297","张丹丹":"98.228","张丽清":"92.443","张亚光":"94.0373","张仁伟":"87.533","张健":"87.441","张光连":"92.3777","张兴福":"96.8987","张冬茉":"92.9469","张勇健":"90.681","张卫":"95.0145","张同珍":"93.7397","张君":"91.3233","张哲敏":"81.5299","张国良":"96.675","张士文":"94.493","张学昆":"86.425","张小凡":"94.0643","张峰":"94.2532","张帆":"96.652","张建华":"89.0937","张志刚":"93.7975","张忠能":"94.4615","张振南":"88.617","张晓君":"92.721","张晓梅":"93.2085","张晨利":"94.6985","张沁":"92.9288","张沛超":"95.612","张洁":"73.971","张海燕":"93.1243","张清":"92.104","张炽伟":"89.2615","张玉梅":"88.346","张祥":"91.2645","张立群":"90.0784","张绍谦":"99.378","张维竞":"96.519","张艳萍":"93.897","张荔":"96.1523","张菁":"95.1693","张蕴艳":"91.9966","张蕾":"91.2327","张辉":"89.807","张逸阳":"92.5373","张邻":"87.1693","张雪洪":"87.9245","张雪珍":"96.1756","张雷明":"95.678","张静抒":"92.8065","张鸿刚":"93.966","彭宏利":"89.462","彭崇胜":"87.4841","彭建平":"94.577","彭春露":"54.168","彭育波":"95.278","徐一峰":"93.381","徐临江":"90.2253","徐丽群":"85.1545","徐兵":"91.0108","徐宇虹":"89.639","徐峰":"88.6673","徐庆华":"94.0938","徐彦冰":"95.4287","徐昌庆":"96.427","徐榕":"86.7367","徐永福":"91.107","徐萍":"93.18","徐雄":"93.2505","戚嵘嵘":"97.545","戴力农":"88.4078","戴永明":"91.6277","文学武":"95.2704","方从启":"96.4985","方向忠":"96.041","方荣青":"96.0542","方青":"95.0988","施亮":"96.3295","施健":"95.2477","施光林":"94.6095","施立峻":"91.3453","施英":"84.4957","易新":"93.0317","易晓明":"91.609","曹其新":"92.2544","曹慧":"95.8064","曹林奎":"94.102","曹树基":"93.677","曹永康":"89.675","曹萌":"95.261","曹越平":"92.146","曹阳":"96.688","曾丽":"93.428","曾赛星":"89.848","曾进":"83.105","朱一凡":"94.302","朱丹":"88.4942","朱佐农":"98.4555","朱兰娟":"94.4413","朱兴和":"86.7423","朱其立":"95.522","朱军生":"78.789","朱凤军":"94.7495","朱南文":"95.563","朱卡的":"97.089","朱喜":"88.797","朱宁嘉":"78.018","朱小燕":"91.3707","朱建国":"90.2735","朱建明":"96.4379","朱慧芳":"96.4538","朱杰":"94.863","朱海洋":"95.1893","朱淑文":"93.679","朱疆":"94.1365","朱虹":"89.4285","朱金玉":"80.1043","朱黎青":"88.935","李丹":"91.175","李为民":"98.621","李云飞":"94.844","李亚纯":"92.5765","李亦中":"82.9707","李仕健":"86.978","李俊明":"94.0454","李健":"89.794","李先国":"94.313","李勇":"82.9875","李友林":"90.6645","李吉有":"94.7133","李大伟":"73.741","李宏德":"94.6025","李宝鸿":"92.688","李寿德":"91.0366","李少远":"97.528","李康化":"95.3202","李建勋":"92.507","李建国":"90.981","李志勇":"95.754","李敏":"69.134","李旭光":"88.8728","李明发":"93.441","李明明":"89.835","李春杰":"91.86","李春源":"94.6867","李晓荣":"93.7013","李晓静":"87.7973","李晟":"95.4675","李柏令":"84.2277","李梅":"94.3473","李欣":"95.2715","李武":"77.3687","李洁":"87.5625","李海刚":"85.6294","李海燕":"88.039","李淑慧":"85.666","李玉红":"94.942","李立学":"93.588","李红云":"97.299","李红泽":"96.9895","李翠莲":"92.8932","李艳婷":"93.686","李芳":"93.4715","李莉":"95.7228","李金叶":"93.46","李钢":"86.4075","李铜忠":"94.7553","李铮":"98.4985","李银生":"93.874","李鸿光":"97.644","李鹏程":"92.5093","杜婧":"92.2428","杜燕":"98.9733","杜秀华":"93.3755","杜红梅":"91.2115","束拉":"94.7042","杨一帆":"94.3425","杨仁康":"95.4277","杨启":"89.135","杨学灵":"94.545","杨小康":"91.248","杨小虎":"90.6743","杨峰":"93.828","杨忠直":"92.7323","杨文圣":"91.296","杨斌":"93.041","杨旭波":"94.3285","杨明":"94.559","杨晓玲":"88.227","杨海勇":"84.9958","杨立":"95.858","杨立桃":"79.526","杨若林":"98.027","杨镜非":"90.719","杨雨奇":"95.058","林冈":"97.05","林喜芬":"97.053","林峰":"94.702","林彦":"93.051","林文胜":"84.003","林玉珍":"91.9535","林玲":"81.969","林赫":"95.112","林迅":"83.2277","柏亚东":"88.7388","柳存根":"86.542","柴康敏":"92.7","柴杰":"89.0703","梁培基":"98.023","梁建":"85.57","梁进":"98.632","梁阿磊":"96.4425","樊博":"93.501","武同锁":"98.596","武时颖":"86.129","武爱文":"95.4027","武素珍":"91.293","武邦涛":"95.519","殳国华":"93.07","段沫":"93.253","段海娟":"80.222","毛义梅":"95.1223","毛建军":"92.0214","江志斌":"87.167","江毅":"94.8392","江秀臣":"82.594","汤晓敏":"94.942","汤石章":"93.4042","汪云霞":"92.7698","汪国山":"90.914","汪国琴":"98.392","汪济生":"83.949","汪蓉":"89.353","汪雨申":"98.5488","汪静":"98.425","沈亚丽":"94.6718","沈吟菲":"91.7052","沈备军":"92.306","沈延兵":"81.751","沈思玮":"88.3027","沈惠璋":"98.041","沈水龙":"95.918","沈灏":"98.658","沈炎":"95.9","沈玮":"94.7977","沈琦":"94.257","沈豪":"93.08","洪嘉振":"96.12","浦耿强":"93.543","滕念管":"94.16","滕金芳":"96.1255","潘倩菲":"92.146","潘卫国":"95.3994","潘星辉":"77.594","潘玉春":"93.965","潘理":"90.267","熊德文":"97.832","牛金海":"89.73","王业":"95.155","王丰华":"89.641","王丽亚":"88.1895","王云":"93.8837","王亚光":"95.356","王亚林":"93.441","王伟明":"93.3317","王俊雄":"88.423","王俏华":"75.6675","王健":"97.8215","王先林":"90.2513","王卓":"91.88","王君艳":"97.7213","王哲希":"91.7547","王嘉松":"92.859","王国庆":"95.3853","王培丞":"96.4715","王增琦":"94.543","王宇":"92.58","王宏卫":"69.9416","王平":"95.9642","王建华":"94.4905","王彤":"98.168","王彪":"83.357","王德禹":"90.04","王志新":"86.8985","王恒安":"92.69","王惠":"95.558","王承国":"97.107","王振元":"90.4267","王敏":"87.661","王文":"91.34","王斌":"95.1633","王新兵":"92.096","王昊":"93.298","王昕":"97.7017","王春艳":"95.3225","王晓敏":"94.415","王晓骏":"95.7456","王朝霞":"96.5115","王梦月":"95.678","王欣":"90.493","王正武":"91.397","王毓伦":"94.7398","王泽民":"91.3264","王浩伟":"98.208","王灿华":"93.648","王炜":"93.4618","王爱民":"86.383","王玉璋":"93.607","王玮":"94.1352","王玲":"89.3325","王瑾晔":"88.039","王立河":"92.27","王纪林":"98.7454","王群慧":"90.2191","王芳":"85.0337","王英林":"85.989","王英萍":"95.5105","王茕":"95.386","王莲芸":"96.5234","王西田":"79.216","王赓":"94.258","王轶骏":"91.965","王辉":"95.192","王郁":"90.481","王铭":"96.7807","王雅卓":"93.1119","王青":"94.294","王韶阳":"74.0831","王骏":"88.937","甄凤超":"95.4542","田作华":"96.303","田社平":"97.9095","田艳":"93.7498","由德林":"90.472","申哲民":"89.843","申晓辉":"92.508","白晓慧":"87.2197","白林泉":"90.213","盛戈皡":"93.161","盛翀":"92.009","石凯民":"96.5179","石桂峰":"92.987","祝永新":"97.431","祝薇":"91.4083","秦丹尼":"92.804","秦向东":"96.9805","程晓鸣":"94.58","程江":"92.994","程金平":"94.064","章仰文":"95.7795","章伟":"92.9177","章毅":"94.505","章烨":"94.2417","章璞":"98.423","童剑平":"89.7843","童清艳":"83.675","符杰祥":"89.147","纪小凌":"93.5453","纪志刚":"93.2114","缪毅强":"97.3575","罗依琪":"98.0162","罗先金":"86.083","罗利文":"95.18","翁惠玉":"96.7553","翁正新":"97.385","翟宜疆":"88.0295","翟新":"92.1987","肖双九":"94.3285","肖国芳":"96.0198","肖柳青":"94.203","肖湘":"96.769","胡代平":"91.8905","胡全生":"78.05","胡其图":"96.2892","胡国新":"92.881","胡奕明":"92.854","胡巍":"92.157","胡延东":"73.62","胡建升":"84.7635","胡开宝":"90.31","胡慈舟":"93.2601","胡文蓉":"95.387","胡晓芳":"88.904","胡洪波":"92.1835","胡润忠":"94.084","胡涵锦":"95.6305","胡逸薇":"96.5335","胡飞":"95.57","舒谋海":"95.552","艾青":"95.262","苏晓静":"87.9665","苏竞元":"96.0665","苑波":"95.63","苗瑞":"91.029","范卫东":"84.97","范同祥":"92.938","范援朝":"94.241","范春菊":"96.3275","范纯增":"84.761","范黎坤":"95.2253","茅旭初":"97.5947","荆建平":"95.262","荣国光":"87.232","萧冰":"93.3147","董占勋":"88.8842","董占海":"98.5346","董常明":"88.016","董扬":"93.9637","董晓蕾":"95.2703","董笑菊":"93.948","蒋丹":"96.0693","蒋乐天":"94.989","蒋启芬":"96.6445","蒋建伟":"95.278","蒋怡":"90.284","蒋立峰":"96.108","蒋红珍":"95.978","蒋静":"88.093","蒯琳萍":"94.396","蔡伟":"95.868","蔡明超":"91.391","蔡润":"92.146","蔡申瓯":"93.352","蔡皿":"95.6208","蔡艳":"93.9155","蔡英文":"92.18","蔡萍":"91.376","蔡骏":"96.892","蔡鸿明":"94.855","薛可":"93.3033","薛广涛":"88.088","薛敏钊":"96.813","薛质":"97.389","袁斌":"95.412","袁晓忠":"98.3017","袁焱":"96.543","袁笃平":"96.771","裘兆泰":"99.0825","褚建君":"94.0895","覃筱":"85.962","解大":"96.192","訾小超":"87.7053","计钢":"92.1615","许亭方":"84.2433","许希阳":"79.051","许建平":"92.2495","许永国":"79.9754","诸勤敏":"92.871","谈毅":"96.959","谢小敏":"83.493","谢少艾":"96.4176","谢憬":"96.225","谢维敏":"97.2482","谢芳":"95.959","谢萍":"92.6483","谢金文":"84.5955","贺光":"95.462","贺志豪":"96.73","贾婷":"90.1597","赖晓阳":"94.342","赵一雷":"96.355","赵亚平":"95.85","赵亦希":"90.704","赵俊":"83.1725","赵俐俐":"94.976","赵冬梅":"98.06","赵加强":"96.5118","赵增铃":"96.178","赵文杰":"95.5932","赵文辉":"75.491","赵斌元":"96.214","赵新明":"96.2779","赵旭":"93.422","赵晓红":"90.0481","赵海":"83.923","赵社戍":"93.233","赵立平":"99.391","赵群飞":"94.877","赵耕春":"92.2382","赵艾萍":"96.3813","赵言正":"94.3475","车生泉":"92.725","车驰东":"97.232","辛玉梅":"95.0728","过敏意":"95.595","邓大萌":"94.268","邓林":"91.7444","邓真全":"96.2485","邰能灵":"94.569","邱卫东":"91.825","邱意弘":"92.637","邱江平":"83.875","邵国年":"96.365","邵奇":"92.5836","邹丽芳":"79.855","邹礼瑞":"93.2305","郑伟丽":"65.5265","郑华":"93.4775","郑思珣":"97.268","郑杭":"96.07","郑益慧":"98.9565","郑育家":"88.0537","郑铭洪":"96.2858","郑飞洲":"90.853","郭为忠":"94.441","郭俊华":"94.7378","郭兴伍":"94.1","郭圣荣":"88.107","郭恋东":"86.7675","郭鸿杰":"94.4126","都岚岚":"76.7333","金之俭":"94.055","金慧子":"96.638","金拓":"93.1427","金文峰":"96.7603","金朝晖":"92.339","金桥":"92.6508","钮卫星":"92.5026","钱冬":"94.032","钱秀萍":"95.32","钱良":"97.259","钱静峰":"97.8274","闫成":"96.3205","闫超":"93.99","闻媛":"91.1564","阎峰":"92.0255","阎建民":"93.3755","陆元雯":"90.2102","陆宏弟":"96.5443","陆岩军":"89.7303","陆德阳":"82.194","陆晨兮":"90.7883","陆朝俊":"94.1941","陆松年":"91.5445","陆海宁":"92.31","陆莹":"86.5357","陆蓓":"94.66","陆顺寿":"94.895","陈业新":"92.6374","陈先元":"81.8905","陈先阳":"78.6915","陈克应":"96.6423","陈克非":"96.929","陈兵":"91.937","陈列文":"93.476","陈刚":"95.1065","陈华栋":"96.1598","陈尧":"92.913","陈峰":"93.3075","陈峻":"94.652","陈崇君":"95.185","陈幼平":"90.061","陈德民":"87.2577","陈捷":"88.4385","陈斌":"96.286","陈新兴":"80.764","陈春丽":"93.322","陈景秋":"90.2356","陈梅":"87.349","陈欣":"93.812","陈永国":"90.861","陈海峰":"96.037","陈火英":"94.457","陈猛":"93.865","陈玉泉":"91.7804","陈玲玲":"96.312","陈璐":"82.5555","陈翌佳":"96.841","陈英":"94.6027","陈贤峰":"97.759","陈贤浩":"89.8955","陈进":"95.798","陈鑫":"79.74","陈钢":"94.399","陈霆":"84.3323","陈露":"91.3757","陈飞翔":"93.633","陈鹏":"96.1904","陈龙珠":"89.078","陶亚民":"93.573","陶庆":"91.0583","陶昉敏":"96.3383","雷华明":"87.329","雷敏":"90.064","韦平":"89.012","韩东":"92.559","韩丽川":"96.4987","韩伟":"92.648","韩兵":"96.472","韩长印":"94.912","韩韬":"95.544","顾剑平":"95.5286","顾剑锋":"94.8065","顾孟迪":"90.56","顾建光":"92.243","顾志霞":"93.544","顾惠忠":"95.3677","顾振宇":"76.866","顾春明":"93.049","顾根生":"93.7392","顾海英":"95.4135","顾琪龙":"94.278","顾祝轩":"92.5715","顾顺超":"94.9433","颜世富":"90.24","饶柱石":"85.168","饶若楠":"76.437","马伟":"94.6025","马伟敏":"92.299","马文军":"85.9175","马春翔":"91.817","马殿光":"96.7823","马玉蕾":"90.59","马紫峰":"94.8665","马红冰":"91.2567","马荔":"95.3591","马进":"95.217","马连芳":"93.1404","高云":"91.589","高亚祯":"91.2445","高佩荪":"92.0803","高圣彬":"88.889","高宗仁":"91.903","高峰":"92.9175","高景":"96.8694","高林杰":"80.644","高福进":"93.295","魏云盘":"95.7185","魏啸飞":"89.0568","魏武挥":"92.8717","魏陆":"85.6735","鲍金":"92.1813","黄丞":"85.6508","黄丹枫":"94.1133","黄伟力":"92.4323","黄其煜":"84.704","黄坚":"82.716","黄孟娇":"97.8495","黄少军":"92.4305","黄庆桥":"97.7903","黄建国":"94.8153","黄建香":"95.4935","黄成军":"90.321","黄晓艳":"87.4933","黄永华":"96.344","黄清发":"83.2587","黄琪轩":"96.285","黄真":"95.793","黄继红":"82.4745","黄苏飞":"96.4918","黄采金":"94.6868","黄钢":"96.8402","齐开悦":"95.9575","龙新华":"91.369","龚玲":"97.4455"}

