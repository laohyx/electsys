
const INTERVAL_DEFAULT = 1600;
const INTERVAL_STEP = 200;

function post(url,data,lid)
{	
/*	if (localStorage["lesson_enable"] == undefined || localStorage["lesson_enable"] == 0) {
        return 0;
    };
*/
    g_ajax_sending = true;
    jQuery.ajax({
        type: 'POST',
        url: url,
        data: data,
        async: true,
        success: function (data, res) {
            g_ajax_sending = false;
            processArrangement(data, lid, url);
        },
        error: function (data) {
            g_ajax_sending = false;
            console.log("error", data);
        },
        dataType: "html"
    });
    
    return 0;
}

    
//颜色对照表
color = [];
color[0] = ["#84C1FF","#84C1FF","#84C1FF","#84C1FF","#84C1FF","#84C1FF","#84C1FF"]
color[1] = ["#ff7575","#ff7575","#ff7575","#ff7575","#ff7575","#ff7575","#ff7575"]
border_color = [];
border_color[0] = "blue";
border_color[1] = "red";

//查询缓存
var g_arrange_cache = {};
var g_last_query_success = new Date().getTime() - INTERVAL_DEFAULT;
var g_ajax_sending = false;

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
    jQuery("input[type=\"checkbox\"]").prop('checked', true);

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
    jQuery('body').append('<div id="electsys_view_lesson"></div>');
    
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
        jQuery(radiogroup[radio_index]).click(function () {
            var lid = this.value;
            var me = this;

            // 有缓存的情况下直接加载缓存页面
            console.log(g_arrange_cache, lid);
            if (g_arrange_cache.hasOwnProperty(lid)) {
                var cache = g_arrange_cache[lid];
                var now = new Date().getTime();
                console.log(cache.expire > now);
                if (cache.expire > now) {
                    // 更改 pushstate
                    window.history.replaceState({lid: lid}, 'speltyGeneralCourse', url);
                    window.history.pushState(null, 'viewLesson', url);

                    // 页面回退
                    window.onpopstate = function(event) {
                        if (event.state.lid) {
                            jQuery('#Table1').show();
                            jQuery('#st_fixed_div').show();
                            jQuery('#electsys_view_lesson').html('');

                            // 清除原先加的提示颜色
                            clearDraw_lid(lid);
                            jQuery(me).parent().parent().parent()
                                .attr('style', '')
                                .removeAttr('clicked');
                            // 取消选中
                            jQuery(me).prop('checked', false);
                        }
                    };

                    // 处理新页面
                    var body = cache.html
                        .replace(/\.\.\//g, '../../')
                        .replace(/(\w+).aspx/g, '../../lesson/$1.aspx');
                    var bodyStart = body.indexOf('<form name="viewLesson"');
                    var bodyEnd = body.lastIndexOf('</form>');
                    body = body.substring(bodyStart, bodyEnd + '</form>'.length);

                    // 加载新页面
                    jQuery('#electsys_view_lesson').html(body);
                    jQuery('#Table1').hide();
                    jQuery('#st_fixed_div').hide();

                    return;
                }
            }

            setTimeout(function () {
                jQuery("input[value=课程安排]").trigger("click"); 
            }, 400);
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

    document.processInterval = INTERVAL_DEFAULT;
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
        var now = new Date().getTime();
        var diff = g_last_query_success + document.processInterval - now;
        if (g_ajax_sending) {
            diff += document.processInterval;
        }

        // 如果没有在限制频率内，则直接查询，加快速度
        setTimeout(function () {
            processLidQueue();	// POST first
            setInterval("processLidQueue();", document.processInterval);
        }, Math.max(0, diff) + 100);
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

function processArrangement(html, lid, url)
{
    //判断是否有错误提示
    var error_pattern = new RegExp("<span id=\"lblMessage\" .*?>(.*?)</span>");
    var error_match = error_pattern.exec(html);
    if(error_match != null)
    {
        var error_message = error_match[1];
        console.log(error_message);

        if(error_message.indexOf("不能继续增加通识课") > -1){
            // 记录接受到响应的时间
            g_last_query_success = new Date().getTime();

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
        document.processInterval += INTERVAL_STEP;
        console.log(document.processInterval);
        clearAllInterval();
        setInterval("processLidQueue();", document.processInterval);

        return;
    }

    // 记录接受到响应的时间
    g_last_query_success = new Date().getTime();
    // 缓存查询结果
    g_arrange_cache[lid] = {
        url: url,
        html: html,
        expire: g_last_query_success + document.processInterval
    };

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
