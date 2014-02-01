function optimize_myEductionList(){
    if(!inUrl("/edu/StuStatusMange/MyGradList.aspx"))
        return 0;

    // 必修课部分
    var gpa_all = 0;
    var unit_all = 0;
    jQuery("#dgBX1").find("tr").each(function(){
        var score = jQuery(this).find("td:nth-child(6)").html();
        var unit = jQuery(this).find("td:nth-child(5)").html();
        var gpa = score2gpa(score);
        if (typeof(gpa) == "number"){
            gpa_all += gpa * parseInt(unit);
            unit_all += parseInt(unit);
        }
        jQuery(this).append("<td>" + gpa + "</td>");
    });
    var gpa_avg = gpa_all / unit_all;
    jQuery("#lbBxxf2").parent().append("必修课总GPA为：" + gpa_avg.toFixed(2));

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