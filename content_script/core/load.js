/**
 * Electsys++ Project
 * ----------------------------
 * 初始化模块
 */

// Support both Chrome & other browsers
if (!browser && chrome) {
    var browser = chrome;
}

jQuery.get(
    browser.extension.getURL("manifest.json"),
    function(data){
        option.set("extension_version", data["version"]);
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
    //修业查看中计算总绩点
    optimize_my_eduction_list();

    //核心课程追加绩点
    optimize_core_course();

    //首页
    optimize_index();

    //快速评教
    fast_eval_index();
    fast_eval_process();
    
    //快速评教，期中
    fast_eval_midterm_index();
    fast_eval_midterm_process();
    
    // NHCE - -
    nhce_main();
}


jQuery(document).ready(function () {
    main();
});
