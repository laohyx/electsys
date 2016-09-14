let gpa_global = {
    "bixiu": 0,
    "xianxuan": 0,
    "tongshi": 0,
    "gexinghua": 0,
    "tiyu": 0,
    "liangke": 0,
    "units": 0,
    "grades": 0,
    "scores": 0
};

function optimize_myEductionList(){
    if(!inUrl("/edu/GradAudit/MyGradList2013.aspx"))
        return 0;
    // 修复照片失效
    fix_educationlist_photo();

    // 初始化
    gpa_global["units"] = 0;
    gpa_global["grades"] = 0;
    gpa_global["scores"] = 0;
    gpa_global["bixiu"] = gpa_colomn("#dgBX1", "#lbBxxf2", [6,5,7]); //必修
    gpa_global["tiyu"] = gpa_colomn("#dgPE", "#lbPE1", [6,5,7]); //体育
    gpa_global["liangke"] = gpa_colomn("#dgTH", "#lbTH1", [6,5,7]); //两课
    gpa_global["xianxuan"] = gpa_colomn("#dgXX2", "#lbXxxf1", [7,6,8]); //限选
    gpa_global["tongshi"] = gpa_colomn("#dgTsk2", "#lbTSK1", [7,6,9]); //通识
    gpa_global["gexinghua"] = gpa_colomn("#dgGxh2", "#lbGxxf1", [6,5,7]); //任选

    // 将统计结果显示在最上方的总表格中
    const p = `共修${gpa_global['units']}学分，平均分为${(gpa_global["scores"]/gpa_global["units"]).toFixed(2)}，平均GPA为${(gpa_global["grades"]/gpa_global["units"]).toFixed(2)}`;
    jQuery("#form1 > table > tbody > tr:nth-child(6)").after(`<tr><td><fieldset style='width:900px'><legend>所有课程分数情况（由electsys++提供）</legend><table width='100%'><p>${p}</p></table></fieldset></td></tr>`);
}

function gpa_colomn(table, title, colomn){
    /**
        @table: 成绩表格的id
        @title: 标题
        @colomn: 代表“成绩”，“学分”，“备注”所在列
    */
    let gpa_all = 0;
    let unit_all = 0;
    let score_all = 0;
    jQuery(table).find("tr").each(function(){
        const score = jQuery(this).find("td:nth-child(" + colomn[0] +")").html();
        const unit = parseInt(jQuery(this).find("td:nth-child(" + colomn[1] +")").html());
        const comment = jQuery(this).find("td:nth-child(" + colomn[2] +")").html();
        const fixed_score = score_fix(score);
        let gpa = score2gpa(fixed_score);
        if (typeof(gpa) == "number" && comment != "无需关注" && comment != "尚未修读" && comment != "正在修读" && gpa >= 0){
            gpa_all += gpa * unit;
            unit_all += unit;
            score_all += fixed_score * unit;
            gpa_global["scores"] += fixed_score * unit;
            gpa_global["units"] += unit;
            gpa_global["grades"] += gpa * unit;

            // Convert gpa to string
            gpa = gpa.toFixed(1);
        }
        else if (gpa != "GPA") {
            gpa = "未计入计算";
        }
        jQuery(this).append("<td>" + gpa + "</td>");
    });

    //项目数量最小为 1
    unit_all = Math.max(1, unit_all);
    const gpa_avg = gpa_all / unit_all;
    const score_avg = score_all / unit_all;
    jQuery(title).parent().append(`本部分课程总GPA为：${gpa_avg.toFixed(2)}，平均分为：${score_avg.toFixed(2)}`);
}

function score_fix(score) {
    // 对于P的处理待改进
    switch (score) {
        case "成绩":
            return "GPA"
        case "A+":
            return 95
        case "A":
            return 90
        case "A-":
            return 85
        case "B+":
            return 80
        case "B":
            return 75
        case "B-":
            return 70
        case "C+":
            return 67
        case "C":
            return 65
        case "C-":
            return 63
        case "D":
            return 60
        default:
            return score;
    }
}

function score2gpa(score){
    if (score >= 0) {
        if (score >= 95){
            return 4.30;
        }else if (score >= 90){
            return 4.00;
        }else if (score >= 85){
            return 3.70;
        }else if (score >= 80){
            return 3.30;
        }else if (score >= 75){
            return 3.00;
        }else if (score >= 70){
            return 2.70;
        }else if (score >= 67){
            return 2.30;
        }else if (score >= 65){
            return 2.00;
        }else if (score >= 63){
            return 1.70;
        }else if (score >= 60){
            return 1.00;
        }else{
            return 0.00;
        }
    }
    return score;
}

function fix_educationlist_photo(){
    jQuery('#imgPhoto').on('error', function () {
        let img = jQuery(this);
        let rawUrl = img.attr('src');
        let matchResult = rawUrl.match(/xh=([0-9]+)/);

        if (!matchResult) {
            return;
        }

        let newUrl = `/edu/StuStatusMange/StuPhoto.aspx?xh=${matchResult[1]}`;
        // 验证替换地址有效性后再替换图片
        jQuery.get(newUrl, function () {
            img.attr('src', newUrl);
        });
    });
}
