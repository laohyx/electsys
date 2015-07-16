function optimize_myEductionList(){
    if(!inUrl("/edu/StuStatusMange/MyGradList.aspx"))
        return 0;

    gpa_colomn("#dgBX1", "#lbBxxf2", [6,5,7]); //必修
    gpa_colomn("#dgPE", "#lbPE1", [6,5,7]); //体育
    gpa_colomn("#dgTH", "#lbTH1", [6,5,7]); //两课
    gpa_colomn("#dgXX2", "#lbXxxf1", [7,6,8]); //限选
    gpa_colomn("#dgTsk2", "#lbTSK1", [7,6,9]); //通识
    gpa_colomn("#dgGxh2", "#lbGxxf1", [6,5,7]); //任选

}

function gpa_colomn(table, title, colomn){
    /**
        @table: 成绩表格的id
        @title: 标题
        @colomn: 每个表格的“成绩”等所在列不一样，用colomn表示取那一列
    */
    var gpa_all = 0;
    var unit_all = 0;
    var score_all = 0;
    jQuery(table).find("tr").each(function(){
        var score = jQuery(this).find("td:nth-child(" + colomn[0] +")").html();
        var unit = jQuery(this).find("td:nth-child(" + colomn[1] +")").html();
        var comment = jQuery(this).find("td:nth-child(" + colomn[2] +")").html();
        var gpa = score2gpa(score);
        if (typeof(gpa) == "number" && comment != "无需关注" && comment != "尚未修读"){
            gpa_all += gpa * parseInt(unit);
            unit_all += parseInt(unit);
            score_all += score * parseInt(unit);
        }
        if (comment == "无需关注" || comment == "尚未修读"){
            gpa = comment;
        }
        jQuery(this).append("<td>" + gpa + "</td>");
    });
    var gpa_avg = gpa_all / unit_all;
    var score_avg = score_all / unit_all;
    jQuery(title).parent().append("。 必修课总GPA为：" + gpa_avg.toFixed(2) + "，平均分为：" + score_avg.toFixed(2));
}

function score2gpa(score){
    // not quite sure
    if (score == "成绩"){
        return "GPA";
    }
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
    return "";
}