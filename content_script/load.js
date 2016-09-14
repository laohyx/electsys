// Support both Chrome & other browsers
if (!browser && chrome) {
	var browser = chrome;
}

jQuery.get(
    browser.extension.getURL("manifest.json"),
    function(data){
        localStorage['extension_version'] = data['version'];
    },
    "json"
);



jQuery.extend(jQuery, {
    inJSON: function(json, key){
        var hit, hits = [];
        jQuery.each(json, function(k,v){
            if (k === key)
                hits.push(v);
            if (typeof(v) === "string"){
                return true;
            } else if (jQuery.isArray(v) || jQuery.isPlainObject(v)) {
                var r = jQuery.inJSON(v, key);
                if (r.length > 0)
                    hits = hits.concat(r);
            }
        });
        return hits;
    }
});


Array.prototype.distinct = function() { 
	var a = {}, c = [], l = this.length; 
	for (var i = 0; i < l; i++) { 
	var b = this[i]; 
	var d = (typeof b) + b; 
	if (a[d] === undefined) { 
	c.push(b); 
	a[d] = 1; 
	} 
	} 
	return c; 
} 

function inUrl(url){
    // Iterate if url is an array
	if(Array.isArray(url)) {
		var len = url.length;
		for (var i = 0; i < len; ++i) {
            if (inUrl(url[i])) {
                return true;
            }
        }

        return false;
    }

	return (document.URL.toLowerCase().indexOf(url.toLowerCase()) != -1);
}

opscore_year = "2012-2013";
opscore_semester = "1";

function getSemester(){
    var day = new Date();
    var y = day.getFullYear();
    var m = day.getMonth() + 1;

    if (m < 3){
        opscore_year = (y-1) + "-" + y;
        opscore_semester = "1";
    }else if (m < 9){
        opscore_year = (y-1) + "-" + y;
        opscore_semester = "2";
    }else{
        opscore_year = y + "-" + (y+1);
        opscore_semester = "1";
    }
    return;
}

getSemester();

function main()
{
	jQuery.noConflict();
	jQuery(document).ready(function(){
        
		base_url = document.URL.slice(0,document.URL.indexOf("sjtu.edu.cn") + 11);
		
		//设置首页checkbox
		set_index_page();
		//优化左边菜单栏 
		set_left_scroll();
		//优化左边折叠栏
		optimize_sdtleft();
		//优化上栏
		optimize_flattop();
		optimize_flattop_content();
		//优化选课（重点）  
		optimize_elect();
        optimize_elect_warning();
		
		//成绩查询
		optimize_score_query();
		//绩点查询
		optimize_gpa_query();
		//首页显示成绩
		//index_show_score_query();
        //修业查看中计算总绩点
        optimize_myEductionList();

		//核心课程追加绩点
		optimize_core_course();

		//快速评教
		fast_eval_index();
		fast_eval_process();
        
        //快速评教，期中
        fast_eval_midterm_index () ;
        fast_eval_midterm_process();
		
		// NHCE - -
		nhce_main();
	});
}




jQuery(document).ready(function () {
	main();
});




/*

	更新日志（从1.9.5才开始写）：
	2.4.1 - 2016/9/4
		去除了广告。发布到了应用商店。

    2.4 - 2014/1/27
   		tq5124, 更新日志改写在git中

    2.3.19 - 2013/12/11
        优化处理队列，加大间隔，增加错误重试

    2.3.18 - 2013/12/11
        选课网限制刷新频率，修改为手动点查

    2.3.14 - 2012/12/26
        修改“刷新信息”按钮的样式。
        计划下一版本开源啊！
        
    2.3.13 - 2012/11/12
        （为什么空下那么多版本号？)
		修复查积点的小bug。（招安= =他们还懒得搞呢）
        
        
	2.3.8/2.2.9 - 2012/06/28
		关闭左边菜单栏优化。（唉，被招安了。。）
		
	2.3.7 - 2012/06/23
        修改版本号显示方式，同步与插件版本更新。
        
	2.3.6 - 2012/06/22
		修改查任选课中的一个经典BUG（竟然将POST data中的‘$’文本替换成了jQuery...）
		增加对于无安排的课程出现“无”的提示。
		姑娘21号晚回家了。祝她有个美好的周末~
		
	2.3.5 - 2012/06/21
		美化一下logo。
		增加了删除老插件的功能，成功避免冲突。

	2.3.3 - 2012/06/20
		修改logo。
		修复“参数错误的bug”，在读取满不满时点击查询，不会出现“参数错误”的提示。
		
	2.3.1 - 2012/06/18 (WebStore分支，难道开创了奇偶数版本的时代？)
        取2.1.9的查课程代码，并加以修改，更快速稳定。
		（还是靠学校开放接口啊…………）
		
	2.2.6 - 2012/06/16
        修复首页成绩显示的BUG。

	2.2.5 - 2012/06/11
        不做测试悔死人啊！！
		官网链接竟然不分大小写的- -

  	2.2.4 - 2012/06/11
        不做测试悔死人啊！！
		修正一小小bug。。。
	2.2.3 - 2012/06/11
        首页出现本学期的成绩。

	2.2.2 - 2012/06/05
        NHCE 第三册、第四册的听力部分ok
		甚至修改了Next按键的链接，直接跳过说的部分。
		
  	2.2.1 - 2012/06/04
        划时代地加入了NCHE（新视野大学英语）网站的答题功能。
        第三册的听力部分全部自动答题，s和n键可以用来用为Submit和Next.
        在纠结用不用把第二册和第四册做掉呢。。。。。

	2.2.0 - 2012/05/25
		2012-2013第一学期选课开始
		他们关闭了查课，那么我就用我自己的网站来查！
		修改lesson.js里post函数链接，直接从electsys.net得到。
	
	2.1.17 - 2012/05/09
		暑假小学期第一次更新，功能不多，把“满不满”样式恢复到传统模式。。。
		求JWC给我点接口什么的……
		
	2.1.14 - 2012/04/01
		愚人节快乐！
		
	2.1.10 - 2012/02/12
		选课网增加对POST频率的检测机制，暂时关闭POST功能。
		尼玛难道要做不下去了么？
		
	2.1.9 - 2012/01/??
		不知道做了些什么。。
		
	2.1.8 - 2011/12/21
		那个问题果然没解决，手动去掉关闭功能。
		
	2.1.7 - 2011/12/19
		修改控制页面的链接，解决缓存问题（也不知能不能解决）

	2.1.5 - 2011/12/10
		根据jwc通知增加冲抵通识课的任选课列表。
		增强域名兼容性。
		
	2.1.4 - 2011/12/8 
		修改部分代码改为jQuery API，增强兼容性。
		增加lesson_enable_check功能，可以选择开关功能，避免抢选时增加服务器压力。
		
	2.1.3 - 2011/12/6 早晨
		修改颜色块的样式，好看多了吧……
		修改统计链接的增加方式，减少性能消耗。

	2.1.2 - 2011/12/5 晚上
		修改draw div的位置，使得其绘制不影响表格各列的宽度。

	2.1.1 - 2011/12/5 晚上
		修复bug：electsys0下post数据到electsys.sjtu.edu.cn   增加base_url解决
		修改推广链接，到electsys.net，总比分享到人人好吧……
		
    2.1.0 - 2011/12/5 下午
		增加了好多功能啊。。
        修改选课时标记颜色，比原来的柔和多了……
        点课程的单选圆圈就可以查看课程安排了！
        在课程安排中显示该老师的评教数据！
		
	2.0.5 - 2011/12/1 晚上
		修正2.0.4增加的联动功能没用的bug - -#
		Bug reported by Popacai.(专业测试员~)
		
	2.0.4 - 2011/12/1 下午
		增加分数联动功能，但是分数太整齐...

	2.0.3 - 2011/12/1
		优化判断链接，支持electsys0 和不带0的
		增加“快速评教功能”
		纪念下，2011年11月29日，electsys.net上线

	2.0.2 - 2011/11/22
		将判断链接由electsys0.sjtu.edu.cn/*改为electsys.sjtu.edu.cn/*
		
	2.0.1 - 2011/10/22       (from 2011/9/10)
	    修改后台为异步post方式。
		在登录后停止后台查询。
		//在首页支持记录账号数据。(关闭)
	
	2.0.0 - 2011/8/3 （未发布）
	    增加后台查成绩功能。
		增加工具栏图标，有各种小提示。。。
		
	1.9.5 - 2011/7/18
		将dom操作全部改为jquery API，增加可移植性。
		将load.js分解成四个文件，方便管理。
		修复算平均分时遇到字母时出错的bug。
		增加算平均分全选的功能。
 */