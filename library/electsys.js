function Electsys(input_uid, input_password){
	var _this = this;
	var uid;
	var password;
	var confirmed;
	_this.viewstate = "";
	_this.eventvalidation = "";
	var html;
	var init = function(){
		uid = input_uid;
		password = input_password;
		confirmed = 0 ;
	}
	init();

	_this.login = function(){
		//得到首页信息
		$.ajax({
			type: 'GET',
			url: "http://electsys0.sjtu.edu.cn/edu/index.aspx",
			data: {},
			async:true,
			success: function(data){
				html = $(data);
				_this.viewstate = $("#__VIEWSTATE",html).val();
				_this.eventvalidation = $("#__EVENTVALIDATION",html).val();
				var post_data = {"__VIEWSTATE": _this.viewstate, "__EVENTVALIDATION": _this.eventvalidation, "txtUserName": uid, "txtPwd": password, "rbtnLst_1": "1", "Button1": "登陆"};

				//登录
				$.ajax({
					type: 'POST',
					url: "http://electsys0.sjtu.edu.cn/edu/index.aspx",
					data: post_data,
					async: true,
					success: function(data){
						if(data.indexOf("frameset") > -1)
							localStorage["account_confirmed"] = 1;
						else{
							localStorage["account_confirmed"] = 0;
						}
						if(localStorage["account_confirmed"] == 0){
							chrome.browserAction.setBadgeBackgroundColor({"color":[255, 0, 0, 255]});
							chrome.browserAction.setBadgeText({"text":"x"});
						}else{
							//正确，向background发出请求
							chrome.browserAction.setBadgeBackgroundColor({"color":[0, 255, 0, 255]});
							chrome.browserAction.setBadgeText({"text":"ok"});
						}
						get_lesson();
					},
					dataType: "html"
				});//end of $.ajax
			},
			dataType: "html"
		});//end of $.ajax
	}//end of _this.login
	
	_this.get = function(url){
		//得到首页信息
		$.ajax({
			type: 'GET',
			url: url,
			data: {},
			async:false,

			success: function(data){
				html = $(data);
				_this.viewstate = $("#__VIEWSTATE",html).val();
				_this.eventvalidation = $("#__EVENTVALIDATION",html).val();
				html = data;
			},
			dataType: "html"
		});//end of $.ajax
		return html;
		
	}//end of _this.get
	_this.post = function(url, postfield){
		$.ajax({
			type: 'POST',
			url: url,
			data: postfield,
			async: false,
			success: function(data){
				html = data;
			},
			dataType: "html"
		});//end of $.ajax
		return html;
		
	}//end of _this.post



}



function checkAccount() {
	if(localStorage["uid"] == undefined)
		return;
	if (localStorage["uid"] != localStorage["last_valid_uid"]){
		localStorage.removeItem("score_info");
		localStorage.removeItem("unread_score_info");
	}
	if (localStorage["uid"].length < 3)
		return ;

	var ele = new Electsys(localStorage["uid"], localStorage["password"]);
	var html = ele.get("http://electsys0.sjtu.edu.cn/edu/student/sdtleft.aspx");
	html = $(html);
	// cancel the query action while you are logged in.
	if($("#lblXm",html).text().length > 1){
//        console.log("logged in and we don't login again.");
//        console.log($("#lblXm",html).text());
		return;
	}
//    console.log("login action");
	var result = ele.login();
}




function get_lesson(){
	//chrome.browserAction.setBadgeBackgroundColor({"color":[255, 0, 0, 255]});
	//chrome.browserAction.setBadgeText({"text":"~"});
	var year = "2010-2011";
	var semester = "2";
	
	var ele = new Electsys(localStorage["uid"], localStorage["password"]);
	result = ele.get("http://electsys0.sjtu.edu.cn/edu/StudentScore/B_StudentScoreQuery.aspx");
	result = ele.post("http://electsys0.sjtu.edu.cn/edu/StudentScore/B_StudentScoreQuery.aspx",
				{"__VIEWSTATE": ele.viewstate, "__EVENTVALIDATION": ele.eventvalidation, "txtKCDM": "", "ddlXN": year, "ddlXQ": semester, "btnSearch": "  查  询  "});
	var dom = $(result);
	localStorage["temp"] = result;
	var score_tr_list = $("tr[style$=height\\:25px\\;]", dom);
	
	var lsn_score = [];
	var unit;
	var score;
	for(var x = 0; x < score_tr_list.length; x++){
		var tr = score_tr_list.slice(x,x+1);
		var id = tr.children().slice(0,1).text().trim();
		var name = tr.children().slice(1,2).text().trim();
		var score = tr.children().slice(3,4).text().trim();
		lsn_score.push({"id":id,"name":name,"score":score});
		
	}
	if(!localStorage["score_info"]){
		localStorage["score_info"] = JSON.stringify({"2010-2011-2" : lsn_score});
	}else{	
		var score_json = JSON.parse(localStorage["score_info"]);
		if(lsn_score.length > score_json["2010-2011-2"].length){
			//提示
			chrome.browserAction.setBadgeBackgroundColor({"color":[255, 0, 0, 255]});
			chrome.browserAction.setBadgeText({"text": String(lsn_score.length - JSON.parse(localStorage["score_info"])["2010-2011-2"].length)});
			//将未读的存至localStorage["unread_score_info"]
			var former_score = JSON.parse(localStorage["score_info"])["2010-2011-2"];
			var unread_score = [];
			for(var x = 0; x < lsn_score.length; x++){
				var lsn_id = lsn_score[x]["id"];
				var next = 0;
				for(var y = 0; y < former_score.length; y++){
					if(former_score[y]["id"] == lsn_id){
						next = 1;
						break;
					}
				}
				if(next == 0){//是新的成绩
					unread_score.push(lsn_score[x]);
				}
			}
			localStorage["unread_score_info"] = JSON.stringify({"2010-2011-2" : unread_score});
		}
	}
	localStorage["last_valid_uid"] = localStorage["uid"];
	
}

$(document).ready(function(){

	$.getJSON(
		chrome.extension.getURL("manifest.json"),
		function(data) {
			$("#version_span").text(data["version"]);
		}
	);

});//document.ready
