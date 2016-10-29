/**
 * Electsys++ Project
 * ----------------------------
 * 布局细节优化模块
 * 优化选课网细节部分
 * 上栏，左边栏等
 */

//左边的滚动条
function set_left_scroll()
{
/* 	if (!inUrl("/edu/student/sdtMain.aspx"))
        return 0;
        
    
	frameset1 = jQuery("frameset")[0];
	frameset2 = jQuery("frameset",frameset1)[0];
	frameset2.outerHTML = '<frameset cols="140,*" frameborder="NO" border="0" framespacing="0"><frame src="sdtleft.aspx" name="leftFrame" frameborder="no" marginwidth="0" marginheight="0"><frame src="../newsboard/newsinside.aspx" name="main" frameborder="no" scrolling="auto" marginwidth="0" marginheight="0"></frameset>';
 */
 }
function optimize_sdtleft()
{
	

	if (!inUrl("/edu/student/sdtleft.aspx"))
		return 0;
    
    //增加查询绩点
	if (option.getBool('enable_gpa_query', true)) {
		var score_line= jQuery("td[colspan=2]").slice(8,9).parent();
		var append_string = '<tr onmouseover="sbar(this)" onmouseout="cbar(this)" style=""><td><img src="../imgs/icon.menu.gif" width="25" height="15"></td><td class="menu"><a href="../StudentScore/StudentScoreQuery.aspx">查询绩点</a></td></tr><tr><td colspan="2"><img src="../imgs/leftline.gif" width="122" height="1"></td></tr>';
		score_line.after(jQuery(append_string));
	}
        
    //分享到人人
	var last_line= jQuery("td[colspan=2]").slice(1,2).parent();
	var line_string = '<tr><td colspan="2"><img src="../imgs/leftline.gif" width="122" height="1"></td></tr>';
	var share_link = '<tr onmouseover="sbar(this)" onmouseout="cbar(this)"><td><img src="../imgs/icon.menu.gif" width="25" height="15"></td><td class="menu"><div style="position:relative;width:110px;"><a href="https://github.com/laohyx/electsys/" target="_blank">我爱选课</a></div></td></tr>';
	last_line.after(jQuery(share_link + line_string));
	
    
    /*
    //可展开、折叠
	var toggle_links = jQuery("a[href=#]");
	var KB = {};
	var KB_name = "";
	for(x = 0; x < toggle_links.length; x++){
		KB_name = toggle_links.slice(x,x+1).attr("onclick").substr(10,3);
		KB[KB_name] = 0;
		toggle_links.slice(x,x+1).click(function(){
			var KB_name = jQuery(this).attr("onclick").substr(10,3);
			jQuery("div#" + KB_name + "Child").slideToggle("fast");
		});
	}
	//预先折叠几个。。。

	jQuery("div#KB2Child").slideToggle(0);
	jQuery("div#KB3Child").slideToggle(0);
	jQuery("div#KB4Child").slideToggle(0);
	jQuery("div#KB7Child").slideToggle(0);
	jQuery("div#KB5Child").slideToggle(0);
	*/
}

function optimize_flattop_content(){
	if (!inUrl("/edu/include/flattop.htm"))
		return 0;
}

function optimize_flattop(){
	if (!inUrl("/edu/student/sdtMain.aspx"))
		return 0;
	var div_pos = 80;
	
	// Ad switch is not used
    // var optimize_flattop_fixed_div = jQuery('<div id="optimize_flattop_fixed_div" style="color:white;font-size:12px;margin:0px;width:100px;height:25px;z-index: 999;position:fixed;line-height:25px;top:'+String(div_pos)+'px;right:0px;text-align:center;background-color:#ffae00;cursor:pointer;">隐藏/显示推荐</div>');
    // jQuery("html").append(optimize_flattop_fixed_div);

    var optimize_bottom_fixed_div = jQuery('<div id="optimize_bottom_fixed_div" style="color:black;font-size:12px;margin:0px;z-index: 999;position:fixed;bottom:0px;right:20px;a:visited">Optimized by electsys++ ' + option.get('extension_version') + ' - <a href="https://github.com/laohyx/electsys" target="_blank" style="color: rgb(17, 85, 204);">electsys++ Project</a></div>');
    jQuery("html").append(optimize_bottom_fixed_div);
    jQuery("#optimize_bottom_fixed_div").click(function(){
        jQuery(this).hide();
    });
    
	jQuery("#optimize_flattop_fixed_div").click(function(){
        window.location.reload();
    });
}
/*
function flattopToggle(){
    theta = 0;
}

function optimize_flattop(){
	if (!inUrl("/edu/student/sdtMain.aspx"))
		return 0;
    var optimize_flattop_fixed_div = jQuery('<div id="optimize_flattop_fixed_div" style="color:white;font-size:12px;margin:0px;width:100px;height:25px;z-index: 999;position:fixed;line-height:25px;top:80px;right:0px;text-align:center;background-color:#ffae00;cursor:pointer;">展开/收起上栏</div>');
    jQuery("html").append(optimize_flattop_fixed_div);

    var optimize_bottom_fixed_div = jQuery('<div id="optimize_bottom_fixed_div" style="color:black;font-size:12px;margin:0px;z-index: 999;position:fixed;bottom:0px;right:20px;a:visited">Optimized by electsys++ ' + localStorage['extension_version'] + ' - <a href="https://github.com/laohyx/electsys" target="_blank">electsys++ Project</a></div>');
    jQuery("html").append(optimize_bottom_fixed_div);
    jQuery("#optimize_bottom_fixed_div").click(function(){
        jQuery(this).hide();
    });
    
    if (localStorage["flattop_slide"] < 0){
		jQuery("frameset").slice(0,1).attr("rows", "25,*");
        jQuery("#optimize_flattop_fixed_div").css("top","0");
    }else{
		localStorage["flattop_slide"] = 1;
    }
   	    jQuery("#optimize_flattop_fixed_div").click(function(){
        flattopToggle(500);
        localStorage["flattop_slide"] *= -1;
    });
}

function flattopToggle(time){
    theta = 0;
    if(jQuery("frameset").slice(0,1).attr("rows") == "105,*")
    {  
        slide_id = setInterval("slide_flattop(-1);",time / 100);
    }else{
        slide_id = setInterval("slide_flattop(1);",time / 100);
    }

}
function slide_flattop(height_direction){
    delta_h = Math.sin((theta - 0.5) * Math.PI) * (40 * height_direction) + 65;
    theta += 0.01;
    jQuery("#optimize_flattop_fixed_div").css("top",delta_h - 25);
    jQuery("frameset").slice(0,1).attr("rows", delta_h + ",*");
    if(theta > 0.98)
    {
        jQuery("#optimize_flattop_fixed_div").css("top",40 + 40 * height_direction);
        jQuery("frameset").slice(0,1).attr("rows", 65 + 40 * height_direction + ",*");
        clearInterval(slide_id);
    }
}
*/