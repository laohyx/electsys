/**
 * Electsys++ Project
 * ----------------------------
 * 评教优化模块
 */

// 快速评教，不用蛋疼点下一步了~
function fast_eval_index () {
	if (!inUrl("/edu/N10_pingjiao/N4_pingjiaoXKLB.aspx"))
		return;
	var eval_table = jQuery("table").slice(3,4).find("table");
	var trs = eval_table.find("tr");
	for (var i = 1; i < trs.length; i++) {
		trs.slice(i,i+1).children().slice(2,3).css("width","120px");
		var alink = trs.slice(i,i+1).children().slice(2,3).children().clone(true);

		alink.text("快速评教");
		alink.css("margin-left","1em");
		alink.attr("href",alink.attr("href") + "#laohyx_fast_eval");
		trs.slice(i,i+1).children().slice(2,3).append(alink);
	};
}

function fast_eval_process () {
	if(!inUrl("#laohyx_fast_eval"))
		return;
    if (!inUrl("/edu/N10_pingjiao/N4_pingjiao.aspx"))
		return;
	//增加分数联动功能
	jQuery("#sBoundControl_1_1").parent().css("width","120px");
	jQuery("#sBoundControl_1_1").parent().append('<input type="checkbox" id="fast_eval_interlock" checked="checked"/><lable for="fast_eval_interlock">分数联动</lable>');

	
	document.intervalID = setInterval(function(){
		if(jQuery('.ui-label').text() == "100%"){
			clearInterval(document.intervalID);
			jQuery("#sText_1_1_railElement").click(function(){
				jQuery("#sBoundControl_1_1").trigger("change");
			});
			jQuery("#sBoundControl_1_1").change(function(){
				var first_eval = jQuery(this).val();
				fast_eval_interlock(first_eval);
			});
		}
		
		//显示全部表单
		jQuery("input").removeAttr("disabled");
		areaSelector = "#t1,#t2,#t3";
		areas = jQuery(areaSelector);
		heads = areas.prev();
		areas.children("tbody").children("tr").show();
		heads.show();
		areas.show();
		jQuery(".ui-progress").animate({width: '100%'}, 
		{duration: 500,easing: 'swing'});
		jQuery(".ui-progress").children().text("100%");
	},300);	
}

function fast_eval_interlock(eval_num){
	console.log(jQuery("#fast_eval_interlock").prop("checked"));
	if(!jQuery("#fast_eval_interlock").prop("checked"))
		return;
	var eval1 = eval_num;
	var eval2 = Math.round(eval1 / 10);
	jQuery("#sText_1_2").val(eval1);
	jQuery("#sText_1_3").val(eval1);
	jQuery("#sText_2_1").val(eval2);
	jQuery("#sText_2_2").val(eval2);
	jQuery("#sText_2_3").val(eval2);
	jQuery("#sText_2_4").val(eval2);
	jQuery("#sText_2_5").val(eval2);
	jQuery("#sText_2_6").val(eval2);
	jQuery("#sText_2_7").val(eval2);
	jQuery("#sText_2_8").val(eval2);
	jQuery("#sText_2_9").val(eval2);
	jQuery("#sText_2_10").val(eval2);
	
	jQuery("#sBoundControl_1_2").val(eval1);
	jQuery("#sBoundControl_1_3").val(eval1);
	jQuery("#sBoundControl_2_1").val(eval2);
	jQuery("#sBoundControl_2_2").val(eval2);
	jQuery("#sBoundControl_2_3").val(eval2);
	jQuery("#sBoundControl_2_4").val(eval2);
	jQuery("#sBoundControl_2_5").val(eval2);
	jQuery("#sBoundControl_2_6").val(eval2);
	jQuery("#sBoundControl_2_7").val(eval2);
	jQuery("#sBoundControl_2_8").val(eval2);
	jQuery("#sBoundControl_2_9").val(eval2);
	jQuery("#sBoundControl_2_10").val(eval2);
	var width1 = Number(jQuery("#sText_1_2_handleImage").parent().parent().css("width").slice(0,-2));
	var width2 = Number(jQuery("#sText_2_1_handleImage").parent().parent().css("width").slice(0,-2));
	jQuery("#sText_1_2_handleImage").parent().css("left",eval1 / 100 * width1 + "px");
	jQuery("#sText_1_3_handleImage").parent().css("left",eval1 / 100 * width1 + "px");
	jQuery("#sText_2_1_handleImage").parent().css("left",eval2 / 10 * width2 + "px");
	jQuery("#sText_2_2_handleImage").parent().css("left",eval2 / 10 * width2 + "px");
	jQuery("#sText_2_3_handleImage").parent().css("left",eval2 / 10 * width2 + "px");
	jQuery("#sText_2_4_handleImage").parent().css("left",eval2 / 10 * width2 + "px");
	jQuery("#sText_2_5_handleImage").parent().css("left",eval2 / 10 * width2 + "px");
	jQuery("#sText_2_6_handleImage").parent().css("left",eval2 / 10 * width2 + "px");
	jQuery("#sText_2_7_handleImage").parent().css("left",eval2 / 10 * width2 + "px");
	jQuery("#sText_2_8_handleImage").parent().css("left",eval2 / 10 * width2 + "px");
	jQuery("#sText_2_9_handleImage").parent().css("left",eval2 / 10 * width2 + "px");
	jQuery("#sText_2_10_handleImage").parent().css("left",eval2 / 10 * width2 + "px");



}



// 快速评教 for 期中
function fast_eval_midterm_index () {
	if (!inUrl("/edu/N10_pingjiao/Midterm_pingjiaoXKLB.aspx"))
		return;
    console.log("midterm");
	var eval_table = jQuery("table").slice(3,4).find("table");
	var trs = eval_table.find("tr");
	for (var i = 1; i < trs.length; i++) {
		trs.slice(i,i+1).children().slice(2,3).css("width","120px");
		var alink = trs.slice(i,i+1).children().slice(2,3).children().clone(true);

		alink.text("快速评教");
		alink.css("margin-left","1em");
		alink.attr("href",alink.attr("href") + "#laohyx_fast_eval");
		trs.slice(i,i+1).children().slice(2,3).append(alink);
	};
}


function fast_eval_midterm_process () {
	if(!inUrl("#laohyx_fast_eval"))
		return;
    if (!inUrl("/edu/N10_pingjiao/Midterm_pingjiao.aspx"))
		return;

	//增加分数联动功能
	jQuery("#sBoundControl_2_1").parent().css("width","120px");
	jQuery("#sBoundControl_2_1").parent().append('<input type="checkbox" id="fast_eval_interlock" checked="checked"/><lable for="fast_eval_interlock">分数联动</lable>');
    
	console.log("midterm_process");
	
    document.intervalID = setInterval(function(){
        console.log("not readey");
		if(jQuery("#sText_2_1_railElement").length == 1){
            clearInterval(document.intervalID);
            console.log("clear");
			jQuery("#sText_2_1_railElement").click(function(){
                jQuery("#sBoundControl_2_1").trigger("change");
            });

            jQuery("#sBoundControl_2_1").change(function(){
                var first_eval = jQuery(this).val();
                fast_eval_midterm_interlock(first_eval);
            });

		}
		
    },300);	

    
    }


function fast_eval_midterm_interlock(eval_num){
	console.log(jQuery("#fast_eval_interlock").prop("checked"));
	if(!jQuery("#fast_eval_interlock").prop("checked"))
		return;
	var eval1 = eval_num;
	var eval2 = Math.round(eval1);
	jQuery("#sText_2_2").val(eval2);
	jQuery("#sText_2_3").val(eval2);
	jQuery("#sText_2_4").val(eval2);
	jQuery("#sText_2_5").val(eval2);
	jQuery("#sText_2_6").val(eval2);
	jQuery("#sText_2_7").val(eval2);
	jQuery("#sText_2_8").val(eval2);
	jQuery("#sText_2_9").val(eval2);
	jQuery("#sText_2_10").val(eval2);
	
	jQuery("#sBoundControl_2_2").val(eval2);
	jQuery("#sBoundControl_2_3").val(eval2);
	jQuery("#sBoundControl_2_4").val(eval2);
	jQuery("#sBoundControl_2_5").val(eval2);
	jQuery("#sBoundControl_2_6").val(eval2);
	jQuery("#sBoundControl_2_7").val(eval2);
	jQuery("#sBoundControl_2_8").val(eval2);
	jQuery("#sBoundControl_2_9").val(eval2);
	jQuery("#sBoundControl_2_10").val(eval2);
	var width2 = Number(jQuery("#sText_2_1_handleImage").parent().parent().css("width").slice(0,-2));

	jQuery("#sText_2_2_handleImage").parent().css("left",eval2 / 10 * width2 + "px");
	jQuery("#sText_2_3_handleImage").parent().css("left",eval2 / 10 * width2 + "px");
	jQuery("#sText_2_4_handleImage").parent().css("left",eval2 / 10 * width2 + "px");
	jQuery("#sText_2_5_handleImage").parent().css("left",eval2 / 10 * width2 + "px");
	jQuery("#sText_2_6_handleImage").parent().css("left",eval2 / 10 * width2 + "px");
	jQuery("#sText_2_7_handleImage").parent().css("left",eval2 / 10 * width2 + "px");
	jQuery("#sText_2_8_handleImage").parent().css("left",eval2 / 10 * width2 + "px");
	jQuery("#sText_2_9_handleImage").parent().css("left",eval2 / 10 * width2 + "px");
	jQuery("#sText_2_10_handleImage").parent().css("left",eval2 / 10 * width2 + "px");



}


