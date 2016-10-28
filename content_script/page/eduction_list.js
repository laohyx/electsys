/**
 * Electsys++ Project
 * ----------------------------
 * 修业查看优化模块
 */

let edulist_gpa_global = {
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

function optimize_my_eduction_list() {
    if (!inUrl("/edu/GradAudit/MyGradList2013.aspx"))
        return 0;
    // 修复照片失效
    edulist_fix_photo();

    // 初始化
    edulist_gpa_global["units"] = 0;
    edulist_gpa_global["grades"] = 0;
    edulist_gpa_global["scores"] = 0;
    edulist_gpa_global["bixiu"] = edulist_gpa_column("#dgBX1", "#lbBxxf2", [6, 5, 7]); //必修
    edulist_gpa_global["tiyu"] = edulist_gpa_column("#dgPE", "#lbPE1", [6, 5, 7]); //体育
    edulist_gpa_global["liangke"] = edulist_gpa_column("#dgTH", "#lbTH1", [6, 5, 7]); //两课
    edulist_gpa_global["xianxuan"] = edulist_gpa_column("#dgXX2", "#lbXxxf1", [7, 6, 8]); //限选
    edulist_gpa_global["tongshi"] = edulist_gpa_column("#dgTsk2", "#lbTSK1", [7, 6, 9]); //通识
    edulist_gpa_global["gexinghua"] = edulist_gpa_column("#dgGxh2", "#lbGxxf1", [6, 5, 7]); //任选

    // 将统计结果显示在最上方的总表格中
    const p = `共修${edulist_gpa_global['units']}学分，` +
        `平均分为${(edulist_gpa_global["scores"] / edulist_gpa_global["units"]).toFixed(2)}，` + 
        `GPA为${(edulist_gpa_global["grades"] / edulist_gpa_global["units"]).toFixed(2)}`;

    jQuery("#form1 > table > tbody > tr:nth-child(6)")
        .after(`
            <tr><td>
                <fieldset style='width:900px'>
                    <legend>所有课程分数情况（由electsys++提供）</legend>
                    <table width='100%'>
                        <p>${p}</p>
                    </table>
                </fieldset>
            </td></tr>
        `);
}

function edulist_gpa_column(table, title, colomn) {
    /**
        @table: 成绩表格的id
        @title: 标题
        @colomn: 代表“成绩”，“学分”，“备注”所在列
    */
    let gpa_all = 0;
    let unit_all = 0;
    let score_all = 0;
    jQuery(table).find("tr").each(function () {
        const score = jQuery(this).find("td:nth-child(" + colomn[0] + ")").html();
        const unit = parseInt(jQuery(this).find("td:nth-child(" + colomn[1] + ")").html());
        const comment = jQuery(this).find("td:nth-child(" + colomn[2] + ")").html();
        const fixed_score = score_fix(score);
        let gpa = score2gpa(fixed_score);
        if (typeof (gpa) == "number" &&
            comment != "无需关注" &&
            comment != "尚未修读" &&
            comment != "正在修读" &&
            gpa >= 0
        ) {
            gpa_all += gpa * unit;
            unit_all += unit;
            score_all += fixed_score * unit;
            edulist_gpa_global["scores"] += fixed_score * unit;
            edulist_gpa_global["units"] += unit;
            edulist_gpa_global["grades"] += gpa * unit;

            // Convert gpa to string
            gpa = gpa.toFixed(1);
        } else if (gpa != "绩点") {
            gpa = "未计入计算";
        }
        jQuery(this).append("<td>" + gpa + "</td>");
    });

    //项目数量最小为 1
    unit_all = Math.max(1, unit_all);
    const gpa_avg = gpa_all / unit_all;
    const score_avg = score_all / unit_all;
    jQuery(title).parent()
        .append(`本部分课程GPA为：${gpa_avg.toFixed(2)}，平均分为：${score_avg.toFixed(2)}`);
}

function edulist_fix_photo() {
    jQuery('#imgPhoto')
        .on('error', function () {
            let img = jQuery(this);
            let rawUrl = img.attr('src');
            let matchResult = rawUrl.match(/xh=([0-9]+)/);

            // 图片有效，不作替换
            if (this.naturalHeight > 1 ||  this.naturalWidth > 1) {
                return;
            }

            if (!matchResult) {
                return;
            }

            let newUrl = `/edu/StuStatusMange/StuPhoto.aspx?xh=${matchResult[1]}`;
            // 验证替换地址有效性后再替换图片
            jQuery.get(newUrl, function () {
                img.attr('src', newUrl);
            });
        })
        // 解决 on('error') 有时不起作用的问题
        .attr('onerror', 'console.log("Avatar broken")');
}
