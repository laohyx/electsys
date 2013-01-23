opscore_year = "2012-2013";
opscore_semester = "1";

function optimize_gpa_query(){
    if(!inUrl("/edu/StudentScore/StudentScoreQuery.aspx"))
        return 0;
	if(jQuery("#ddlXN").val() == "2010-2011" && jQuery("#ddlXQ").val() == "1" && !has_result_table()){
		jQuery("#ddlXQ").find("[selected=selected]").removeAttr("selected");
		jQuery("#ddlXN").find("[selected=selected]").removeAttr("selected");

		jQuery("#ddlXN").find("option[value="+opscore_year+"]").attr("selected","selected");
		jQuery("#ddlXQ").find("option[value="+opscore_semester+"]").attr("selected","selected");

	}
    if(!has_result_table())
		return;
    jQuery("table#dgScore").find("tr").slice(1).css("height","25px");
    
    jQuery("#Table4").find("tr").after(jQuery('<tr><td height="26"></td><td class="tdline1" align="left" style="font-size:12px;">选中课程GPA：<span id="avg_score" >0</span>分<a id="select_all_lessons" href="#" all="0" style="margin-left:2em;">全选</a></td></tr>'));
    
    //算gpa
    var score_tr_list = jQuery("tr[style$=height\\:\\ 25px\\;]");
    score_tr_list.mouseover(function(){
            jQuery(this).css("background-color","#CFC");
	});
    score_tr_list.mouseout(function(){
        if(jQuery(this).attr("clicked") == "1")
            jQuery(this).css("background-color","#FC9");
        else
            jQuery(this).css("background-color","");
	});
	
	jQuery("#select_all_lessons").click(function(){
	if(jQuery(this).attr("all") == 1){
		jQuery(this).text("全不选");
		jQuery(this).attr("all","-1");
		score_tr_list.attr("clicked","0");
		score_tr_list.css("background-color","");
	}else{
		jQuery(this).text("全选");
		jQuery(this).attr("all","1");
		score_tr_list.attr("clicked","1");
		score_tr_list.css("background-color","#FC9");
	
	}
		
		//算选中的gpa
        avg_score = calculate_selected_gpa();
        //显示出来
        jQuery("#avg_score").text(avg_score.toFixed(2));
	});
	
	
	score_tr_list.click(function(){
		if(jQuery(this).attr("clicked") == "1"){
			jQuery("#select_all_lessons").attr("all","0");
			jQuery("#select_all_lessons").text("全选");
            jQuery(this).css("background-color","");
			jQuery(this).attr("clicked","0");
		}else{
            jQuery(this).attr("clicked","1");
            jQuery(this).css("background-color","#FC9");
		}
        
        
        //算选中的gpa
        avg_score = calculate_selected_gpa();

        //显示出来
        jQuery("#avg_score").text(avg_score.toFixed(2));
	});
}
function calculate_selected_gpa(){
	//算选中的gpa
	var score_tr_list_valid = jQuery("tr[clicked=1]");
	var lsn_score = [];
	var unit;
	var score;
	for(var x = 0; x < score_tr_list_valid.length; x++){
		var tr = score_tr_list_valid.slice(x,x+1);
		unit = Number(tr.children().slice(3,4).text());
		score = Number(tr.children().slice(4,5).text());
		lsn_score.push({"unit":unit,"score":score});
	}
	var unit_sum = 0;
	var score_sum = 0;
	var avg_score;
	for(var x = 0; x < lsn_score.length; x++){
		unit_sum += lsn_score[x]["unit"];
		score_sum += lsn_score[x]["score"] * lsn_score[x]["unit"];
	}
	if(unit_sum == 0)
		avg_score = 0;
	else
		avg_score = score_sum / unit_sum;
	//console.log(avg_score);
	return avg_score;
}
function optimize_score_query(){
    if(!inUrl("/edu/StudentScore/B_StudentScoreQuery.aspx"))
        return 0;
	
	//把1学期改成2.。。
	if(jQuery("#ddlXN").val() == "2010-2011" && jQuery("#ddlXQ").val() == "1" && !has_result_table()){
		jQuery("#ddlXQ").find("[selected=selected]").removeAttr("selected");
		jQuery("#ddlXN").find("[selected=selected]").removeAttr("selected");

		jQuery("#ddlXN").find("option[value="+opscore_year+"]").attr("selected","selected");
		jQuery("#ddlXQ").find("option[value="+opscore_semester+"]").attr("selected","selected");

	}

    if(!has_result_table())
		return;
    
    jQuery("#Table4").find("tr").after(jQuery('<tr><td height="26"></td><td class="tdline1" align="left" style="font-size:12px;">选中课程平均成绩：<span id="avg_score" >0</span>分<a id="select_all_lessons" href="#" all="0" style="margin-left:2em;">全选</a></td></tr>'));
    
    //算学积分
    var score_tr_list = jQuery("tr[style$=height\\:25px\\;]");
	
	//成绩数字高亮显示~
	for(var x = 0; x< score_tr_list.length; x++ ){
		var score_td = score_tr_list.slice(x,x+1).children().slice(3,4);
		var full_txt = score_tr_list.slice(x,x+1).children().slice(5,6).text();
		var full_score = Number(full_txt.substr(0,full_txt.indexOf("分")));
		var txt = score_td.text();
		if( isNaN(txt) ){
			if(txt == "F")
				score_td.css({"font-weight":"bold","color":"red"});
			else
				score_td.css({"font-weight":"bold","color":"blue"});
		}else{
			var score = Number(txt);
			score = score / full_score;
			if(score < 0.6)
				score_td.css({"font-weight":"bold","color":"red"});
			else
				score_td.css({"font-weight":"bold","color":"blue"});
		}
	}
	
	
	//颜色啦啦啦
    score_tr_list.mouseover(function(){
            jQuery(this).css("background-color","#CFC");
	});
    score_tr_list.mouseout(function(){
        if(jQuery(this).attr("clicked") == "1")
            jQuery(this).css("background-color","#FC9");
        else
            jQuery(this).css("background-color","");
	});
	
	jQuery("#select_all_lessons").click(function(){
	if(jQuery(this).attr("all") == 1){
		jQuery(this).text("全选");
		jQuery(this).attr("all","-1");
		score_tr_list.attr("clicked","0");
		score_tr_list.css("background-color","");
	}else{
		jQuery(this).text("全不选");
		jQuery(this).attr("all","1");
		score_tr_list.attr("clicked","1");
		score_tr_list.css("background-color","#FC9");
	
	}
		//算选中的gpa
        avg_score = calculate_selected_score();
        //显示出来
        jQuery("#avg_score").text(avg_score.toFixed(2));
	});
	
	
	score_tr_list.click(function(){
		if(jQuery(this).attr("clicked") == "1"){
			jQuery("#select_all_lessons").text("全选");
			jQuery("#select_all_lessons").attr("all","0")
            jQuery(this).css("background-color","");
			jQuery(this).attr("clicked","0");
		}else{
            jQuery(this).attr("clicked","1");
            jQuery(this).css("background-color","#FC9");
		}
        
        
        //算选中的学积分
        avg_score = calculate_selected_score();
        
        //显示出来
        jQuery("#avg_score").text(avg_score.toFixed(2));
	});

}
function calculate_selected_score(){
	//算选中的学积分
	var score_tr_list_valid = jQuery("tr[clicked=1]");
	var lsn_score = [];
	var unit;
	var score;
	for(var x = 0; x < score_tr_list_valid.length; x++){
		var tr = score_tr_list_valid.slice(x,x+1);
		unit = Number(tr.children().slice(2,3).text());
		score = Number(tr.children().slice(3,4).text());
		if(isNaN(score)){
			var score_map = {"A":90,"B":75,"C":65,"D":60,"F":0}
			score = score_map[tr.children().slice(3,4).text()];
		}
		lsn_score.push({"unit":unit,"score":score});
	}
	var unit_sum = 0;
	var score_sum = 0;
	var avg_score;
	for(var x = 0; x < lsn_score.length; x++){
		unit_sum += lsn_score[x]["unit"];
		score_sum += lsn_score[x]["score"] * lsn_score[x]["unit"];
	}
	if(unit_sum == 0)
		avg_score = 0;
	else
		avg_score = score_sum / unit_sum;
	return avg_score;
}

function has_result_table(){
	var lblTitle = jQuery("span#lblTitle");
	if (lblTitle.text().length > 1)
		return true;
	else
		return false;
}



function index_show_score_query(){
    if(!inUrl("newsBoard/newsInside.aspx"))
        return 0;
	var l = jQuery("#Form1").children().length;
	jQuery("#Form1").children().slice(l-1,l).append("<tr><td class='tit' id='fold_index_score' style='cursor:pointer;'><img height='18' src='../imgs/arrowdown.gif' width='18'>本学期成绩(点我永久把成绩折叠)</td></tr><tr class='laohyx_tr'><td><div id='index_score_div'>正在查询成绩……</div></td></tr>");
	
	if(localStorage['fold_index_socre'] != undefined && localStorage['fold_index_socre'] == 1){
			jQuery("#index_score_div").slideToggle(0);
	}	
	jQuery('#fold_index_score').click(function(){
		
		localStorage['fold_index_socre'] = jQuery("#index_score_div").css("display") == "none"? 0 : 1;
		console.log(localStorage['fold_index_socre']);
		console.log(jQuery("#index_score_div").height());
		jQuery("#index_score_div").slideToggle();
		
	});
	setTimeout(function(){
		jQuery.ajax({
			type: 'GET',
			url: base_url + "/edu/StudentScore/B_StudentScoreQuery.aspx",
			data: {},
			async:true,
			success: function(html){
				var html = jQuery(html);
				//console.log(html);
				var vs = html.find("#__VIEWSTATE").val();
				var ev = html.find("#__EVENTVALIDATION").val();
				var data = {'ddlXN':opscore_year,'ddlXQ':opscore_semester,'__EVENTVALIDATION':ev,'__VIEWSTATE':vs,'txtKCDM':'','btnSearch':'  查  询  '};
				
				jQuery.ajax({
					type: 'POST',
					url: base_url + "/edu/StudentScore/B_StudentScoreQuery.aspx",
					data: data,
					async:true,
					success: function(html){				
						var html = jQuery(html);
						var score_table = html.find("#dgScore");
						jQuery("#index_score_div").empty();
						jQuery("#index_score_div").append(score_table);
					},
					dataType: "html"
				});

				
			},
			dataType: "html"
		});}
	,0);

}
