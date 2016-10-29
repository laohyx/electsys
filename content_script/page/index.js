/**
 * Electsys++ Project
 * ----------------------------
 * 首页优化模块
 */

/**
 * 模块入口
 */
function optimize_index() {
    if (!inUrl("newsBoard/newsInside.aspx"))
        return 0;

    optimize_index_score_query();
}

/**
 * 首页插入成绩
 */
function optimize_index_score_query() {
    let l = jQuery("#Form1").children().length;
    jQuery("#Form1")
        .children().slice(l - 1, l)
        .append(`
            <tr>
                <td class='tit' id='fold_index_score' style='cursor:pointer;'>
                    <img height='18' src='../imgs/arrowdown.gif' width='18'>本学期成绩
                    <span style='font-size: 0.8em; float: right; letter-spacing: 0;'>折叠/展开</span>
                </td>
            </tr>
            <tr class='laohyx_tr'><td>
            <div id='index_score_div' style='padding-top: 2px;'>
                <p><span style='cursor: pointer;'>点击此处查询</span></p>
            </div>
        </td></tr>
        `);
    
    jQuery('#fold_index_score').click(function () {
        option.set('fold_index_socre', jQuery("#index_score_div").css("display") != "none");
        //console.log(localStorage['fold_index_socre']);
        //console.log(jQuery("#index_score_div").height());
        jQuery("#index_score_div").slideToggle();
    });

    if (option.getBool('fold_index_socre')) {
        jQuery("#index_score_div").slideToggle(0);
        index_show_score_register_click();
    } else {
        jQuery("#index_score_div > p").text('正在查询成绩……');
        index_show_score_query();
    }
}

/**
 * 注册点击事件
 */
function index_show_score_register_click() {
    jQuery('#index_score_div span').click(function (e) {
        jQuery(this).parent().text('正在查询成绩……');
        index_show_score_query();

        e.preventDefault();
    });
}

/**
 * 加载成绩
 */
function index_show_score_query() {
    // 查询所有成绩后筛选，避免和用户手动查询冲突
    jQuery.get(base_url + '/edu/StudentScore/B_StudentScoreQuery.aspx')
        // 使用 Promise 避免回调地狱
        .then(function (html) {
            html = jQuery(html);
            //console.log(html);
            let vs = html.find('#__VIEWSTATE').val();
            let vg = html.find('#__VIEWSTATEGENERATOR').val();
            let ev = html.find('#__EVENTVALIDATION').val();

            return jQuery.post(
                base_url + '/edu/StudentScore/B_StudentScoreQuery.aspx',
                {
                    '__EVENTVALIDATION': ev,
                    '__VIEWSTATE': vs,
                    '__VIEWSTATEGENERATOR': vg,
                    'ddlXN': opscore_year,
                    'ddlXQ': opscore_semester,
                    'txtKCDM': '',
                    'btnSearchDetail': '查询明细成绩单'
                }
            );
        })
        .then(function (html) {
            html = jQuery(html);
            let score_table = html.find('#dgScore');
            if (score_table.length == 0) {
                throw new Error('Incorrect page loaed');
            }

            // 删除非最终成绩行
            score_table.find('tr')
                .filter(function (index) {
                    // 删除无用列
                    jQuery(this).children('td').eq(-1).remove();

                    // 表头
                    if (index == 0)
                        return false;

                    let not_final = jQuery(this).children('td').eq(-1).text().trim() != '是';
                    return not_final;
                })
                .remove();
            
            // 补偿样式
            score_table.find('tbody > tr:nth-child(odd)')
                .removeClass('tdcolour2')
                .addClass('tdcolour1');
            score_table.find('tbody > tr:nth-child(even)')
                .removeClass('tdcolour1')
                .addClass('tdcolour2');

            // 插入表格到页面中
            jQuery('#index_score_div')
                .empty()
                .append(score_table);
        })
        .catch(function () {
            jQuery('#index_score_div')
                .empty()
                .append(`<p>加载失败，请稍后<span style="cursor: pointer; color: #2a6496;">重试</span>~</p>`);
            
            index_show_score_register_click();
        });
}

function index_insert_ad() {

}
