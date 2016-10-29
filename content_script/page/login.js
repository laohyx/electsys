/**
 * Electsys++ Project
 * ----------------------------
 * 登录优化模块
 */

function set_index_page(){
	return;
	jQuery("tr[align=center]").slice(3,4).html('<td colspan="3" style="font-size:9px;"><input type="checkbox" id="save_account"><label for="save_account">保存账户信息到electsys++</label><br><input type="submit" name="Button1" value="登陆" id="Button1" style="height:23px;width:61px;"></td>');
	if(option.get("uid", "").length > 3)
		jQuery("#save_account").attr("checked","1");
	jQuery("#Button1").click(function(){
		check_submit();
	});
	
	
	return;
} 


function check_submit(){
	if(jQuery("#save_account").attr("checked")){
		option.set("uid", jQuery("#txtUserName").val());
		option.set("password", jQuery("#txtPwd").val());
	}else{
		
	}
	this.form.submit();
	

}
